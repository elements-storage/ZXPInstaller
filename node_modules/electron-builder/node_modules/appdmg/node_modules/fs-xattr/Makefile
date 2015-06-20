
.PHONY: test

build: src/xattr.cc
	node-gyp rebuild

test: build
	node_modules/mocha/bin/mocha --reporter spec test/xattr.js
