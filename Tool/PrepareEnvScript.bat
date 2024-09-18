@echo off
chcp 65001
Set CHECKSUM_FILE=checksum.json
Set TOOLS_DIR=C:\VEB\Aptio_5.x_TOOLS_JRE_46\BuildTools
Set EWDK_DIR=C:\VEB\EWDK_1703
Set JAVA_HOME=C:\VEB\Aptio_5.x_TOOLS_JRE_46\VisualeBios\zulu\bin
Set PYTHON_COMMAND=C:\Python\Python310\python.exe

if exist "%TOOLS_DIR%" (
    echo TOOLS_DIR exists: %TOOLS_DIR%
    Set Path=%Path%;%TOOLS_DIR%
) else (
    echo TOOLS_DIR not found: %TOOLS_DIR%
)

if exist "%EWDK_DIR%" (
    echo EWDK_DIR exists: %EWDK_DIR%
    Set Path=%Path%;%EWDK_DIR%
) else (
    echo EWDK_DIR not found: %EWDK_DIR%
)

if exist "%JAVA_HOME%" (
    echo JAVA_HOME exists: %JAVA_HOME%
    Set Path=%Path%;%JAVA_HOME%
) else (
    echo JAVA_HOME not found: %JAVA_HOME%
)

if exist "%PYTHON_COMMAND%" (
    echo PYTHON_COMMAND exists: %PYTHON_COMMAND%
    Set Path=%Path%;%PYTHON_COMMAND%
) else (
    echo PYTHON_COMMAND not found: %PYTHON_COMMAND%
)

echo Environment setup complete.