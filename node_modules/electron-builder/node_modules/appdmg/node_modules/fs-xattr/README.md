# fs-xattr

Node.js module for manipulating extended attributes.

There are already some libraries for this, why use `fs-xattr`?

- Very useful errors
- No limits on value size
- Clean and easy api

## Installation

```sh
npm install fs-xattr
```

## Usage

```javascript
var xattr = require('fs-xattr');
```

## API

### xattr.get(path, attr, cb)

Get extended attribute `attr` from file at `path`.

`cb` is a callback that will be called with `(err, val)`.

### xattr.getSync(path, attr)

Synchronus version of `xattr.get`

### xattr.set(path, attr, value, cb)

Set extended attribute `attr` to `value` on file at `path`.

`value` can be either a string or a `Buffer`.

`cb` is a callback that will be called with `(err)`.

### xattr.setSync(path, attr, value)

Synchronus version of `xattr.set`

### xattr.remove(path, attr, cb)

Remove extended attribute `attr` on file at `path`.

`cb` is a callback that will be called with `(err)`.

### xattr.removeSync(path, attr)

Synchronus version of `xattr.remove`

### xattr.list(path, cb)

List all attributes on file at `path`.

`cb` is a callback that will get called with `(err, list)`. `list` in an array of strings, e.g. `['com.linusu.test', 'com.apple.FinderInfo']`.

### xattr.listSync(path)

Synchronus version of `xattr.list`

## Asynchronus?

AFAIK, neither the Linux or Darwin kernel supports manipulating extended attributes asynchronus. Thus the library currently wraps the synchronus calls with a simple `process.nextTick` to simulate non-blocking io.

One solution is to delegate the action away to another thread that will return a message upon completion. I think that this is more or less how node.js does fs internaly.

I obviously need to do more research on this.
