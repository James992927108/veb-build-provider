[Defines]
  PLATFORM_NAME                  = TestPlatform
  PLATFORM_GUID                  = 12345678-1234-1234-1234-123456789abc
  PLATFORM_VERSION               = 0.1
  DSC_SPECIFICATION               = 0x00010005

!include MdePkg/MdePkg.dec

[LibraryClasses]
  UefiLib|MdePkg/Library/UefiLib/UefiLib.inf
  BaseLib|MdePkg/Library/BaseLib/BaseLib.inf

[Components]
  TestPkg/TestModule.inf
  TestPkg/AnotherModule.inf
