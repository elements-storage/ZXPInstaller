{
  "targets": [
    {
      "target_name": "volume",
      "sources": [ "src/volume.cc" ],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}
