
#include <CoreFoundation/CFURL.h>
#include <CoreFoundation/CFString.h>

using v8::String;
using v8::Exception;
using v8::Local;
using v8::Value;

Local<String> MYCFStringGetV8String(CFStringRef aString) {

  if (aString == NULL) {
    return NanNew("");
  }

  CFIndex length = CFStringGetLength(aString);
  CFIndex maxSize = CFStringGetMaximumSizeForEncoding(length, kCFStringEncodingUTF8);
  char *buffer = (char *) malloc(maxSize);

  if (CFStringGetCString(aString, buffer, maxSize, kCFStringEncodingUTF8)) {

    Local<String> result = NanNew(buffer);
    free(buffer);

    return result;
  }

  return NanNew("");
}

NAN_METHOD(MethodGetVolumeName) {
   NanScope();

  NanAsciiString aPath(args[0]);

  CFStringRef out;
  CFErrorRef error;

  CFStringRef volumePath = CFStringCreateWithCString(NULL, *aPath, kCFStringEncodingUTF8);
  CFURLRef url = CFURLCreateWithFileSystemPath(NULL, volumePath, kCFURLPOSIXPathStyle, true);

  if(CFURLCopyResourcePropertyForKey(url, kCFURLVolumeNameKey, &out, &error)) {

    Local<String> result = MYCFStringGetV8String(out);

    NanReturnValue(result);
  } else {

    Local<String> desc = MYCFStringGetV8String(CFErrorCopyDescription(error));
    NanThrowError(Exception::Error(desc)->ToObject());

    NanReturnUndefined();
  }
}
