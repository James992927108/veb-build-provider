@echo off
chcp 65001

Set CHECKSUM_FILE=checksum.json

@REM AMD A7
@REM Set TOOLS_DIR=C:\VEB\Aptio_5.x_TOOLS_JRE_46\BuildTools
@REM Set JAVA_HOME=C:\VEB\Aptio_5.x_TOOLS_JRE_46\VisualeBios\zulu\bin
@REM Set EWDK_DIR=C:\VEB\EWDK_1703
@REM Set PYTHON_COMMAND=C:\Python\Python310\python.exe

@REM AMD A8
@REM Set TOOLS_DIR=C:\VEB\Aptio_5.x_TOOLS_JRE_47\BuildTools
@REM Set JAVA_HOME=C:\VEB\Aptio_5.x_TOOLS_JRE_47\VisualeBios\zulu\bin
@REM Set EWDK_DIR=C:\VEB\EWDK_1703
@REM Set PYTHON_COMMAND=C:\Python\Python310\python.exe

@REM Intel M5
Set TOOLS_DIR=C:\VEB\VisualeBios33.1\Tools
Set CCX86DIR=C:\VEB\WinDDK\7600.16385.1\bin\x86\x86
Set CCX64DIR=C:\VEB\WinDDK\7600.16385.1\bin\x86\amd64
Set EWDK_DIR=C:\VEB\EWDK_1703
Set JAVA_HOME=C:\VEB\Aptio_5.x_TOOLS_JRE_34\VisualeBios\jre1.8.0_172\bin

@REM Delete Original directory if exists
if exist "D:\root\Original" (
    echo Deleting D:\root\Original directory...
    rmdir /S /Q "D:\root\Original"
    if %ERRORLEVEL% NEQ 0 (
        echo Warning: Failed to delete Original directory
    ) else (
        echo Original directory deleted successfully
    )
)
echo.

@REM Reset git repository to clean state
echo Resetting git repository...
cd /d D:\root\PurleyRefresh
git reset --hard
if %ERRORLEVEL% NEQ 0 (
    echo Warning: Failed to reset git repository
) else (
    echo Git repository reset successfully
)
echo.

@REM Copy OemPkg to PurleyRefresh directory
echo Copying OemPkg to PurleyRefresh...
if exist "D:\root\PurleyRefresh\OemPkg" (
    echo Deleting existing OemPkg directory...
    rmdir /S /Q "D:\root\PurleyRefresh\OemPkg"
)
xcopy /E /I /Y "D:\root\OemPkg" "D:\root\PurleyRefresh\OemPkg"
if %ERRORLEVEL% NEQ 0 (
    echo Warning: Failed to copy OemPkg
) else (
    echo OemPkg copied successfully
)

@REM Intel M8
@REM Set TOOLS_DIR=C:\VEB\Aptio_5.x_TOOLS_JRE_53\BuildTools
@REM Set JAVA_HOME=C:\VEB\Aptio_5.x_TOOLS_JRE_53\VisualeBios\zulu\bin
@REM Set MSVC_ROOT=C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools
@REM Set PYTHON_COMMAND=C:\Python\Python39\python.exe

@REM Intel M9
@REM Set TOOLS_DIR=C:\VEB\Aptio_5.x_TOOLS_JRE_59_x64\BuildTools
@REM Set JAVA_HOME=C:\VEB\Aptio_5.x_TOOLS_JRE_59_x64\VisualeBios\zulu\bin
@REM Set MSVC_ROOT=C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools
@REM Set PYTHON_COMMAND=C:\Python\Python311\python.exe

Set Path=%Path%;%TOOLS_DIR%;%EWDK_DIR%;%MSVC_ROOT%;%JAVA_HOME%;%PYTHON_COMMAND%

echo %Path%
echo Environment setup complete.
del *.bin *.hpm *.FD *.tar.gz *.rom
echo del *.bin *.hpm *.FD *.tar.gz *.rom