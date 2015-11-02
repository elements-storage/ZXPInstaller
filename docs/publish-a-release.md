# How to publish a release

*This document is a reminder for the project contributors.*

1. Be sure you’ve merged your changes into `master`.

1. If you haven’t already, the version number in `[package.json](../package.json)` and commit your change.

1. Tag the release in `master`.

  ```
  git checkout master
  git tag X.X.X
  git push --tags
  ```

1. Run `npm run pack`. This will build the binaries to the `release` directory.

1. [Draft a new release](https://github.com/CreativeDo/ZXPInstaller/releases/new). Choose your tag in the *Tag version* dropdown. Title the release with the version number. Add the changelog to the release notes. Upload the `ZXP Installer.dmg` and `ZXPInstaller Setup.exe` files to the release.

1. Click the *Publish release* button.

1. Switch to the `gh-pages` branch of the repo. Update the site links to point to the new release binary urls.

1. Merge the site changes.

You’re done!
