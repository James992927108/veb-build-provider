import xml.etree.ElementTree as ET

def parse_xml(file_path, output_file):
    tree = ET.parse(file_path)
    root = tree.getroot()
    with open(output_file, "w", encoding="utf-8") as f:
        parse_item(root, level=0, file=f)

def parse_item(element, level, file):
    level_attr = element.get("Level")
    name_attr = element.get("Name")
    
    if level_attr and name_attr:
        file.write("  " * int(level_attr) + f"Level {level_attr}: {name_attr}\n")
    
    for child in element:
        parse_item(child, level + 1, file)

if __name__ == "__main__":
    file_path = "eSetupBreithorn.xml"  # 修改為你的 XML 檔案名稱
    output_file = "output.txt"  # 輸出檔案名稱
    parse_xml(file_path, output_file)
