# encoding: utf-8
import os
import re
import shutil
import sys
import logging

script_dir = os.path.dirname(os.path.abspath(__file__))  # Get the script's directory
log_file = os.path.join(script_dir, 'CopyUni.log')       # Create the log file path

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(log_file, encoding='utf-8')  # Use the absolute path for the log file
    ]
)

logging.info("Current working directory: %s", os.getcwd())

def ShowCopyright():
    logging.warning('CopyUni.py V1.0.0:\n')
    sys.exit()
        
def convert_uni_to_lowercase(input_string):
    # Use a regular expression to convert all .uni (case-insensitive) to lowercase
    return re.sub(r'\.uni', '.uni', input_string, flags=re.IGNORECASE)

def extract_files(mak_file_path, target_dir):
    # Ensure the target directory exists
    os.makedirs(target_dir, exist_ok=True)

    # Get the parent directory of the current script's directory
    parent_dir = os.path.abspath(os.path.join(script_dir, '..'))

    # Read the .mak file and process .uni file paths
    with open(mak_file_path, 'r', encoding='utf-8') as mak_file:
        for line in mak_file:
            # Check if the line contains a .uni file
            if '.uni' in line:
                # Remove any comment starting with "#" and strip whitespace
                line = line.split('#', 1)[0].strip()
                
                file_path = line.replace("\\", "/")
                file_path = convert_uni_to_lowercase(file_path)

                # Prepend the parent directory path to the file path
                adjusted_file_path = os.path.join(parent_dir, file_path)
                adjusted_file_path = os.path.normpath(adjusted_file_path).replace('/', os.sep)

                if os.path.isfile(adjusted_file_path):
                    shutil.copy(adjusted_file_path, target_dir)
                    logging.info(f"Copied: {adjusted_file_path} to {target_dir}")
                else:
                    parent_dir_of_file = os.path.dirname(adjusted_file_path)
                    if os.path.isdir(parent_dir_of_file):
                        logging.warning(f"File does not exist: {adjusted_file_path}, but the parent directory exists: {parent_dir_of_file}")
                    else:
                        logging.error(f"File does not exist: {adjusted_file_path}, and the parent directory is also missing: {parent_dir_of_file}")


def find_and_copy_files(search_dir, target_dir, file_names):
    
    #搜索指定目录及其子目录中的文件，并将匹配的文件复制到目标目录。
    
    for root, dirs, files in os.walk(search_dir):
        for file in files:
            if file in file_names:
                src_file = os.path.join(root, file)
                dest_file = os.path.join(target_dir, file)
                if not files_are_same(src_file, dest_file):
                    logging.info(f"Found {file}, copying to {dest_file}...")
                    shutil.copy(src_file, dest_file)
                    # 复制后读取该文件的第二行并根据路径复制相关文件
                    read_second_line_and_copy(src_file, target_dir)
                else:
                    logging.info(f"Skipping copy for {file} as it is the same as the destination.")

def read_second_line_and_copy(file_path, target_dir):
    
    #读取文件的第二行，解析出路径并复制相关文件到目标目录
    
    try:
        with open(file_path, 'r') as f:
            lines = f.readlines()
            if len(lines) >= 2:
                second_line = lines[1].strip()  # 获取第二行并去掉空白字符
                #logging.info(f"Second line: {second_line}")
                
                # 假设第二行包含的路径是文件路径，且路径以 "#line" 开头，格式示例:
                if second_line.startswith('#line') and '"' in second_line:
                    start_idx = second_line.find('"') + 1
                    end_idx = second_line.rfind('"')
                    file_to_copy = second_line[start_idx:end_idx]
                    
                    if os.path.exists(file_to_copy):
                        dest_file = os.path.join(target_dir, os.path.basename(file_to_copy))
                        if not files_are_same(file_to_copy, dest_file):
                            logging.info(f"Copying {file_to_copy} to {dest_file}...")
                            shutil.copy(file_to_copy, dest_file)
                        else:
                            logging.info(f"Skipping copy for {file_to_copy} as it is the same as the destination.")
                    else:
                        logging.info(f"Warning: File {file_to_copy} does not exist.")
                else:
                    logging.info(f"Invalid second line format: {second_line}")
            else:
                logging.info(f"File {file_path} doesn't have a second line.")
    except Exception as e:
        logging.info(f"Error reading {file_path}: {e}")

def files_are_same(src_file, dest_file):
    return os.path.abspath(src_file) == os.path.abspath(dest_file)

def main():
    # mak_file_path = 'Build/token.mak'
    if len(sys.argv) > 1:
        mak_file_path = sys.argv[1]
    else:
        mak_file_path = '{}/token_new.mak'.format(script_dir)
    target_dir = '{}/CopyUni'.format(script_dir)

    TokenMakPath = os.path.join(os.getcwd(), mak_file_path)
    TokenMakPath = os.path.abspath(TokenMakPath)

    if not os.path.exists(TokenMakPath):
        logging.error(f'Cannot find {TokenMakPath}.')
        ShowCopyright()

    extract_files(TokenMakPath, target_dir)
    logging.info(f'All .uni files have been copied to {target_dir}.')
	
    file_names_to_find = ['Setup.i',
                        'AmdCbsForm.i',
                        'NvmeDynamicSetup.i',
                        'PciDynamicSetup.i',
                        'XCradleServerMgmtSetup.i',
                        'AmdCbsStrings.uni'
                        ]  # 要查找的文件    
    search_dirs = ['AmdCbsPkg\Build','./Build']  # 要搜索的目录
    # 搜索并复制文件
    logging.info(f'\nCopy {file_names_to_find} Files.\n')
    for search_dir in search_dirs:
        find_and_copy_files(search_dir, target_dir, file_names_to_find)
	
if __name__ == "__main__":
    os.environ['PYTHONUTF8'] = '1'
    main()
