# ZXPInstaller.com

[ZXPInstaller.com](http://zxpinstaller.com) is a stripped down [Jekyll site](http://jekyllrb.com/).

## Setup (OS X)

```
bundle install
script/server
```

The site will be served at [localhost:4000](http://localhost:4000/).

## Publish a new release

The site uses the value of `current_release` in [_config.yml](config.yml) to form the download links for releases.

1. Make note of the version number of the GitHub release.

1. Update the `current_release` value in [_config.yml](config.yml).

1. Commit and push your changes.
