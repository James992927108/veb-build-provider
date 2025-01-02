import re
import sys

# Function to perform variable expansion recursively
def expand_variables(content):
    variables = {}
    expanded_lines = []
    missing_variables = set()

    # First pass: collect all variable definitions without replacing $(PATH_SLASH)
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

    # Second pass: expand variables
    for line in content.split('\n'):
        match = re.match(r'(\w+)\s*=\s*(.*)', line)
        if match:
            var_name, var_value = match.groups()
            original_value = var_value.strip()

            # Recursively expand the variable value
            expanded_value = recursive_expand(var_value.strip())

            # Find and record any unresolved variables
            unresolved_vars = re.findall(r'\$\((\w+)\)', expanded_value)
            if unresolved_vars:
                for unresolved_var in unresolved_vars:
                    missing_variables.add((unresolved_var, f'{var_name} = {original_value}'))

            # Store expanded lines temporarily without comments
            expanded_lines.append(f'{var_name} = {expanded_value}')
        else:
            expanded_lines.append(line)

    return expanded_lines, missing_variables

# Function to align comments for token_new.mak
def align_comments(expanded_content, original_content):
    aligned_lines = []
    original_lines = original_content.split('\n')
    expanded_lines = expanded_content

    # Iterate over both original and expanded content to align comments
    for original_line, expanded_line in zip(original_lines, expanded_lines):
        match = re.match(r'(\w+)\s*=\s*(.*)', original_line)
        if match:
            var_name, original_value = match.groups()
            expanded_value = expanded_line.split('=')[1].strip()

            # Align comments only if the value has changed
            if original_value.strip() != expanded_value:
                comment_padding = 100
                comment_space = comment_padding - len(expanded_line)
                if comment_space > 0:
                    aligned_lines.append(f'{expanded_line}{" " * comment_space}# {original_value.strip()}')
                else:
                    aligned_lines.append(f'{expanded_line} # {original_value.strip()}')
            else:
                aligned_lines.append(expanded_line)
        else:
            aligned_lines.append(expanded_line)

    return '\n'.join(aligned_lines)

def main():
    # Prepare header content to add to token.mak
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
        filename = 'token.mak'
    print(f"filename = {sys.argv[1]}")
    
    # Read the original token.mak file
    with open(filename, 'r') as file:
        content = file.read()

    # Check if header already exists
    if header_content.strip() not in content:
        # Prepend header content to the existing content
        content = header_content + content
        with open(filename, 'w') as file:
            file.write(content)

    # Expand variables and handle $(PATH_SLASH)
    expanded_lines, missing_variables = expand_variables(content)

    # Align comments after expansion
    final_content_with_comments = align_comments(expanded_lines, content)

    # Write the final expanded content with aligned comments to token_new.mak
    with open('token_new.mak', 'w') as file:
        file.write(final_content_with_comments)

    # Write missing variables to token_miss.mak if any, with aligned comment
    if missing_variables:
        with open('token_miss.mak', 'w') as miss_file:
            comment_padding = 50
            for missing_var, origin_var_expr in missing_variables:
                line = f'Missing variable: {missing_var}'
                # Calculate the number of spaces to align the comment
                spaces_to_add = comment_padding - len(line)
                if spaces_to_add > 0:
                    aligned_line = f'{line}{" " * spaces_to_add}# {origin_var_expr}'
                else:
                    aligned_line = f'{line} # {origin_var_expr}'
                miss_file.write(f'{aligned_line}\n')

    print("token_new.mak has been created with expanded variables and aligned comments.")
    if missing_variables:
        print("token_miss.mak has been created with unresolved variables.")
    else:
        print("No unresolved variables found.")

if __name__ == "__main__":
    main()
