# ZXPInstaller
A simple cross platform ZXP installer.

# Basic idea
Since Adobe has decided to remove Adobe Extension Manager from future distribution there is no friendly way for users to easily install Adobe Extensions. This project uses Adobe Extension Manager Command line utility to create an installer which will install any ZXP file. There will be a website to which developers could send users to download the installer.

# What will it do?
The idea is to keep it basic. One window with a drag and drop zone and a status message. Dropping a ZXP file will install it. Nothing more nothing less.

# How this works
The installer uses Electron (http://electron.atom.io) to create an cross platform HTML/node.js app. The app will spawn a child process for the Adobe Extension Manager Command line utility to install the ZXP.

# Help needed
Help is needed. If you working on a Windows platform it would be nice if you could take the Windows side of the development. If you are a designer it would be nice if you could offer a general and clean design and a nice icon for the app. Help in the HTML/CSS side would also appreciated.

# How to start helping
Get up and running with Electron, help, and submit a pull request.

#Current status
Currently there is a basic framework which is tested to work on OS X and installs ZXP successfully. There is also a first release to play with. Now working on the Windows version.
