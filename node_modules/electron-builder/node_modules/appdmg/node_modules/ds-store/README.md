# node-ds-store

.DS_Store manipulation and creation from node.js

## Status

Currently the implementation uses a pre-created `.DS_Store` file
which it then modifies to suit the needs. This places several
limitations and also only allows creating new files from scratch.

## Installation

```sh
npm install ds-store
```

## Usage

```javscript
var DSStore = require('ds-store');

var file = new DSStore();
```

## API

### file.setBackground(path)

Set the background image to file specified by `path`.

### file.setIconSize(size)

Set the size of all icons in the folder to `size`.

### file.setIconPos(name, x, y)

Position a file icon for file named `name` at `x, y`.

### file.setWindowPos(x, y)

Set the Finder window position to `x, y`.

### file.setWindowSize(w, h)

Set the Finder window size to `w, h`.

### file.vSrn(value)

Set the `vSrn` value to either `0` or `1`.

Effect currently unknown.

### file.write(path, cb)

Write the `.DS_Store` information to file at `path`.

`cb` will get called with `err` upon file creation.

## Future

I have started work on a Buddy Allocator and B-Tree implementation,
but there is still lots of work required. Having theese would make
it easy to both read and manipulate files. It also wouldn't require
shipping a `DSStore-clean` file.

## Thanks

A special thanks to Wim Lewis who have written a complete implementation
in perl. His documentation of the file format helped me very much.

http://search.cpan.org/~wiml/Mac-Finder-DSStore/DSStoreFormat.pod
