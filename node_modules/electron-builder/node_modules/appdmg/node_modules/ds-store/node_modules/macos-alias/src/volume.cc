
#include <nan.h>
#include <node.h>
#include <v8.h>

#ifdef __APPLE__
#include "impl-apple.cc"
#else
#error This platform is not implemented yet
#endif

using v8::FunctionTemplate;

void Initialize(v8::Handle<v8::Object> exports) {
  exports->Set(NanNew("getVolumeName"), NanNew<FunctionTemplate>(MethodGetVolumeName)->GetFunction());
}

NODE_MODULE(volume, Initialize)
