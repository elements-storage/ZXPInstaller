global.Messages = function() {

  this.errors = {
    175: 'Installation failed because you do not have administrator access.',
    201: 'Installation failed because the extension invalid.',
    411: 'Installation failed because the extension is not compatible with the installed applications.',
    407: 'Installation failed because this extension requires another extension.',
    408: 'Installation failed because this extension requires another extension.',
    412: 'Installation failed because an extension of the same name exists.',
    418: 'Installation failed because a newer version of the extension is installed.',
    456: 'Installation failed because Adobe applications are running',
    458: 'Installation failed because none of the required applications are installed',
    459: 'Installation failed because the extension is not compatible with the installed applications.'
  };

  this.ui = {
    dragToInstall: 'Drag a ZXP file here to install it.',
    dropToInstall: 'Drop your file here to install it.',
    installing: 'Installing your extension.',
    installed: 'Your extension has been installed. Please restart Photoshop.'
  };

  return this;
};
