
#include <errno.h>
#include <string.h>

#ifdef __APPLE__
#define E_ENOATTR ENOATTR
#define S_ENOATTR "ENOATTR"
#else
#define E_ENOATTR ENODATA
#define S_ENOATTR "ENODATA"
#endif

const char* errorDescription(int e) {
  return strerror(e);
}

const char* errorDescriptionForGet(int e) {
  switch (e) {
    case E_ENOATTR: return "The extended attribute does not exist.";
    case ENOTSUP: return "The file system does not support extended attributes or has the feature disabled.";
    case ERANGE: return "value (as indicated by size) is too small to hold the extended attribute data.";
    case EPERM: return "The named attribute is not permitted for this type of object.";
    case EINVAL: return "name is invalid or options has an unsupported bit set.";
    case EISDIR: return "path or fd do not refer to a regular file and the attribute in question is only applicable to files.  Similar to EPERM.";
    case ENOTDIR: return "A component of path's prefix is not a directory.";
    case ENAMETOOLONG: return "The length of name exceeds XATTR_MAXNAMELEN UTF-8 bytes, or a component of path exceeds NAME_MAX characters, or the entire path exceeds PATH_MAX characters.";
    case EACCES: return "Search permission is denied for a component of path or the attribute is not allowed to be read (e.g. an ACL prohibits reading the attributes of this file).";
    case ELOOP: return "Too many symbolic links were encountered in translating the pathname.";
    case EFAULT: return "path or name points to an invalid address.";
    case EIO: return "An I/O error occurred while reading from or writing to the file system.";
    default: return errorDescription(e);
  }
}

const char* errorDescriptionForSet(int e) {
  switch (e) {
    case EEXIST: return "options contains XATTR_CREATE and the named attribute already exists.";
    case E_ENOATTR: return "options is set to XATTR_REPLACE and the named attribute does not exist.";
    case ENOTSUP: return "The file system does not support extended attributes or has the feature disabled.";
    case EROFS: return "The file system is mounted read-only.";
    case ERANGE: return "The data size of the attribute is out of range (some attributes have size restrictions).";
    case EPERM: return "Attributes cannot be associated with this type of object. For example, attributes are not allowed for resource forks.";
    case EINVAL: return "name or options is invalid. name must be valid UTF-8 and options must make sense.";
    case ENOTDIR: return "A component of path is not a directory.";
    case ENAMETOOLONG: return "name exceeded XATTR_MAXNAMELEN UTF-8 bytes, or a component of path exceeded NAME_MAX characters, or the entire path exceeded PATH_MAX characters.";
    case EACCES: return "Search permission is denied for a component of path or permission to set the attribute is denied.";
    case ELOOP: return "Too many symbolic links were encountered resolving path.";
    case EFAULT: return "path or name points to an invalid address.";
    case EIO: return "An I/O error occurred while reading from or writing to the file system.";
    case E2BIG: return "The data size of the extended attribute is too large.";
    case ENOSPC: return "Not enough space left on the file system.";
    default: return errorDescription(e);
  }
}

const char* errorCode(int e) {
  switch (e) {
    /* Standard */
    case EPERM: return "EPERM";
    case ENOENT: return "ENOENT";
    case ESRCH: return "ESRCH";
    case EINTR: return "EINTR";
    case EIO: return "EIO";
    case ENXIO: return "ENXIO";
    case E2BIG: return "E2BIG";
    case ENOEXEC: return "ENOEXEC";
    case EBADF: return "EBADF";
    case ECHILD: return "ECHILD";
    case EAGAIN: return "EAGAIN";
    case ENOMEM: return "ENOMEM";
    case EACCES: return "EACCES";
    case EFAULT: return "EFAULT";
    case ENOTBLK: return "ENOTBLK";
    case EBUSY: return "EBUSY";
    case EEXIST: return "EEXIST";
    case EXDEV: return "EXDEV";
    case ENODEV: return "ENODEV";
    case ENOTDIR: return "ENOTDIR";
    case EISDIR: return "EISDIR";
    case EINVAL: return "EINVAL";
    case ENFILE: return "ENFILE";
    case EMFILE: return "EMFILE";
    case ENOTTY: return "ENOTTY";
    case ETXTBSY: return "ETXTBSY";
    case EFBIG: return "EFBIG";
    case ENOSPC: return "ENOSPC";
    case ESPIPE: return "ESPIPE";
    case EROFS: return "EROFS";
    case EMLINK: return "EMLINK";
    case EPIPE: return "EPIPE";
    case EDOM: return "EDOM";
    case ERANGE: return "ERANGE";
    /* Special */
    case E_ENOATTR: return S_ENOATTR;
    case ENOTSUP: return "ENOTSUP";
    case ENAMETOOLONG: return "ENAMETOOLONG";
    case ELOOP: return "ELOOP";
    /* Unknown */
    default: return "";
  }
}

void ThrowExceptionErrno(int e) {

  Local<Object> err = v8::Exception::Error(NanNew(errorDescriptionForGet(e)))->ToObject();
  err->Set(NanNew("errno"), NanNew<Integer>(e));
  err->Set(NanNew("code"), NanNew(errorCode(e)));

  NanThrowError(err);
}
