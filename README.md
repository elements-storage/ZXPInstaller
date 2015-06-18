# ZXPInstaller
An cross platform installer for every Adobe developer to easily and freely distribute Adobe Extensions

# Basic idea
Since Adobe has decided to remove Adobe Extension Manager from future distribution its up to you to provide your users means to install extensions. This project uses Adobe Extension Manager Command line utility to create a self contained installer which will install a ZXP file.

The idea is to keep it basic. One window, your logo at the top and a simple install button which will install the ZXP on click. Nothing more, nothing less.

# How this works
The installer uses Electron (http://electron.atom.io) to create an cross platform HTML/node.js app. The app will spawn a child process for the Adobe Extension Manager Command line utility to install the ZXP distributed with the app.

# Help needed
Help is needed. If you working on a Windows platform it would be nice if you could take the Windows side of the development. If you are a designer it would be nice if you could offer a general and clean design. If you are a frontend developer it would be nice to have a hand with the HTML/CSS side.

# How to start helping
Get up and running with Electron, help, and submit a pull request.

#Current status
Currently there is a basic framework which is tested to work on OS X and installs ZXP successfully.

# Future plans
There is an idea to make this more accessible for all developers by creating a grunt script which will read a simple JSON file to create an installer ready for distribution with your logo, name and ZXP. All without any coding at all (other than editing the JSON file).
