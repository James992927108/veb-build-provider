import re
import sys
import os

def expand_variables(content):
    variables = {}
    expanded_lines = []
    missing_variables = set()
    
    # First pass: collect all variable definitions
    for line in content.split('\n'):
        match = re.match(r'(\w+)\s*=\s*(.*)', line)
        if match:
            var_name, var_value = match.groups()
            variables[var_name] = var_value.strip()

    # Function to recursively expand variable values
    def recursive_expand(value):
        prev_value = None
        while prev_value != value:
            prev_value = value
            # Replace any $(var_name) in the value with actual variable content
            for var_name, var_content in variables.items():
                value = value.replace(f'$({var_name})', var_content)
        return value

    # Second pass: expand variables while preserving format
    current_definition = None
    original_parts = []
    
    for line in content.split('\n'):
        # Check if this is a new variable definition
        match = re.match(r'(\w+)\s*=\s*(.*)', line)
        if match:
            # If we had a previous definition, process and store it
            if current_definition:
                expanded_lines.extend(process_definition(current_definition, original_parts, recursive_expand, missing_variables))
            
            # Start new definition
            current_definition = match.group(1)
            original_parts = [line]
        elif line.strip().endswith('\\') and current_definition:
            # Continue collecting parts of multi-line definition
            original_parts.append(line)
        elif current_definition:
            # Last line of multi-line definition
            original_parts.append(line)
            expanded_lines.extend(process_definition(current_definition, original_parts, recursive_expand, missing_variables))
            current_definition = None
            original_parts = []
        else:
            # Not part of a variable definition
            expanded_lines.append(line)
    
    # Process last definition if exists
    if current_definition:
        expanded_lines.extend(process_definition(current_definition, original_parts, recursive_expand, missing_variables))

    return expanded_lines, missing_variables

def process_definition(var_name, original_parts, recursive_expand, missing_variables):
    result_lines = []
    
    # Process first line (with variable name)
    first_line = original_parts[0]
    match = re.match(r'(\w+\s*=\s*)(.*)', first_line)
    if match:
        prefix, value = match.groups()
        
        # Find all variables that need to be expanded
        if '$(' in value:
            expanded_value = recursive_expand(value)
            # Check for any remaining unexpanded variables
            remaining_vars = re.findall(r'\$\((\w+)\)', expanded_value)
            for var in remaining_vars:
                missing_variables.add((var, first_line.strip()))
            # Add original as comment if different
            if expanded_value.strip() != value.strip():
                result_lines.append(f"{prefix}{expanded_value.strip()} #{value.strip()}")
            else:
                result_lines.append(first_line)
        else:
            result_lines.append(first_line)
    
    # Process continuation lines
    for line in original_parts[1:]:
        stripped = line.strip()
        if stripped:
            original_value = stripped[:-1] if stripped.endswith('\\') else stripped
            if '$(' in original_value:
                expanded_value = recursive_expand(original_value)
                # Add original as comment if different
                if expanded_value != original_value:
                    if stripped.endswith('\\'):
                        result_lines.append(f"{expanded_value.strip()} \\ #{original_value.strip()}")
                    else:
                        result_lines.append(f"{expanded_value.strip()} #{original_value.strip()}")
                else:
                    result_lines.append(line)
            else:
                result_lines.append(line)
        else:
            result_lines.append(line)
    
    return result_lines

def align_comments(content):
    aligned_lines = []
    for line in content:
        if '#' in line:
            # 分割程式碼和注釋
            code, comment = line.split('#', 1)
            # 移除多餘的空格
            code = code.rstrip()
            comment = comment.strip()
            # 計算需要的空格數來達到對齊
            padding = 100 - len(code)
            if padding > 0:
                # 添加空格來對齊注釋
                aligned_lines.append(f"{code}{' ' * padding}#{comment}")
            else:
                # 如果代碼太長，至少加一個空格
                aligned_lines.append(f"{code} #{comment}")
        else:
            aligned_lines.append(line)
    return aligned_lines

def main():
    header_content = """# >>>>> start
PATH_SLASH = /
BUILD_DIR = Build
CP = copy
TARGET = DEBUG #main.mak
NUMBER_OF_PROCESSORS = 20 # environment variable
PYTHON_COMMAND = C:\\Python\\Python310\\python.exe
CONFIGURATION_DIR = AmiPkg\\Configuration
BOARD_DIR = AmiCompatibilityPkg\\Board
# <<<<< end
"""
    if len(sys.argv) > 1:
        filename = sys.argv[1]
    else:
        filename = 'Token.mak'
    print(f"Processing file: {filename}")
    
    # 獲取檔案所在的目錄和基本名稱
    file_dir = os.path.dirname(filename) or os.getcwd()
    base_name = os.path.splitext(os.path.basename(filename))[0]
    output_file = os.path.join(file_dir, f"{base_name}_expanded.mak")
    missing_file = os.path.join(file_dir, f"{base_name}_miss.mak")

    try:
        with open(filename, 'r') as file:
            content = file.read()
    except UnicodeDecodeError:
        with open(filename, 'r', encoding='utf-8-sig') as file:
            content = file.read()

    if header_content.strip() not in content:
        content = header_content + content
        with open(filename, 'w') as file:
            file.write(content)

    expanded_lines, missing_variables = expand_variables(content)
    
    # 對齊注釋
    aligned_lines = align_comments(expanded_lines)
    
    # 將結果寫入新檔案
    with open(output_file, 'w') as file:
        file.write('\n'.join(aligned_lines))

    # 寫入缺失變數（如果有）
    if missing_variables:
        with open(missing_file, 'w') as miss_file:
            for missing_var, origin_var_expr in missing_variables:
                line = f'Missing variable: {missing_var}'
                padding = 100 - len(line)
                if padding > 0:
                    miss_file.write(f"{line}{' ' * padding}#{origin_var_expr}\n")
                else:
                    miss_file.write(f"{line} #{origin_var_expr}\n")

    print(f"{output_file} has been created with expanded variables and aligned comments.")
    if missing_variables:
        print(f"{missing_file} has been created with unresolved variables.")
    else:
        print("No unresolved variables found.")

if __name__ == "__main__":
    main()