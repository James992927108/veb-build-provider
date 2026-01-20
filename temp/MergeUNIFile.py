import os
import sys
# -*- coding: utf-8 -*-


def merge_uni_files(directory, output_file):
    with open(output_file, 'w', encoding='utf-16') as outfile:
        for filename in os.listdir(directory):
            #print(filename)
            print(f"Merge {filename}")
            if filename.endswith('.uni'):
                file_path = os.path.join(directory, filename)

                # 嘗試多種編碼
                encodings = ['utf-8', 'utf-16', 'ISO-8859-1', 'windows-1252']
                for encoding in encodings:
                    try:
                        with open(file_path, 'r', encoding=encoding) as infile:
                            outfile.write(infile.read())
                            outfile.write('\n')  # 添加換行符
                        break  # 成功後退出編碼嘗試循環
                    except UnicodeDecodeError:
                        #print(f"使用編碼 {encoding} 讀取 {filename} 失敗，嘗試下一個編碼。")
                        continue
                    except FileNotFoundError:
                        print(f"文件 {file_path} 找不到。")
                        break  # 跳出外循環


def trim_spaces_in_file(input_file, output_file):
    with open(input_file, 'r', encoding='utf-16') as infile:
        lines = infile.readlines()
    
    # 過濾掉以 // 開頭的行，並去除末尾空格
    filtered_lines = [line.rstrip() + '\n' for line in lines if not line.lstrip().startswith('//')]

    with open(output_file, 'w', encoding='utf-8') as outfile:
        outfile.writelines(filtered_lines)


def remove_duplicate_strings_and_languages(input_file, output_file):
    string_dict = {}
    lines_to_keep = []
    additional_string = (
        '#string STR_EMPTY       #language en-US ""\n'
        '#string STR_ENABLED     #language en-US "Enabled"\n'
        '#string STR_DISABLED    #language en-US "Disabled"\n'
        '#string STR_NONE        #language en-US "None"\n'
        '#string STR_AUTO        #language en-US "Auto"\n'
    )

    # 读取文件内容并记录重复的第二列
    with open(input_file, 'r', encoding='utf-8') as infile:
        for line in infile:
            if line.startswith('#string'):
                parts = line.split()
                if len(parts) > 1:  # 确保有足够的字段
                    key = parts[1]  # 获取第二列的key
                    string_dict[key] = string_dict.get(key, 0) + 1

    # 重新读取文件并过滤行
    with open(input_file, 'r', encoding='utf-8') as infile:
        for line in infile:
            if line.startswith('#string'):
                parts = line.split()
                if len(parts) > 1:
                    key = parts[1]
                    # 只保留不重复的行，并且排除中文语言
                    if string_dict[key] < 254 and '#language zh-chs' not in line:
                        line = line.replace('""', '"NULL_String"')  # 替换空字符串
                        lines_to_keep.append(line)
                        string_dict[key] = 255  # 防止重复处理

            elif '#language zh-chs' not in line and '#include "VFR.uni"' not in line and '#langdef' not in line and '/=#' not in line and '/=#' in line:
                # 保留其他非 #string 行且不包含特定关键词的行
                line = line.rstrip()
                if len(line):
                    lines_to_keep.append(line + '\n')

    if not any('#string STR_EMPTY' in line for line in lines_to_keep):
        lines_to_keep.append(additional_string)

    # 将结果写入新文件
    with open(output_file, 'w', encoding='utf-16') as outfile:
        outfile.writelines(lines_to_keep)

    # 打印输出文件路径
    print(f"=================================")
    print(f"Write to file: {output_file}")

        
# 使用範例
if __name__=="__main__":
    # 檢查目前編碼
    #print(f"系統目前編碼: {sys.getdefaultencoding()}")
    # 設定環境變數以使用 UTF-8
    script_dir = os.path.dirname(os.path.abspath(__file__))  # Get the script's directory

    os.environ['PYTHONUTF8'] = '1'
    if len(sys.argv) > 1:
        directory_path = sys.argv[1]
    else:
        directory_path = '{}/CopyUni'.format(script_dir)
    print(f"uni file in directory_path: {directory_path}")

    temp1_file='{}/CopyUni/temp.uni'.format(script_dir)
    temp2_file = '{}/CopyUni/temp2.uni'.format(script_dir)  # 輸出文件名
    AllSetupUni = '{}/CopyUni/AllSetup.uni'.format(script_dir)

    if os.path.exists(temp1_file):
         os.remove(temp1_file)
    if os.path.exists(temp2_file):
         os.remove(temp2_file)
    if os.path.exists(AllSetupUni):
         os.remove(AllSetupUni)

    merge_uni_files(directory_path, temp1_file)
    trim_spaces_in_file(temp1_file, temp2_file)
    # #print(f"已合併所有 .uni 文件到 {temp2_file}")
    remove_duplicate_strings_and_languages(temp2_file, AllSetupUni)
