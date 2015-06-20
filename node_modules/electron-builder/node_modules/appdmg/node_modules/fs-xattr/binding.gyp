{
  "targets": [
    {
      "target_name": "xattr",
      "sources": [ "src/xattr.cc" ],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}
