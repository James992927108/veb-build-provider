@echo off
chcp 65001
Set CHECKSUM_FILE=checksum.json
Set TOOLS_DIR=C:\VEB\Aptio_5.x_TOOLS_JRE_47\BuildTools
Set EWDK_DIR=C:\VEB\EWDK_1703
Set JAVA_HOME=C:\VEB\Aptio_5.x_TOOLS_JRE_47\VisualeBios\zulu\bin
Set PYTHON_COMMAND=C:\Python\Python310\python.exe

Set Path=%Path%;%TOOLS_DIR%;%EWDK_DIR%;%JAVA_HOME%;%PYTHON_COMMAND%;
echo Environment setup complete.