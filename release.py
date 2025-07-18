import json
import re
import os
import subprocess
import sys
import glob
from pathlib import Path

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
        with open('package.json', 'r', encoding='utf-8') as f:
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
        with open('package.json', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace version number
        new_content = re.sub(r'"version":\s*"[^"]*"', f'"version": "{new_version}"', content)
        
        with open('package.json', 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✓ Updated package.json to version {new_version}")
        return True
    except Exception as e:
        print(f"Error updating package.json: {e}")
        return False

def update_build_commands(new_version):
    """Update buildCommands.ts version"""
    try:
        build_commands_path = Path('src/veb-build/commands/buildCommands.ts')
        with open(build_commands_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace version number
        new_content = re.sub(r'"version":\s*"[^"]*"', f'"version": "{new_version}"', content)
        
        with open(build_commands_path, 'w', encoding='utf-8') as f:
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
        
        with open('README.md', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace version number in git tag examples
        new_content = re.sub(r'git tag v[0-9]+\.[0-9]+\.[0-9]+', f'git tag v{new_version}', content)
        new_content = re.sub(r'git push origin v[0-9]+\.[0-9]+\.[0-9]+', f'git push origin v{new_version}', new_content)
        
        # Update title with version if it doesn't exist, or update existing version
        if re.search(r'# VEB Build Provider v[0-9]+\.[0-9]+\.[0-9]+', new_content):
            # Update existing version in title
            new_content = re.sub(r'# VEB Build Provider v[0-9]+\.[0-9]+\.[0-9]+', f'# VEB Build Provider v{new_version}', new_content)
        elif re.search(r'# VEB Build Provider\s*$', new_content, re.MULTILINE):
            # Add version to title if it doesn't have one
            new_content = re.sub(r'# VEB Build Provider\s*$', f'# VEB Build Provider v{new_version}', new_content, flags=re.MULTILINE)
        
        # Add new version to version history table
        current_date = datetime.now().strftime('%Y-%m-%d')
        new_version_row = f"| v{new_version} | {current_date} |"
        
        # Find the version history table and add the new version at the top
        version_table_pattern = r'(\| 版本號 \| 發布日期 \|\n\|--------|----------\|)\n'
        if re.search(version_table_pattern, new_content):
            new_content = re.sub(
                version_table_pattern,
                f'\\1\n{new_version_row}\n',
                new_content
            )
        
        with open('README.md', 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✓ Updated README.md to version {new_version}")
        return True
    except Exception as e:
        print(f"Error updating README.md: {e}")
        return False

def clean_build():
    """Clean build files"""
    print("Cleaning previous build...")
    
    # Delete directories
    dirs_to_remove = ['node_modules', 'out']
    for dir_name in dirs_to_remove:
        if os.path.exists(dir_name):
            if os.name == 'nt':  # Windows
                run_command(f'rd /s /q {dir_name}')
            else:  # Linux/Mac
                run_command(f'rm -rf {dir_name}')
    
    # Delete files
    files_to_remove = ['package-lock.json']
    for file_name in files_to_remove:
        if os.path.exists(file_name):
            os.remove(file_name)
    
    # Delete old .vsix files
    vsix_files = glob.glob('*.vsix')
    for vsix_file in vsix_files:
        os.remove(vsix_file)
        print(f"Removed old .vsix file: {vsix_file}")
    
    print("✓ Cleaned previous build")

def build_project():
    """Build project"""
    print("Installing dependencies...")
    if not run_command('npm install'):
        return False
    
    print("✓ Dependencies installed")
    
    print("Compiling project...")
    if not run_command('npm run compile'):
        return False
    
    print("✓ Project compiled")
    
    print("Packaging extension...")
    if not run_command('npx vsce package'):
        return False
    
    print("✓ Extension packaged")
    return True

def create_release_directory(version):
    """Create release directory"""
    release_dir = Path('dist/')
    
    # Create directory
    release_dir.mkdir(parents=True, exist_ok=True)
    
    return release_dir

def copy_release_files(release_dir, version):
    """Copy release files"""
    print("Moving .vsix file to release directory...")
    
    import shutil
    
    # Find generated .vsix file
    vsix_files = glob.glob('*.vsix')
    if not vsix_files:
        print("Error: No .vsix file found. vsce package may have failed.")
        return False
    
    # Should be only one .vsix file
    vsix_file = vsix_files[0]
    
    # Rename to include version number
    package_name = f"veb-build-provider-{version}.vsix"
    dst_path = release_dir / package_name
    
    # Move file to release directory
    shutil.move(vsix_file, dst_path)
    
    print(f"✓ {package_name} moved to {release_dir}")
    return True

def git_operations(version):
    """Execute git operations"""
    print("Committing to git...")
    if not run_command('git add .'):
        return False
    
    if not run_command(f'git commit -m "release v{version}"'):
        return False
    
    print("✓ Git commit completed")
    
    print("Creating git tag...")
    if not run_command(f'git tag v{version}'):
        return False
    
    print("✓ Git tag created")
    
    # Ask for confirmation before pushing to remote
    print("\nLocal commit and tag have been created successfully.")
    push_confirm = input(f"Do you want to push the release v{version} to remote repository? (y/n): ")
    if push_confirm.lower() != 'y':
        print("Release completed locally. You can push manually later using:")
        print(f"  git push --force origin master")
        print(f"  git push --force origin v{version}")
        return True
    
    print("Pushing to remote with force...")
    if not run_command('git push --force origin master'):
        return False
    
    if not run_command(f'git push --force origin v{version}'):
        return False
    
    print("✓ Pushed to remote with force")
    return True

def main():
    print("==========================================")
    print("    VEB Build Provider Release Script")
    print("==========================================")
    
    # Check vsce installation
    print("Checking if vsce is installed...")
    result = subprocess.run('npx vsce --version', shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print("Error: vsce is not installed.")
        print("Please install vsce first by running: npm install -g vsce")
        return False
    print("✓ vsce is available")
    
    # Get current version
    current_version = get_current_version()
    if not current_version:
        print("Failed to get current version")
        return False
    
    print(f"Current version: {current_version}")
    
    # Calculate new version
    new_version = increment_version(current_version)
    if not new_version:
        print("Failed to increment version")
        return False
    
    print(f"New version: {new_version}")
    
    # Confirm
    confirm = input(f"Are you sure you want to release version {new_version}? (y/n): ")
    if confirm.lower() != 'y':
        print("Release cancelled.")
        return False
    
    # Update version numbers
    if not update_package_json(new_version):
        return False
    
    if not update_build_commands(new_version):
        return False
    
    if not update_readme(new_version):
        return False
    
    # Clean build
    clean_build()
    
    # Build project
    if not build_project():
        return False
    
    # Create release directory
    release_dir = create_release_directory(new_version)
    
    # Copy files
    if not copy_release_files(release_dir, new_version):
        return False
    
    # Git operations
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
