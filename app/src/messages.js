// Error messages are a best guess interpretation of the messages provided here: http://www.adobeexchange.com/resources/19#errors
const errorMessages = [
  {
    codes: [0],
    message: 'Installation failed because it could not be downloaded. It should not be possible to receive this error.',
  }, {
    codes: [152, 154, 155, 156, 157, 158, 160, 161, 162, 163, 164, 165, 168, 169, 171, 172, 176, 178, 179],
    message: 'Installation failed because of a file operation error.',
  }, {
    codes: [251, 252, 253, 254, 255, 256, 257, 259, 260, 261, 265, 266, 267, 268, 269, 270, 271, 272],
    message: 'Installation failed because ZXPInstaller could not parse the .zxp file.',
  }, {
    codes: [500, 501, 502, 503, 504, 505, 506, 507, 508, 508, 509],
    message: 'Installation failed because ZXPInstaller could not update the database. It should not be possible to receive this error.',
  }, {
    codes: [601, 602, 603, 604, 651, 652, 653],
    message: 'Installation failed because it the ZXPInstaller could not check the license online.',
  }, {
    codes: [159],
    message: 'ZXPInstaller cannot install this type of file. Please use a .zxp file.',
  }, {
    codes: [175],
    message: 'You must run ZXPInstaller in administrator mode to install extensions.',
  }, {
    codes: [201],
    message: 'Installation failed because the extension invalid.',
  }, {
    codes: [402],
    message: 'Installation failed because the extension does not contain a valid code signature.',
  }, {
    codes: [403, 411],
    message: 'Installation failed because the extension is not compatible with the installed applications.',
  }, {
    codes: [407, 408],
    message: 'Installation failed because this extension requires another extension.',
  }, {
    codes: [412],
    message: 'Installation failed because an extension of the same name exists.',
  }, {
    codes: [418],
    message: 'Installation failed because a newer version of the extension is installed.',
  }, {
    codes: [456],
    message: 'Please close all Adobe applications before installing extensions.',
  }, {
    codes: [458],
    message: 'Installation failed because none of the required applications are installed',
  }, {
    codes: [459],
    message: 'Installation failed because the extension is not compatible with the installed applications.',
  },
]

export function getErrorMessage (code) {
  return errorMessages.find(x => x.codes.includes(code))?.message
}

export const UIMessages = {
  dragToInstall: 'Drag a ZXP file or click here to select a file.',
  dropToInstall: 'Drop your file here to install it.',
  installing: 'Installing your extension…',
  installed: 'Your extension has been installed. Please restart your Adobe application.',
}
