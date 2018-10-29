# ZXPInstaller

ZXPInstaller is a simple cross platform (OS X and Windows) installer for third party Adobe extensions (`.zxp` files). It serves as a replacement for the Extension Manager which no longer is not supported after CC 2014. It provides a drag-and-drop GUI for installation, and [a website](http://zxpinstaller.com/) to which extension developers can point users to download the installer.

# How it works

ZXPInstaller uses Electron (http://electron.atom.io) to create a cross platform HTML/node.js app. The app spawns a child process for the Adobe Extension Manager command line utility to install the ZXP.

# Setup (OS X)

1. Install [Node.js](https://nodejs.org).

1. Install the dependencies and start the app.

  ```
  npm install
  npm run dev
  ```

# Compiling (OS X)

1. Install [Homebrew](http://brew.sh/).

1. Install `wine` and `makensis` for `electron-builder` (needed to build the Windows installer).

  ```
  brew install wine makensis
  ```

1. Run the build script

  ```
  npm run pack
  ```

1. You will find the compiled binaries in the `release` directory.

# Help needed

Windows is supported, however a maintainer is still needed for the Windows portion of the code.

# Credits

ZXPInstaller was originally created by [**@maxoos**](https://github.com/maxoos).
