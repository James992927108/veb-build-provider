#encoding: utf-8
READ_WORD = "\033[22;31m%s\033[0m"
Yellow_WORD = "\033[22;33m%s\033[0m"

# -*- coding: utf-8 -*-


def WriteListtoFile(FilePath,INPUT_LIST):
	import os
	FilePath = os.path.abspath(FilePath)
	file = open(FilePath, 'w')
	file.seek(0)
	file.writelines(INPUT_LIST)
	file.close()
	return len(INPUT_LIST)

AddLineList=["endnumeric;","endoneof;","endform;"]
RemoveLineList=["#line"]

# 替換函數
def replace_string_tokens(text, token_map):
    for token, replacement in token_map.items():
        text = text.replace(f"STRING_TOKEN({token})", f'"{replacement}"')
        text = text.replace(f"STRING_TOKEN ({token})", f'"{replacement}"')
    return text
    
def Main(VFR_File, listin):
    import os
    
    script_dir = os.path.dirname(os.path.abspath(__file__))  # Get the script's directory
    # 設定輸出檔案名稱
    output_file = '{}/CopyUni/MergeVFR_result.txt'.format(script_dir)

    # 建立 token_map
    token_map = {entry[0]: entry[2] for entry in listin if len(entry) > 2}

    # 開啟輸出檔案進行寫入
    with open(output_file, 'w', encoding='utf-16') as outfile:
        with open(VFR_File, 'r', encoding='utf-16-le') as file:
            for line in file.readlines():
                line = line.rstrip()
                for AddLine in AddLineList:
                    if line.find(AddLine) != -1:
                        line = line.replace(AddLine, AddLine + "\n")

                if line != "":
                    for RemoveLine in RemoveLineList:
                        if line.find(RemoveLine) == -1:
                            # 執行替換
                            output_string = replace_string_tokens(line, token_map)
                            # 將結果寫入檔案
                            outfile.write(output_string + "\n")

def BuildStringToken(source_file):
    # 用於存儲結果的列表
    defines_list = []

    # 讀取文件內容
    with open(source_file, 'r', encoding='utf-8') as infile:
        for line in infile:
            line = line.strip()  # 去掉行首行尾的空白
            
            # 忽略包含 "//"、"}" 或 ")" 的行
            if '_PCD_VALUE_' in line or  '//' in line or '}' in line or ')' in line:
                continue
            
            if line.startswith('#define'):
                parts = line.split()  # 以空白分隔
                if len(parts) == 3:  # 確保行中有三部分
                    identifier = parts[1]  # 獲取標識符
                    value = parts[2]  # 獲取值
                    defines_list.append([identifier, value])  # 存入列表（使用列表）

    # 輸出結果
    #for define in defines_list:
    #    print(define)
    return defines_list

def BuildUNIFile(source_file):
    
# 用於存儲結果的列表和計數的字典
    strings_list = []
    identifier_count = {}
# 讀取文件內容
    with open(source_file, 'r', encoding='utf-16') as infile:
        current_entry = []  # 當前條目
        
        for line in infile:
            line = line.strip()  # 去掉行首行尾的空白
            
            if line.startswith('#string'):
                if current_entry:  # 如果當前條目不空，將其添加到列表
                    strings_list.append(current_entry)
                    current_entry = []  # 清空當前條目
                
                # 提取標識符和字符串
                parts = line.split('"')
                identifier = parts[0].split()[1]  # 獲取標識符
                string_value = parts[1]  # 獲取字符串
                
                current_entry.append(identifier)  # 將標識符加入當前條目
                current_entry.append(string_value)  # 將字符串加入當前條目
                
                # 計數標識符
                if identifier in identifier_count:
                    identifier_count[identifier] += 1
                else:
                    identifier_count[identifier] = 1
            
            elif line.startswith('#language'):
                # 提取語言字符串
                language_value = line.split('"')[1]
                current_entry.append(language_value)  # 將語言字符串加入當前條目
        
        # 添加最後一個條目
        if current_entry:
            strings_list.append(current_entry)

    # 輸出重複的標識符
    print("\n重複的標識符:")
    for identifier, count in identifier_count.items():
        if count > 1:
            print(f"{identifier}: {count} 次")
    # 輸出結果
    #print("所有條目:")
    #for entry in strings_list:
    #    print(entry)
    return strings_list
    
def Merged_ID(List1,List2):
    # 使用字典來合併
    merged_dict = {}

    # 添加 List1 的資料
    for item in List1:
        key = item[0]
        merged_dict[key] = [item[1]]  # 初始化為 List1 的值

    # 只添加 List2 中存在於 List1 的資料
    for item in List2:
        key = item[0]
        if key in merged_dict:  # 只在 merged_dict 中存在時才添加
            merged_dict[key].extend(item[1:])  # 合併 List2 的值

    # 將合併結果轉換回列表，將 List1 的 index 1 放在最前面
    merged_list = [[values[0]] + [key] + values[1:] for key, values in merged_dict.items()]

    #Debug 輸出合併結果
    #for entry in merged_list:
    #    print(entry)
    return merged_list

HelpMsgStr =\
' MergeVFR.py [Setup.i] [Setup ID Strings file] [Setup Strings UNI file]\n\n'\
'Example:\n'\
'  MergeVFR.py AmdCbsForm.i CbsSetupLibInstanceStrDefs.h AmdCbsStrings.uni\n'\
'  MergeVFR.py Setup.i SetupStrDefs.h AllSetup.uni\n'\

def ShowCopyright():
    print(Yellow_WORD%'MergeVFR V0.0.3 Parameter Description:\n')
    print(HelpMsgStr)
    sys.exit()
        
if __name__=="__main__":
    import time
    import sys
    import os

    L1=[]
    L2=[]
    global MergedList
    MergedList=[]
    
    argvlen = len(sys.argv)
    if argvlen < 2:
        ShowCopyright()
    #輸入 Setup.i
    VFR_File = sys.argv[1]
    VFR_File = os.path.abspath(VFR_File)
    if argvlen > 2:     #輸入 StrDefs.h
        Str_ID_Defs_File = sys.argv[2]
        Str_ID_Defs_File = os.path.abspath(Str_ID_Defs_File)
    if argvlen > 3:    #輸入 Strings.uni
        UNI_File = sys.argv[3]
        UNI_File = os.path.abspath(UNI_File)
    if argvlen > 2:
        L1=BuildStringToken(Str_ID_Defs_File)

    if argvlen > 3:
        L2=BuildUNIFile(UNI_File)
    if argvlen > 2:
        MergedList=Merged_ID(L1,L2)
    #print(MergedList)
    Main(VFR_File,MergedList)