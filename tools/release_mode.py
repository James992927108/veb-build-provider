import json
import re
import os
import subprocess
import sys
import glob
from pathlib import Path
import shutil

# Define project paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
PACKAGE_JSON_PATH = os.path.join(PROJECT_ROOT, 'package.json')
BUILD_COMMANDS_PATH = os.path.join(PROJECT_ROOT, 'src', 'veb-build', 'commands', 'buildCommands.ts')
README_PATH = os.path.join(PROJECT_ROOT, 'README.md')
NODE_MODULES_PATH = os.path.join(PROJECT_ROOT, 'node_modules')
OUT_DIR_PATH = os.path.join(PROJECT_ROOT, 'out')
PACKAGE_LOCK_PATH = os.path.join(PROJECT_ROOT, 'package-lock.json')
DIST_DIR_PATH = os.path.join(PROJECT_ROOT, 'dist')

def run_command(cmd, cwd=None):
    """Execute command and return result"""
    try:
        result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Error executing command: {cmd}")
            print(f"Error output: {result.stderr}")
            return False
        return True
    except Exception as e:
        print(f"Exception executing command: {cmd}")
        print(f"Exception: {e}")
        return False

def get_current_version():
    """Get current version from package.json"""
    try:
        with open(PACKAGE_JSON_PATH, 'r', encoding='utf-8') as f:
            package_data = json.load(f)
            return package_data.get('version')
    except Exception as e:
        print(f"Error reading package.json: {e}")
        return None

def increment_version(version):
    """Increment minor version number"""
    parts = version.split('.')
    if len(parts) != 3:
        print(f"Invalid version format: {version}")
        return None
    
    major, minor, patch = parts
    try:
        new_minor = int(minor) + 1
        return f"{major}.{new_minor}.{patch}"
    except ValueError:
        print(f"Invalid version format: {version}")
        return None

def update_package_json(new_version):
    """Update package.json version"""
    try:
        with open(PACKAGE_JSON_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = re.sub(r'"version":\s*"[^"]*"', f'"version": "{new_version}"', content)
        
        with open(PACKAGE_JSON_PATH, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✓ Updated package.json to version {new_version}")
        return True
    except Exception as e:
        print(f"Error updating package.json: {e}")
        return False

def update_build_commands(new_version):
    """Update buildCommands.ts version"""
    try:
        with open(BUILD_COMMANDS_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = re.sub(r'"version":\s*"[^"]*"', f'"version": "{new_version}"', content)
        
        with open(BUILD_COMMANDS_PATH, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✓ Updated buildCommands.ts to version {new_version}")
        return True
    except Exception as e:
        print(f"Error updating buildCommands.ts: {e}")
        return False

def update_readme(new_version):
    """Update README.md version"""
    try:
        from datetime import datetime
        
        with open(README_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = re.sub(r'git tag v[0-9]+\.[0-9]+\.[0-9]+', f'git tag v{new_version}', content)
        new_content = re.sub(r'git push origin v[0-9]+\.[0-9]+\.[0-9]+', f'git push origin v{new_version}', new_content)
        
        if re.search(r'# VEB Build Provider v[0-9]+\.[0-9]+\.[0-9]+', new_content):
            new_content = re.sub(r'# VEB Build Provider v[0-9]+\.[0-9]+\.[0-9]+', f'# VEB Build Provider v{new_version}', new_content)
        elif re.search(r'# VEB Build Provider\s*$', new_content, re.MULTILINE):
            new_content = re.sub(r'# VEB Build Provider\s*$', f'# VEB Build Provider v{new_version}', new_content, flags=re.MULTILINE)
        
        current_date = datetime.now().strftime('%Y-%m-%d')
        new_version_row = f"| v{new_version} | {current_date} |"
        
        version_table_pattern = r'(\| 版本號 \| 發布日期 \|\n\|--------|----------\|)\n'
        if re.search(version_table_pattern, new_content):
            new_content = re.sub(
                version_table_pattern,
                f'\1\n{new_version_row}\n',
                new_content
            )
        
        with open(README_PATH, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✓ Updated README.md to version {new_version}")
        return True
    except Exception as e:
        print(f"Error updating README.md: {e}")
        return False

def clean_build():
    """Clean build files"""
    print("Cleaning previous build...")
    
    dirs_to_remove = [NODE_MODULES_PATH, OUT_DIR_PATH]
    for dir_path in dirs_to_remove:
        if os.path.exists(dir_path):
            shutil.rmtree(dir_path)
            print(f"✓ Removed directory: {os.path.basename(dir_path)}")

    files_to_remove = [PACKAGE_LOCK_PATH]
    for file_path in files_to_remove:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"✓ Removed file: {os.path.basename(file_path)}")

    vsix_files = glob.glob(os.path.join(PROJECT_ROOT, '*.vsix'))
    for vsix_file in vsix_files:
        os.remove(vsix_file)
        print(f"✓ Removed old .vsix file: {os.path.basename(vsix_file)}")
    
    print("✓ Cleaned previous build")

def build_project():
    """Build project"""
    print("Installing dependencies...")
    if not run_command('npm install', cwd=PROJECT_ROOT):
        return False
    
    print("✓ Dependencies installed")
    
    print("Compiling project...")
    if not run_command('npm run compile', cwd=PROJECT_ROOT):
        return False
    
    print("✓ Project compiled")
    
    print("Packaging extension...")
    if not run_command('npx vsce package', cwd=PROJECT_ROOT):
        return False
    
    print("✓ Extension packaged")
    return True

def create_release_directory(version):
    """Create release directory"""
    DIST_DIR_PATH.mkdir(parents=True, exist_ok=True)
    return DIST_DIR_PATH

def copy_release_files(release_dir, version):
    """Copy release files"""
    print("Moving .vsix file to release directory...")
    
    vsix_files = glob.glob(os.path.join(PROJECT_ROOT, '*.vsix'))
    if not vsix_files:
        print("Error: No .vsix file found. vsce package may have failed.")
        return False
    
    vsix_file = vsix_files[0]
    
    package_name = f"veb-build-provider-{version}.vsix"
    dst_path = release_dir / package_name
    
    shutil.move(vsix_file, dst_path)
    
    print(f"✓ {package_name} moved to {release_dir}")
    return True

def git_operations(version):
    """Execute git operations"""
    print("Committing to git...")
    if not run_command('git add .', cwd=PROJECT_ROOT):
        return False
    
    if not run_command(f'git commit -m "release v{version}"', cwd=PROJECT_ROOT):
        return False
    
    print("✓ Git commit completed")
    
    print("Creating git tag...")
    if not run_command(f'git tag v{version}', cwd=PROJECT_ROOT):
        return False
    
    print("✓ Git tag created")
    
    print("\nLocal commit and tag have been created successfully.")
    push_confirm = input(f"Do you want to push the release v{version} to remote repository? (y/n): ")
    if push_confirm.lower() != 'y':
        print("Release completed locally. You can push manually later using:")
        print(f"  git push --force origin master")
        print(f"  git push --force origin v{version}")
        return True
    
    print("Pushing to remote with force...")
    if not run_command('git push --force origin master', cwd=PROJECT_ROOT):
        return False
    
    if not run_command(f'git push --force origin v{version}', cwd=PROJECT_ROOT):
        return False
    
    print("✓ Pushed to remote with force")
    return True

def main():
    print("==========================================")
    print("    VEB Build Provider Release Mode")
    print("==========================================")
    
    print("Checking if vsce is installed...")
    result = subprocess.run('npx vsce --version', shell=True, capture_output=True, text=True, cwd=PROJECT_ROOT)
    if result.returncode != 0:
        print("Error: vsce is not installed.")
        print("Please install vsce first by running: npm install -g vsce")
        return False
    print("✓ vsce is available")
    
    current_version = get_current_version()
    if not current_version:
        print("Failed to get current version")
        return False
    
    print(f"Current version: {current_version}")
    
    new_version = increment_version(current_version)
    if not new_version:
        print("Failed to increment version")
        return False
    
    print(f"New version: {new_version}")
    
    confirm = input(f"Are you sure you want to release version {new_version}? (y/n): ")
    if confirm.lower() != 'y':
        print("Release cancelled.")
        return False
    
    if not update_package_json(new_version):
        return False
    
    if not update_build_commands(new_version):
        return False
    
    if not update_readme(new_version):
        return False
    
    clean_build()
    
    if not build_project():
        return False
    
    release_dir = create_release_directory(new_version)
    
    if not copy_release_files(release_dir, new_version):
        return False
    
    if not git_operations(new_version):
        return False
    
    print("\n==========================================")
    print(f"    Release v{new_version} completed successfully!")
    print("==========================================")
    print(f"Extension package: {release_dir}/veb-build-provider-{new_version}.vsix")
    print(f"Git tag v{new_version} has been created.")
    print("Check the git operations output above for push status.")
    
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)