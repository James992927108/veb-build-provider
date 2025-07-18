import json
import re
import os
import subprocess
import sys
import glob
from pathlib import Path
import shutil

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

def generate_debug_version(version):
    """Generate debug version by incrementing patch to 1"""
    parts = version.split('.')
    if len(parts) != 3:
        print(f"Invalid version format: {version}")
        return None
    
    major, minor, patch = parts
    # Debug version always uses patch number 1
    return f"{major}.{minor}.1"

def create_debug_package_json(debug_version):
    """Create a temporary package.json with debug version"""
    try:
        with open('package.json', 'r', encoding='utf-8') as f:
            package_data = json.load(f)
        
        # Update version for debug
        package_data['version'] = debug_version
        
        # Create backup
        shutil.copy2('package.json', 'package.json.backup')
        
        # Write debug version
        with open('package.json', 'w', encoding='utf-8') as f:
            json.dump(package_data, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Updated package.json to debug version: {debug_version}")
        return True
    except Exception as e:
        print(f"Error updating package.json: {e}")
        return False

def restore_package_json():
    """Restore original package.json"""
    try:
        if os.path.exists('package.json.backup'):
            shutil.move('package.json.backup', 'package.json')
            print("✓ Restored original package.json")
        return True
    except Exception as e:
        print(f"Error restoring package.json: {e}")
        return False

def clean_build():
    """Clean previous builds"""
    print("Cleaning previous builds...")
    
    # Remove out directory
    if os.path.exists('out'):
        shutil.rmtree('out')
        print("✓ Removed out directory")
    
    # Remove existing debug .vsix files in root
    vsix_files = glob.glob('veb-build-provider-*.vsix')
    for file in vsix_files:
        os.remove(file)
        print(f"✓ Removed existing debug package: {file}")

def build_project():
    """Build the project"""
    print("Building project...")
    
    if not run_command('npm run compile'):
        print("Build failed")
        return False
    
    print("✓ Project built successfully")
    return True

def package_extension(debug_version):
    """Package the extension"""
    print(f"Packaging extension for debug version {debug_version}...")
    
    # Package the extension
    package_name = f"veb-build-provider-{debug_version}.vsix"
    cmd = f'npx vsce package --out "{package_name}"'
    
    if not run_command(cmd):
        print("Packaging failed")
        return False, None
    
    if not os.path.exists(package_name):
        print(f"Package file {package_name} was not created")
        return False, None
    
    print(f"✓ Extension packaged successfully: {package_name}")
    return True, package_name

def main():
    """Main function"""
    print("==========================================")
    print("       VEB Build Provider Debug Mode")
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
    
    # Calculate debug version
    debug_version = generate_debug_version(current_version)
    if not debug_version:
        print("Failed to generate debug version")
        return False
    
    print(f"Debug version: {debug_version}")
    print(f"Creating debug package with version {debug_version}...")
    
    try:
        # Clean build
        clean_build()
        
        # Update package.json temporarily
        if not create_debug_package_json(debug_version):
            return False
        
        # Build project
        if not build_project():
            restore_package_json()
            return False
        
        # Package extension
        success, package_name = package_extension(debug_version)
        if not success:
            restore_package_json()
            return False
        
        # Restore original package.json
        restore_package_json()
        
        print("\n==========================================")
        print(f"    Debug package v{debug_version} created successfully!")
        print("==========================================")
        print(f"Debug package: {package_name}")
        print("This is a debug version - no git operations were performed.")
        print("Package is ready for testing in the root directory.")
        
        return True
        
    except Exception as e:
        print(f"Error during debug packaging: {e}")
        restore_package_json()
        return False

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)
