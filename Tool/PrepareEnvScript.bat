@echo off
chcp 65001

Set CHECKSUM_FILE=checksum.json

@REM AMD A7
@REM Set TOOLS_DIR=C:\VEB\Aptio_5.x_TOOLS_JRE_46\BuildTools
@REM Set JAVA_HOME=C:\VEB\Aptio_5.x_TOOLS_JRE_46\VisualeBios\zulu\bin
@REM Set EWDK_DIR=C:\VEB\EWDK_1703
@REM Set PYTHON_COMMAND=C:\Python\Python310\python.exe

@REM AMD A8
Set TOOLS_DIR=C:\VEB\Aptio_5.x_TOOLS_JRE_47\BuildTools
Set JAVA_HOME=C:\VEB\Aptio_5.x_TOOLS_JRE_47\VisualeBios\zulu\bin
Set EWDK_DIR=C:\VEB\EWDK_1703
Set PYTHON_COMMAND=C:\Python\Python310\python.exe

@REM Intel M8
@REM Set TOOLS_DIR=C:\VEB\Aptio_5.x_TOOLS_JRE_53\BuildTools
@REM Set JAVA_HOME=C:\VEB\Aptio_5.x_TOOLS_JRE_53\VisualeBios\zulu\bin
@REM Set MSVC_ROOT=C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools
@REM Set PYTHON_COMMAND=C:\Python\Python39\python.exe

Set Path=%Path%;%TOOLS_DIR%;%EWDK_DIR%;%MSVC_ROOT%;%JAVA_HOME%;%PYTHON_COMMAND%

echo %Path%
echo Environment setup complete.
del *.bin *.hpm *.FD *.tar.gz *.rom
echo del *.bin *.hpm *.FD *.tar.gz *.rom