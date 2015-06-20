
#include <node.h>
#include <nan.h>
#include <node_buffer.h>

#include <stdlib.h>
#include <sys/xattr.h>

using v8::FunctionTemplate;
using v8::Handle;
using v8::HandleScope;
using v8::String;

using v8::Local;
using v8::Object;
using v8::Integer;
using v8::Value;
using v8::Function;
using v8::Array;

#include "error.cc"

NAN_METHOD(xattr_get) {
  NanScope();

  NanAsciiString aFilename(args[0]);
  NanAsciiString aAttribute(args[1]);

  const char *filename = *aFilename;
  const char *attribute = *aAttribute;

  ssize_t valueLen;

#ifdef __APPLE__
  valueLen = getxattr(filename, attribute, NULL, 0, 0, 0);
#else
  valueLen = getxattr(filename, attribute, NULL, 0);
#endif

  if (valueLen == -1) {
    ThrowExceptionErrno(errno);
    NanReturnUndefined();
  }

  Local<Object> slowBuffer = NanNewBufferHandle((size_t) valueLen);

#ifdef __APPLE__
  valueLen = getxattr(filename, attribute, node::Buffer::Data(slowBuffer), (size_t) valueLen, 0, 0);
#else
  valueLen = getxattr(filename, attribute, node::Buffer::Data(slowBuffer), (size_t) valueLen);
#endif

  if (valueLen == -1) {
    ThrowExceptionErrno(errno);
    NanReturnUndefined();
  }

  Local<Object> globalObj = NanGetCurrentContext()->Global();
  Local<Function> bufferConstructor = Local<Function>::Cast(globalObj->Get(NanNew("Buffer")));
  Handle<Value> constructorArgs[3] = { slowBuffer, NanNew<Integer>((int32_t)valueLen), NanNew<Integer>(0) };
  Local<Object> actualBuffer = bufferConstructor->NewInstance(3, constructorArgs);

  NanReturnValue(actualBuffer);
}

NAN_METHOD(xattr_set) {
  NanScope();

  NanAsciiString aFilename(args[0]);
  NanAsciiString aAttribute(args[1]);

  const char *filename = *aFilename;
  const char *attribute = *aAttribute;

  Local<Object> bufferObj = args[2]->ToObject();
  const char *value = node::Buffer::Data(bufferObj);
  size_t valueLen = node::Buffer::Length(bufferObj);

#ifdef __APPLE__
  int res = setxattr(filename, attribute, value, valueLen, 0, 0);
#else
  int res = setxattr(filename, attribute, value, valueLen, 0);
#endif

  if (res == -1) {
    ThrowExceptionErrno(errno);
    NanReturnUndefined();
  }

  NanReturnUndefined();
}

NAN_METHOD(xattr_list) {
  NanScope();

  NanAsciiString aFilename(args[0]);
  const char *filename = *aFilename;

  ssize_t valueLen;

#ifdef __APPLE__
  valueLen = listxattr(filename, NULL, 0, 0);
#else
  valueLen = listxattr(filename, NULL, 0);
#endif

  if (valueLen == -1) {
    ThrowExceptionErrno(errno);
    NanReturnUndefined();
  }

  char *result = (char *) malloc((size_t) valueLen);

#ifdef __APPLE__
  valueLen = listxattr(filename, result, (size_t) valueLen, 0);
#else
  valueLen = listxattr(filename, result, (size_t) valueLen);
#endif

  if (valueLen == -1) {
    ThrowExceptionErrno(errno);
    NanReturnUndefined();
  }

  Local<Array> arr = NanNew<Array>(0);

  int arrayPos = 0;
  ssize_t valuePos = 0;
  while (valuePos < valueLen) {
    size_t len = strlen(result);
    arr->Set(arrayPos, NanNew<String>(result, len));
    valuePos += len + 1;
    arrayPos++;
  }

  arr->Set(NanNew("length"), NanNew<Integer>(arrayPos));
  free(result);

  NanReturnValue(arr);
}

NAN_METHOD(xattr_remove) {
  NanScope();

  NanAsciiString aFilename(args[0]);
  NanAsciiString aAttribute(args[1]);

  const char *filename = *aFilename;
  const char *attribute = *aAttribute;

#ifdef __APPLE__
  int res = removexattr(filename, attribute, 0);
#else
  int res = removexattr(filename, attribute);
#endif

  if (res == -1) {
    ThrowExceptionErrno(errno);
    NanReturnUndefined();
  }

  NanReturnUndefined();
}

void Initialize(Handle<Object> exports) {
  exports->Set(NanNew("get"), NanNew<FunctionTemplate>(xattr_get)->GetFunction());
  exports->Set(NanNew("set"), NanNew<FunctionTemplate>(xattr_set)->GetFunction());
  exports->Set(NanNew("list"), NanNew<FunctionTemplate>(xattr_list)->GetFunction());
  exports->Set(NanNew("remove"), NanNew<FunctionTemplate>(xattr_remove)->GetFunction());
}

NODE_MODULE(xattr, Initialize)
