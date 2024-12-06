#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install tmux and reptyr based on the operating system
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Detected Linux"
    if command_exists apt-get; then
        echo "Using apt package manager"
        sudo apt-get update
        sudo apt-get install -y tmux reptyr
    elif command_exists yum; then
        echo "Using yum package manager"
        sudo yum install -y tmux reptyr
    else
        echo "Unsupported Linux distribution. Please install tmux and reptyr manually."
        exit 1
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Detected macOS"
    if command_exists brew; then
        echo "Using Homebrew"
        brew install tmux reptyr
    else
        echo "Homebrew is not installed. Installing Homebrew first..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        brew install tmux reptyr
    fi
else
    echo "Unsupported operating system: $OSTYPE"
    exit 1
fi

# Verify tmux installation
if command_exists tmux; then
    echo "tmux successfully installed!"
    tmux -V
else
    echo "tmux installation failed."
    exit 1
fi

# Verify reptyr installation
if command_exists reptyr; then
    echo "reptyr successfully installed!"
    reptyr --version || echo "reptyr installed but version information is unavailable."
else
    echo "reptyr installation failed."
    exit 1
fi