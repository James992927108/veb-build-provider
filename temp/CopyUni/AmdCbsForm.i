#line 1 "c:\\1-tpe_bios_code\\turin-a8isbios\\AmdCbsPkg\\Build\\ResourceBRH\\AmdCbsForm.vfr"
#line 1 "c:\\1-tpe_bios_code\\turin-a8isbios\\Build\\Titanite\\DEBUG_VS2015\\X64\\AmdCbsPkg\\Library\\Family\\0x1A\\BRH\\External\\CbsSetupLib\\DEBUG\\CbsSetupLibInstanceStrDefs.h"







































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































#line 2153 "c:\\1-tpe_bios_code\\turin-a8isbios\\Build\\Titanite\\DEBUG_VS2015\\X64\\AmdCbsPkg\\Library\\Family\\0x1A\\BRH\\External\\CbsSetupLib\\DEBUG\\CbsSetupLibInstanceStrDefs.h"

#line 2155 "c:\\1-tpe_bios_code\\turin-a8isbios\\Build\\Titanite\\DEBUG_VS2015\\X64\\AmdCbsPkg\\Library\\Family\\0x1A\\BRH\\External\\CbsSetupLib\\DEBUG\\CbsSetupLibInstanceStrDefs.h"

#line 1 "c:\\1-tpe_bios_code\\turin-a8isbios\\AmdCbsPkg\\Build\\ResourceBRH\\AmdCbsForm.vfr"






#line 1 "c:\\1-tpe_bios_code\\turin-a8isbios\\MdePkg\\Include\\Guid/HiiPlatformSetupFormset.h"



























extern EFI_GUID  gEfiHiiPlatformSetupFormsetGuid;
extern EFI_GUID  gEfiHiiDriverHealthFormsetGuid;
extern EFI_GUID  gEfiHiiUserCredentialFormsetGuid;
extern EFI_GUID  gEfiHiiRestStyleFormsetGuid;

#line 34 "c:\\1-tpe_bios_code\\turin-a8isbios\\MdePkg\\Include\\Guid/HiiPlatformSetupFormset.h"
#line 8 "c:\\1-tpe_bios_code\\turin-a8isbios\\AmdCbsPkg\\Build\\ResourceBRH\\AmdCbsForm.vfr"
#line 1 "c:\\1-tpe_bios_code\\turin-a8isbios\\amdcbspkg\\build\\resourcebrh\\AmdCbsFormID.h"









  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  


  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  


  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

#line 357 "c:\\1-tpe_bios_code\\turin-a8isbios\\amdcbspkg\\build\\resourcebrh\\AmdCbsFormID.h"

#line 9 "c:\\1-tpe_bios_code\\turin-a8isbios\\AmdCbsPkg\\Build\\ResourceBRH\\AmdCbsForm.vfr"
#line 1 "c:\\1-tpe_bios_code\\turin-a8isbios\\AmdCbsPkg\\Include\\Guid/AmdCbsConfig.h"













































extern EFI_GUID { 0x3A997502, 0x647A, 0x4c82, {0x99, 0x8E, 0x52, 0xEF, 0x94, 0x86, 0xA2, 0x47} };




















#line 68 "c:\\1-tpe_bios_code\\turin-a8isbios\\AmdCbsPkg\\Include\\Guid/AmdCbsConfig.h"
#line 10 "c:\\1-tpe_bios_code\\turin-a8isbios\\AmdCbsPkg\\Build\\ResourceBRH\\AmdCbsForm.vfr"
#line 1 "c:\\1-tpe_bios_code\\turin-a8isbios\\amdcbspkg\\build\\resourcebrh\\AmdCbsVariable.h"









#pragma pack(push,1)

typedef struct _CBS_VARIABLE_HEADER
{
  UINT32 CbsVariableStructUniqueValue;                             
  UINT32 NewRecordOffset;                                          
  UINT32 ApcbVariableHash;                                         
  UINT16 CbsComboChipsetFlag;                                      
  UINT8  CbsChipsetVisibleFlag0;                                   
  UINT8  CbsChipsetVisibleFlag1;                                   
  UINT32 CbsRevisionNumber;                                        
  UINT8  CbsMemTech;                                               
  UINT8  Reserved[11];                                             
} CBS_VARIABLE_HEADER;


typedef struct _CBS_CONFIG {
  CBS_VARIABLE_HEADER  Header;                                    
  UINT8         CbsComboFlag;                                     
  UINT8         CbsCmnCpuRMSS;                                    
  UINT8         CbsCmnCpuGenWA05;                                 
  UINT8         CbsCmnCpuPfeh;                                    
  UINT8         CbsCmnCpuCpb;                                     
  UINT8         CbsCmnCpuGlobalCstateCtrl;                        
  UINT8         CbsCmnGnbPowerSupplyIdleCtrl;                     
  UINT8         CbsCmnCpuStreamingStoresCtrl;                     
  UINT8         CbsDbgCpuLApicMode;                               
  UINT8         CbsCmnCpuCstC1Ctrl;                               
  UINT16        CbsCmnCpuCstC2Latency;                            
  UINT8         CbsCmnCpuMcaErrThreshEn;                          
  UINT16        CbsCmnCpuMcaErrThreshCount;                       
  UINT16        CbsCmnPCIeErrThreshCount;                         
  UINT8         CbsCmnCpuMcaFruTextEn;                            
  UINT8         CbsCmnCpuSmuPspDebugMode;                         
  UINT8         CbsCmnCpuPpinCtrl;                                
  UINT8         CbsCmnCpuSmee;                                    
  UINT8         CbsPspSevCtrl;                                    
  UINT32        CbsCmnCpuSevAsidSpaceLimit;                       
  UINT8         CbsDbgCpuSnpMemCover;                             
  UINT32        CbsDbgCpuSnpMemSizeCover;                         
  UINT8         CbsCmnCpu64BitMMIOCoverage;                       
  UINT16        CbsCmnCpu64BitMMIORmpS0RBMask;                    
  UINT16        CbsCmnCpu64BitMMIORmpS1RBMask;                    
  UINT8         CbsDbgCpuSplitRMP;                                
  UINT8         CbsDbgCpuSegmentedRMP;                            
  UINT8         CbsDbgCpuRmpSegmentSize;                          
  UINT8         CbsCmnActionOnBistFailure;                        
  UINT8         CbsCmnCpuERMS;                                    
  UINT8         CbsCmnCpuLogTransparentErrors;                    
  UINT8         CbsCmnCpuAvx512;                                  
  UINT8         CbsCmnCpuDisFstStrErmsb;                          
  UINT8         CbsCmnCpuMonMwaitDis;                             
  UINT8         CbsCpuSpeculativeStoreModes;                      
  UINT8         CbsCmnCpuFSRM;                                    
  UINT8         CbsCmnCpuPauseCntSel_1_0;                         
  UINT8         CbsCmnCpuPfReqThrEn;                              
  UINT8         CbsCmnCmcNotificationType;                        
  UINT8         CbsCmnCpuScanDumpDbgEn;                           
  UINT8         CbsCmnCpuMcax64BankSupport;                       
  UINT8         CbsCmnCpuAdaptiveAlloc;                           
  UINT8         CbsCpuLatencyUnderLoad;                           
  UINT8         CbsCmnCoreTraceDumpEn;                            
  UINT8         CbsCmnCpuFP512;                                   
  UINT8         CbsCmnCpuAmdErmsbRepo;                            
  UINT8         CbsCmnCpuOcMode;                                  
  UINT8         CbsCmnCpuDowncoreMode;                            
  UINT8         CbsCpuSmtCtrl;                                    
  UINT16        CbsCmnCpuReqMinFreq;                              
  UINT8         CbsCmnCpuEnReqMinFreq;                            
  UINT8         CbsCpuLegalDisclaimer;                            
  UINT8         CbsCpuLegalDisclaimer1;                           
  UINT8         CbsCpuPstCustomP0;                                
  UINT32        CbsCpuPst0Freq;                                   
  UINT32        CbsCpuCofP0;                                      
  UINT32        CbsCpuVoltageP0;                                  
  UINT32        CbsCpuPst0Fid;                                    
  UINT32        CbsCpuPst0Vid;                                    
  UINT8         CbsCpuPstCustomP1;                                
  UINT32        CbsCpuCofP1;                                      
  UINT32        CbsCpuVoltageP1;                                  
  UINT32        CbsCpuPst1Fid;                                    
  UINT32        CbsCpuPst1Vid;                                    
  UINT8         CbsCpuPstCustomP2;                                
  UINT32        CbsCpuCofP2;                                      
  UINT32        CbsCpuVoltageP2;                                  
  UINT32        CbsCpuPst2Fid;                                    
  UINT32        CbsCpuPst2Vid;                                    
  UINT8         CbsCpuPstCustomP3;                                
  UINT32        CbsCpuCofP3;                                      
  UINT32        CbsCpuVoltageP3;                                  
  UINT32        CbsCpuPst3Fid;                                    
  UINT32        CbsCpuPst3Vid;                                    
  UINT8         CbsCpuPstCustomP4;                                
  UINT32        CbsCpuCofP4;                                      
  UINT32        CbsCpuVoltageP4;                                  
  UINT32        CbsCpuPst4Fid;                                    
  UINT32        CbsCpuPst4Vid;                                    
  UINT8         CbsCpuPstCustomP5;                                
  UINT32        CbsCpuCofP5;                                      
  UINT32        CbsCpuVoltageP5;                                  
  UINT32        CbsCpuPst5Fid;                                    
  UINT32        CbsCpuPst5Vid;                                    
  UINT8         CbsCpuPstCustomP6;                                
  UINT32        CbsCpuCofP6;                                      
  UINT32        CbsCpuVoltageP6;                                  
  UINT32        CbsCpuPst6Fid;                                    
  UINT32        CbsCpuPst6Vid;                                    
  UINT8         CbsCpuPstCustomP7;                                
  UINT32        CbsCpuCofP7;                                      
  UINT32        CbsCpuVoltageP7;                                  
  UINT32        CbsCpuPst7Fid;                                    
  UINT32        CbsCpuPst7Vid;                                    
  UINT32        CbsCmnCpuCcd0DowncoreBitMap;                      
  UINT32        CbsCmnCpuCcd1DowncoreBitMap;                      
  UINT32        CbsCmnCpuCcd2DowncoreBitMap;                      
  UINT32        CbsCmnCpuCcd3DowncoreBitMap;                      
  UINT32        CbsCmnCpuCcd4DowncoreBitMap;                      
  UINT32        CbsCmnCpuCcd5DowncoreBitMap;                      
  UINT32        CbsCmnCpuCcd6DowncoreBitMap;                      
  UINT32        CbsCmnCpuCcd7DowncoreBitMap;                      
  UINT32        CbsCmnCpuCcd8DowncoreBitMap;                      
  UINT32        CbsCmnCpuCcd9DowncoreBitMap;                      
  UINT32        CbsCmnCpuCcd10DowncoreBitMap;                     
  UINT32        CbsCmnCpuCcd11DowncoreBitMap;                     
  UINT32        CbsCmnCpuCcd12DowncoreBitMap;                     
  UINT32        CbsCmnCpuCcd13DowncoreBitMap;                     
  UINT32        CbsCmnCpuCcd14DowncoreBitMap;                     
  UINT32        CbsCmnCpuCcd15DowncoreBitMap;                     
  UINT8         CbsCpuCcdCtrl;                                    
  UINT8         CbsCpuCoreCtrl;                                   
  UINT8         CbsCmnCpuL1StreamHwPrefetcher;                    
  UINT8         CbsCmnCpuL1StridePrefetcher;                      
  UINT8         CbsCmnCpuL1RegionPrefetcher;                      
  UINT8         CbsCmnCpuL2StreamHwPrefetcher;                    
  UINT8         CbsCmnCpuL2UpDownPrefetcher;                      
  UINT8         CbsCmnCpuL1BurstPrefetchMode;                     
  UINT8         CbsDbgCpuGenCpuWdt;                               
  UINT16        CbsDbgCpuGenCpuWdtTimeout;                        
  UINT8         CbsDfCmnWdtInterval;                              
  UINT8         CbsDfCmnExtIpSyncFloodProp;                       
  UINT8         CbsDfCmnDisSyncFloodProp;                         
  UINT8         CbsDfCmnFreezeQueueError;                         
  UINT8         CbsDfCmnCc6MemEncryption;                         
  UINT8         CbsDfCmnCcdBwThrottleLv;                          
  UINT32        CbsDfDbgNumPciSegments;                           
  UINT8         CbsDfCmnCcmThrot;                                 
  UINT8         CbsDfCmnFineThrotHeavy;                           
  UINT8         CbsDfCmnFineThrotLight;                           
  UINT8         CbsDfCmnCleanVicFtiCmdBal;                        
  UINT8         CbsDfCmnReqvReqNDImbThr;                          
  UINT8         CbsDfCmnCxlStronglyOrderedWrites;                 
  UINT8         CbsDfCmnDramNps;                                  
  UINT8         CbsDfCmnMemIntlv;                                 
  UINT8         CbsDfCmnMixedInterleavedMode;                     
  UINT8         CbsDfCmnCxlMemIntlv;                              
  UINT8         CbsDfCnliSublinkInterleaving;                     
  UINT8         CbsDfCmnDramMapInversion;                         
  UINT8         CbsDfCmnCc6AllocationScheme;                      
  UINT8         CbsDfCmnAcpiSratL3Numa;                           
  UINT8         CbsDfCmnAcpiSlitDistCtrl;                         
  UINT8         CbsDfCmnAcpiSlitRemoteFar;                        
  UINT8         CbsDfCmnAcpiSlitVirtualDist;                      
  UINT8         CbsDfCmnAcpiSlitLclDist;                          
  UINT8         CbsDfCmnAcpiSlitRmtDist;                          
  UINT8         CbsDfCmnAcpiSlitCxlLcl;                           
  UINT8         CbsDfCmnAcpiSlitCxlRmt;                           
  UINT8         CbsDfCmnGmiEncryption;                            
  UINT8         CbsDfCmnXGmiEncryption;                           
  UINT8         CbsDfDbgXgmiLinkCfg;                              
  UINT8         CbsDfCmn4LinkMaxXgmiSpeed;                        
  UINT8         CbsDfCmn3LinkMaxXgmiSpeed;                        
  UINT8         CbsDfXgmiCrcScale;                                
  UINT8         CbsDfXgmiCrcThreshold;                            
  UINT8         CbsDfXgmiPresetControl;                           
  UINT8         CbsDfXgmiTrainingErrMask;                         
  UINT32        CbsDfXgmiPresetP11;                               
  UINT32        CbsDfXgmiCmn1P11;                                 
  UINT32        CbsDfXgmiCnP11;                                   
  UINT32        CbsDfXgmiCnp1P11;                                 
  UINT32        CbsDfXgmiPresetP12;                               
  UINT32        CbsDfXgmiCmn1P12;                                 
  UINT32        CbsDfXgmiCnP12;                                   
  UINT32        CbsDfXgmiCnp1P12;                                 
  UINT32        CbsDfXgmiPresetP13;                               
  UINT32        CbsDfXgmiCmn1P13;                                 
  UINT32        CbsDfXgmiCnP13;                                   
  UINT32        CbsDfXgmiCnp1P13;                                 
  UINT32        CbsDfXgmiPresetP14;                               
  UINT32        CbsDfXgmiCmn1P14;                                 
  UINT32        CbsDfXgmiCnP14;                                   
  UINT32        CbsDfXgmiCnp1P14;                                 
  UINT32        CbsDfXgmiPresetP15;                               
  UINT32        CbsDfXgmiCmn1P15;                                 
  UINT32        CbsDfXgmiCnP15;                                   
  UINT32        CbsDfXgmiCnp1P15;                                 
  UINT16        CbsDfXgmiInitPresetS0L0;                          
  UINT16        CbsDfXgmiInitPresetS0L0P0;                        
  UINT16        CbsDfXgmiInitPresetS0L0P1;                        
  UINT16        CbsDfXgmiInitPresetS0L0P2;                        
  UINT16        CbsDfXgmiInitPresetS0L0P3;                        
  UINT16        CbsDfXgmiInitPresetS0L1;                          
  UINT16        CbsDfXgmiInitPresetS0L1P0;                        
  UINT16        CbsDfXgmiInitPresetS0L1P1;                        
  UINT16        CbsDfXgmiInitPresetS0L1P2;                        
  UINT16        CbsDfXgmiInitPresetS0L1P3;                        
  UINT16        CbsDfXgmiInitPresetS0L2;                          
  UINT16        CbsDfXgmiInitPresetS0L2P0;                        
  UINT16        CbsDfXgmiInitPresetS0L2P1;                        
  UINT16        CbsDfXgmiInitPresetS0L2P2;                        
  UINT16        CbsDfXgmiInitPresetS0L2P3;                        
  UINT16        CbsDfXgmiInitPresetS0L3;                          
  UINT16        CbsDfXgmiInitPresetS0L3P0;                        
  UINT16        CbsDfXgmiInitPresetS0L3P1;                        
  UINT16        CbsDfXgmiInitPresetS0L3P2;                        
  UINT16        CbsDfXgmiInitPresetS0L3P3;                        
  UINT16        CbsDfXgmiInitPresetS1L0;                          
  UINT16        CbsDfXgmiInitPresetS1L0P0;                        
  UINT16        CbsDfXgmiInitPresetS1L0P1;                        
  UINT16        CbsDfXgmiInitPresetS1L0P2;                        
  UINT16        CbsDfXgmiInitPresetS1L0P3;                        
  UINT16        CbsDfXgmiInitPresetS1L1;                          
  UINT16        CbsDfXgmiInitPresetS1L1P0;                        
  UINT16        CbsDfXgmiInitPresetS1L1P1;                        
  UINT16        CbsDfXgmiInitPresetS1L1P2;                        
  UINT16        CbsDfXgmiInitPresetS1L1P3;                        
  UINT16        CbsDfXgmiInitPresetS1L2;                          
  UINT16        CbsDfXgmiInitPresetS1L2P0;                        
  UINT16        CbsDfXgmiInitPresetS1L2P1;                        
  UINT16        CbsDfXgmiInitPresetS1L2P2;                        
  UINT16        CbsDfXgmiInitPresetS1L2P3;                        
  UINT16        CbsDfXgmiInitPresetS1L3;                          
  UINT16        CbsDfXgmiInitPresetS1L3P0;                        
  UINT16        CbsDfXgmiInitPresetS1L3P1;                        
  UINT16        CbsDfXgmiInitPresetS1L3P2;                        
  UINT16        CbsDfXgmiInitPresetS1L3P3;                        
  UINT32        CbsDfXgmiTxeqS0L0P01;                             
  UINT32        CbsDfXgmiTxeqS0L0P23;                             
  UINT32        CbsDfXgmiTxeqS0L0P0;                              
  UINT32        CbsDfXgmiTxeqS0L0P1;                              
  UINT32        CbsDfXgmiTxeqS0L0P2;                              
  UINT32        CbsDfXgmiTxeqS0L0P3;                              
  UINT32        CbsDfXgmiTxeqS0L1P01;                             
  UINT32        CbsDfXgmiTxeqS0L1P23;                             
  UINT32        CbsDfXgmiTxeqS0L1P0;                              
  UINT32        CbsDfXgmiTxeqS0L1P1;                              
  UINT32        CbsDfXgmiTxeqS0L1P2;                              
  UINT32        CbsDfXgmiTxeqS0L1P3;                              
  UINT32        CbsDfXgmiTxeqS0L2P01;                             
  UINT32        CbsDfXgmiTxeqS0L2P23;                             
  UINT32        CbsDfXgmiTxeqS0L2P0;                              
  UINT32        CbsDfXgmiTxeqS0L2P1;                              
  UINT32        CbsDfXgmiTxeqS0L2P2;                              
  UINT32        CbsDfXgmiTxeqS0L2P3;                              
  UINT32        CbsDfXgmiTxeqS0L3P01;                             
  UINT32        CbsDfXgmiTxeqS0L3P23;                             
  UINT32        CbsDfXgmiTxeqS0L3P0;                              
  UINT32        CbsDfXgmiTxeqS0L3P1;                              
  UINT32        CbsDfXgmiTxeqS0L3P2;                              
  UINT32        CbsDfXgmiTxeqS0L3P3;                              
  UINT32        CbsDfXgmiTxeqS1L0P01;                             
  UINT32        CbsDfXgmiTxeqS1L0P23;                             
  UINT32        CbsDfXgmiTxeqS1L0P0;                              
  UINT32        CbsDfXgmiTxeqS1L0P1;                              
  UINT32        CbsDfXgmiTxeqS1L0P2;                              
  UINT32        CbsDfXgmiTxeqS1L0P3;                              
  UINT32        CbsDfXgmiTxeqS1L1P01;                             
  UINT32        CbsDfXgmiTxeqS1L1P23;                             
  UINT32        CbsDfXgmiTxeqS1L1P0;                              
  UINT32        CbsDfXgmiTxeqS1L1P1;                              
  UINT32        CbsDfXgmiTxeqS1L1P2;                              
  UINT32        CbsDfXgmiTxeqS1L1P3;                              
  UINT32        CbsDfXgmiTxeqS1L2P01;                             
  UINT32        CbsDfXgmiTxeqS1L2P23;                             
  UINT32        CbsDfXgmiTxeqS1L2P0;                              
  UINT32        CbsDfXgmiTxeqS1L2P1;                              
  UINT32        CbsDfXgmiTxeqS1L2P2;                              
  UINT32        CbsDfXgmiTxeqS1L2P3;                              
  UINT32        CbsDfXgmiTxeqS1L3P01;                             
  UINT32        CbsDfXgmiTxeqS1L3P23;                             
  UINT32        CbsDfXgmiTxeqS1L3P0;                              
  UINT32        CbsDfXgmiTxeqS1L3P1;                              
  UINT32        CbsDfXgmiTxeqS1L3P2;                              
  UINT32        CbsDfXgmiTxeqS1L3P3;                              
  UINT8         CbsDfXgmiAcDcCoupledLinkControl;                  
  UINT8         CbsDfXgmiAcDcCoupledLink;                         
  UINT8         CbsDfXgmiAcDcCoupledLinkSocket0Link0;             
  UINT8         CbsDfXgmiAcDcCoupledLinkSocket0Link1;             
  UINT8         CbsDfXgmiAcDcCoupledLinkSocket0Link2;             
  UINT8         CbsDfXgmiAcDcCoupledLinkSocket0Link3;             
  UINT8         CbsDfXgmiAcDcCoupledLinkSocket1Link0;             
  UINT8         CbsDfXgmiAcDcCoupledLinkSocket1Link1;             
  UINT8         CbsDfXgmiAcDcCoupledLinkSocket1Link2;             
  UINT8         CbsDfXgmiAcDcCoupledLinkSocket1Link3;             
  UINT8         CbsDfXgmiChannelTypeControl;                      
  UINT32        CbsDfXgmiChannelType;                             
  UINT32        CbsDfXgmiChannelTypeSocket0Link0;                 
  UINT32        CbsDfXgmiChannelTypeSocket0Link1;                 
  UINT32        CbsDfXgmiChannelTypeSocket0Link2;                 
  UINT32        CbsDfXgmiChannelTypeSocket0Link3;                 
  UINT32        CbsDfXgmiChannelTypeSocket1Link0;                 
  UINT32        CbsDfXgmiChannelTypeSocket1Link1;                 
  UINT32        CbsDfXgmiChannelTypeSocket1Link2;                 
  UINT32        CbsDfXgmiChannelTypeSocket1Link3;                 
  UINT8         CbsDfCdma;                                        
  UINT8         CbsDfDbgDisRmtSteer;                              
  UINT8         CbsDfCmnPfOrganization;                           
  UINT8         CbsCmnDfPdrTuning;                                
  UINT8         CbsDfCmnMemIntlvPageSize;                         
  UINT8         CbsCmnMemCsInterleaveDdr;                         
  UINT8         CbsCmnMemAddressHashBankDdr;                      
  UINT8         CbsCmnMemAddressHashCsDdr;                        
  UINT8         CbsCmnMemAddressHashRmDdr;                        
  UINT8         CbsCmnMemAddressHashSubchannelDdr;                
  UINT8         CbsCmnMemCtrllerBankSwapModeDdr;                  
  UINT8         CbsCmnMemContextRestoreDdr;                       
  UINT8         CbsDramSurvivesWarmReset;                         
  UINT8         CbsCmnMemCtrllerPwrDnEnDdr;                       
  UINT8         CbsCmnMemSubUrgRefLowerBound;                     
  UINT8         CbsCmnMemUrgRefLimit;                             
  UINT8         CbsCmnMemDramRefreshRate;                         
  UINT8         CbsCmnMemSelfRefreshExitStaggering;               
  UINT8         CbsCmnMemt2xRefreshTemperatureThreshold;          
  UINT8         CbsCmnMemChannelDisableFloatPowerGoodDdr;         
  UINT32        CbsCmnMemChannelDisableBitmaskDdr;                
  UINT8         CbsCmnMemSocket0Channel0Ddr;                      
  UINT8         CbsCmnMemSocket0Channel1Ddr;                      
  UINT8         CbsCmnMemSocket0Channel2Ddr;                      
  UINT8         CbsCmnMemSocket0Channel3Ddr;                      
  UINT8         CbsCmnMemSocket0Channel4Ddr;                      
  UINT8         CbsCmnMemSocket0Channel5Ddr;                      
  UINT8         CbsCmnMemSocket0Channel6Ddr;                      
  UINT8         CbsCmnMemSocket0Channel7Ddr;                      
  UINT8         CbsCmnMemSocket0Channel8Ddr;                      
  UINT8         CbsCmnMemSocket0Channel9Ddr;                      
  UINT8         CbsCmnMemSocket0Channel10Ddr;                     
  UINT8         CbsCmnMemSocket0Channel11Ddr;                     
  UINT8         CbsCmnMemSocket1Channel0Ddr;                      
  UINT8         CbsCmnMemSocket1Channel1Ddr;                      
  UINT8         CbsCmnMemSocket1Channel2Ddr;                      
  UINT8         CbsCmnMemSocket1Channel3Ddr;                      
  UINT8         CbsCmnMemSocket1Channel4Ddr;                      
  UINT8         CbsCmnMemSocket1Channel5Ddr;                      
  UINT8         CbsCmnMemSocket1Channel6Ddr;                      
  UINT8         CbsCmnMemSocket1Channel7Ddr;                      
  UINT8         CbsCmnMemSocket1Channel8Ddr;                      
  UINT8         CbsCmnMemSocket1Channel9Ddr;                      
  UINT8         CbsCmnMemSocket1Channel10Ddr;                     
  UINT8         CbsCmnMemSocket1Channel11Ddr;                     
  UINT8         CbsCmnMemRefManagementDdr;                        
  UINT8         CbsCmnMemArfmDdr;                                 
  UINT8         CbsCmnMemRAAIMTDdr;                               
  UINT8         CbsCmnMemRAAMMTDdr;                               
  UINT8         CbsCmnMemRAARefDecMultiplierDdr;                  
  UINT8         CbsCmnMemDrfmDdr;                                 
  UINT8         CbsCmnMemDrfmBrcDdr;                              
  UINT8         CbsCmnMemDrfmHashDdr;                             
  UINT8         CbsCmnMemMbistEnDdr;                              
  UINT8         CbsCmnMemMbistTestmodeDdr;                        
  UINT8         CbsCmnMemMbistAggressorsDdr;                      
  UINT8         CbsCmnMemHealingBistEnableBitMaskDdr;             
  UINT8         CbsCmnMemHealingBistExecutionMode;                
  UINT8         CbsCmnMemHealingBistRepairTypeDdr;                
  UINT8         CbsCmnMemPmuBistAlgorithmSelect;                  
  UINT16        CbsCmnMemPmuBistAlgorithmBitMaskDdr;              
  UINT8         CbsCmnMemPmuBistAlgorithm1;                       
  UINT8         CbsCmnMemPmuBistAlgorithm2;                       
  UINT8         CbsCmnMemPmuBistAlgorithm3;                       
  UINT8         CbsCmnMemPmuBistAlgorithm4;                       
  UINT8         CbsCmnMemPmuBistAlgorithm5;                       
  UINT8         CbsCmnMemPmuBistAlgorithm6;                       
  UINT8         CbsCmnMemPmuBistAlgorithm7;                       
  UINT8         CbsCmnMemPmuBistAlgorithm8;                       
  UINT8         CbsCmnMemPmuBistAlgorithm9;                       
  UINT8         CbsCmnMemMbistPatternSelect;                      
  UINT8         CbsCmnMemMbistPatternLength;                      
  UINT8         CbsCmnMemMbistAggressorsChnl;                     
  UINT8         CbsCmnMemMbistAggrStaticLaneCtrl;                 
  UINT32        CbsCmnMemMbistAggrStaticLaneSelU32;               
  UINT32        CbsCmnMemMbistAggrStaticLaneSelL32;               
  UINT8         CbsCmnMemMbistAggrStaticLaneSelEcc;               
  UINT8         CbsCmnMemMbistAggrStaticLaneVal;                  
  UINT8         CbsCmnMemMbistTgtStaticLaneCtrl;                  
  UINT32        CbsCmnMemMbistTgtStaticLaneSelU32;                
  UINT32        CbsCmnMemMbistTgtStaticLaneSelL32;                
  UINT8         CbsCmnMemMbistTgtStaticLaneSelEcc;                
  UINT8         CbsCmnMemMbistTgtStaticLaneVal;                   
  UINT8         CbsCmnMemMbistReadDataEyeVoltageStep;             
  UINT8         CbsCmnMemMbistReadDataEyeTimingStep;              
  UINT8         CbsCmnMemMbistWriteDataEyeVoltageStep;            
  UINT8         CbsCmnMemMbistWriteDataEyeTimingStep;             
  UINT8         CbsCmnMemMbistDataeyeSilentExecution;             
  UINT8         CbsCmnMemDataPoisoningDdr;                        
  UINT8         CbsCmnMemBootTimePostPackageRepair;               
  UINT8         CbsCmnMemRuntimePostPackageRepair;                
  UINT8         CbsCmnMemPostPackageRepairConfigInitiator;        
  UINT8         CbsCmnMemRcdParityDdr;                            
  UINT8         CbsCmnMemMaxRcdParityErrorReplayDdr;              
  UINT8         CbsCmnMemWriteCrcDdr;                             
  UINT8         CbsCmnMemMaxWriteCrcErrorReplayDdr;               
  UINT8         CbsCmnMemReadCrcDdr;                              
  UINT8         CbsCmnMemMaxReadCrcErrorReplayDdr;                
  UINT8         CbsCmnMemDisMemErrInj;                            
  UINT8         CbsCmnMemEcsStatusInterruptDdr;                   
  UINT8         CbsCmnMemCorrectedErrorCounterEnable;             
  UINT8         CbsCmnMemCorrectedErrorCounterInterruptEnable;    
  UINT8         CbsCmnMemCorrectedErrorCounterLeakRate;           
  UINT16        CbsCmnMemCorrectedErrorCounterStartCount;         
  UINT8         CbsCmnMemDramEccSymbolSizeDdr;                    
  UINT8         CbsCmnMemDramEccEnDdr;                            
  UINT8         CbsCmnMemDramUeccRetryDdr;                        
  UINT8         CbsCmnMemMaxDramUeccErrorReplayDdr;               
  UINT8         CbsCmnMemDramMemClrDdr;                           
  UINT8         CbsCmnMemAddrXorAfterEcc;                         
  UINT8         CbsDbgMemCipherTextHiding;                        
  UINT8         CbsCmnMemDramEcsModeDdr;                          
  UINT8         CbsCmnMemDramRedirectScrubEnDdr;                  
  UINT8         CbsCmnMemDramRedirectScrubLimitDdr;               
  UINT8         CbsCmnMemDramScrubTime;                           
  UINT8         CbsCmnMemtECSintCtrlDdr;                          
  UINT16        CbsCmnMemtECSintDdr;                              
  UINT8         CbsCmnMemDramEtcDdr;                              
  UINT8         CbsCmnMemDramEcsCountModeDdr;                     
  UINT8         CbsCmnMemDramAutoEcsSelfRefreshDdr;               
  UINT8         CbsCmnMemDramEcsWritebackSuppressionDdr;          
  UINT8         CbsCmnMemDramX4WritebackSuppressionDdr;           
  UINT8         CbsCmnMemOdtImpedProcDdr;                         
  UINT8         CbsCmnMemOdtPullDownImpedProcDdr;                 
  UINT8         CbsCmnMemDramDrvStrenDqDdr;                       
  UINT8         CbsCmnMemRttNomWrP0Ddr;                           
  UINT8         CbsCmnMemRttNomRdP0Ddr;                           
  UINT8         CbsCmnMemRttWrP0Ddr;                              
  UINT8         CbsCmnMemRttParkP0Ddr;                            
  UINT8         CbsCmnMemRttParkDqsP0Ddr;                         
  UINT8         CbsCmnMemRttNomWrP1Ddr;                           
  UINT8         CbsCmnMemRttNomRdP1Ddr;                           
  UINT8         CbsCmnMemRttWrP1Ddr;                              
  UINT8         CbsCmnMemRttParkP1Ddr;                            
  UINT8         CbsCmnMemRttParkDqsP1Ddr;                         
  UINT8         CbsCmnMemTimingLegalDisclaimer;                   
  UINT8         CbsCmnMemTimingLegalDisclaimer1;                  
  UINT8         CbsCmnMemTimingSettingDdr;                        
  UINT16        CbsCmnMemTargetSpeedDdr;                          
  UINT8         CbsCmnMemTimingTclCtrlDdr;                        
  UINT16        CbsCmnMemTimingTclDdr;                            
  UINT8         CbsCmnMemTimingTrcdCtrlDdr;                       
  UINT16        CbsCmnMemTimingTrcdDdr;                           
  UINT8         CbsCmnMemTimingTrpCtrlDdr;                        
  UINT16        CbsCmnMemTimingTrpDdr;                            
  UINT8         CbsCmnMemTimingTrasCtrlDdr;                       
  UINT16        CbsCmnMemTimingTrasDdr;                           
  UINT8         CbsCmnMemTimingTrcCtrlDdr;                        
  UINT16        CbsCmnMemTimingTrcDdr;                            
  UINT8         CbsCmnMemTimingTwrCtrlDdr;                        
  UINT16        CbsCmnMemTimingTwrDdr;                            
  UINT8         CbsCmnMemTimingTrfc1CtrlDdr;                      
  UINT16        CbsCmnMemTimingTrfc1Ddr;                          
  UINT8         CbsCmnMemTimingTrfc2CtrlDdr;                      
  UINT16        CbsCmnMemTimingTrfc2Ddr;                          
  UINT8         CbsCmnMemTimingTrfcSbCtrlDdr;                     
  UINT16        CbsCmnMemTimingTrfcSbDdr;                         
  UINT8         CbsCmnMemTimingTcwlCtrlDdr;                       
  UINT16        CbsCmnMemTimingTcwlDdr;                           
  UINT8         CbsCmnMemTimingTrtpCtrlDdr;                       
  UINT16        CbsCmnMemTimingTrtpDdr;                           
  UINT8         CbsCmnMemTimingTrrdLCtrlDdr;                      
  UINT16        CbsCmnMemTimingTrrdLDdr;                          
  UINT8         CbsCmnMemTimingTrrdSCtrlDdr;                      
  UINT16        CbsCmnMemTimingTrrdSDdr;                          
  UINT8         CbsCmnMemTimingTfawCtrlDdr;                       
  UINT16        CbsCmnMemTimingTfawDdr;                           
  UINT8         CbsCmnMemTimingTwtrLCtrlDdr;                      
  UINT16        CbsCmnMemTimingTwtrLDdr;                          
  UINT8         CbsCmnMemTimingTwtrSCtrlDdr;                      
  UINT16        CbsCmnMemTimingTwtrSDdr;                          
  UINT8         CbsCmnMemTimingTrdrdScLCtrlDdr;                   
  UINT16        CbsCmnMemTimingTrdrdScLDdr;                       
  UINT8         CbsCmnMemTimingTrdrdScCtrlDdr;                    
  UINT16        CbsCmnMemTimingTrdrdScDdr;                        
  UINT8         CbsCmnMemTimingTrdrdSdCtrlDdr;                    
  UINT16        CbsCmnMemTimingTrdrdSdDdr;                        
  UINT8         CbsCmnMemTimingTrdrdDdCtrlDdr;                    
  UINT16        CbsCmnMemTimingTrdrdDdDdr;                        
  UINT8         CbsCmnMemTimingTwrwrScLCtrlDdr;                   
  UINT16        CbsCmnMemTimingTwrwrScLDdr;                       
  UINT8         CbsCmnMemTimingTwrwrScCtrlDdr;                    
  UINT16        CbsCmnMemTimingTwrwrScDdr;                        
  UINT8         CbsCmnMemTimingTwrwrSdCtrlDdr;                    
  UINT16        CbsCmnMemTimingTwrwrSdDdr;                        
  UINT8         CbsCmnMemTimingTwrwrDdCtrlDdr;                    
  UINT16        CbsCmnMemTimingTwrwrDdDdr;                        
  UINT8         CbsCmnMemTimingTwrrdCtrlDdr;                      
  UINT16        CbsCmnMemTimingTwrrdDdr;                          
  UINT8         CbsCmnMemTimingTrdwrCtrlDdr;                      
  UINT16        CbsCmnMemTimingTrdwrDdr;                          
  UINT8         CbsCmnMemDramPdaEnumIdProgModeDdr;                
  UINT8         CbsCmnMemWriteTrainingBurstLength;                
  UINT8         CbsCmnMemPeriodicTrainingModeDdr;                 
  UINT8         CbsCmnMemPeriodicIntervalMode;                    
  UINT16        CbsCmnMemPeriodicInterval;                        
  UINT8         CbsCmnMemTsmeEnableDdr;                           
  UINT8         CbsCmnMemAes;                                     
  UINT8         CbsCmnMemDataScramble;                            
  UINT8         CbsCmnMemSmeMkEnable;                             
  UINT8         CbsCmnPmicErrorReporting;                         
  UINT8         CbsCmnMemCtrllerPmicOpMode;                       
  UINT8         CbsCmnMemCtrllerPmicFaultRecovery;                
  UINT16        CbsCmnMemCtrllerPmicSwaSwbVddCore;                
  UINT16        CbsCmnMemCtrllerPmicSwcVddio;                     
  UINT16        CbsCmnMemCtrllerPmicSwdVpp;                       
  UINT8         CbsCmnMemCtrllerPmicStaggerDelay;                 
  UINT8         CbsCmnMemCtrllerMaxPmicPowerOn;                   
  UINT8         CbsCmnMemOdtsCmdThrottleCycleCtlDdr;              
  UINT8         CbsCmnMemOdtsCmdThrottleThresholdDdr;             
  UINT8         CbsCmnTsodThermalThrottleControlDdr;              
  UINT8         CbsCmnTsodThermalThrottleStartTempDdr;            
  UINT8         CbsCmnTsodThermalThrottleHysteresisDdr;           
  UINT8         CbsCmnTsodCmdThrottlePercentage0Ddr;              
  UINT8         CbsCmnTsodCmdThrottlePercentage5Ddr;              
  UINT8         CbsCmnTsodCmdThrottlePercentage10Ddr;             
  UINT8         CbsCmnGnbPcieLoopBackMode;                        
  UINT8         CbsEnable2SpcGen4;                                
  UINT8         CbsEnable2SpcGen5;                                
  UINT8         CbsGnbSafeRecoveryUponABERExceededError;          
  UINT8         CbsGnbPeriodicCalibration;                        
  UINT8         CbsCmnTDPCtl;                                     
  UINT32        CbsCmnTDPLimit;                                   
  UINT8         CbsCmnPPTCtl;                                     
  UINT32        CbsCmnPPTLimit;                                   
  UINT8         CbsCmnDeterminismCtl;                             
  UINT8         CbsCmnDeterminismEnable;                          
  UINT8         CbsCmnxGmiLinkWidthCtl;                           
  UINT8         CbsCmnxGmiForceLinkWidthCtl;                      
  UINT8         CbsCmnxGmiForceLinkWidth;                         
  UINT8         CbsCmnxGmiMaxLinkWidthCtl;                        
  UINT8         CbsCmnxGmiMaxLinkWidth;                           
  UINT8         CbsCmnxGmiMinLinkWidth;                           
  UINT8         CbsCmnApbdis;                                     
  UINT8         CbsCmnApbdisDfPstate;                             
  UINT8         CbsCmnEfficiencyModeEn;                           
  UINT8         CbsCmnXgmiPstateControl;                          
  UINT8         CbsCmnXgmiPstateSelection;                        
  UINT8         CbsCmnBoostFmaxEn;                                
  UINT32        CbsCmnBoostFmax;                                  
  UINT8         CbsCmnGnbSMUDffo;                                 
  UINT8         CbsCmnGnbSmuDfCstates;                            
  UINT8         CbsCmnGnbSmuCppc;                                 
  UINT8         CbsCmnGnbSMUHsmpSupport;                          
  UINT8         CbsCmnSvi3SvcSpeedCtl;                            
  UINT8         CbsCmnSvi3SvcSpeed;                               
  UINT8         CbsCmnX3dStackOverride;                           
  UINT8         CbsCmnL3Bist;                                     
  UINT8         CbsCmnGnbDiagMode;                                
  UINT8         CbsCmnGnbSmuGmiFolding;                           
  UINT8         CbsCmnThrottlerMode;                              
  UINT8         CbsCmnDFPstateRangeCtl;                           
  UINT8         CbsCmnDfPstateMax;                                
  UINT8         CbsCmnDfPstateMin;                                
  UINT8         CbsCmnRASControl;                                 
  UINT8         CbsCmnNBIOSyncFloodGen;                           
  UINT8         PcdSyncFloodToApml;                               
  UINT8         CmnGnbAmdPcieAerReportMechanism;                  
  UINT8         EdpcControl;                                      
  UINT16        AcsRasValue;                                      
  UINT8         CbsCmnPoisonConsumption;                          
  UINT8         CbsCmnGnbRasSyncfloodPcieFatalError;              
  UINT8         CbsCmnRASNumericalCommonOptions;                  
  UINT32        PcdEgressPoisonSeverityHi;                        
  UINT32        PcdEgressPoisonSeverityLo;                        
  UINT32        PcdAmdNbioEgressPoisonMaskHi;                     
  UINT32        PcdAmdNbioEgressPoisonMaskLo;                     
  UINT32        PcdAmdNbioRASUcpMaskHi;                           
  UINT32        PcdAmdNbioRASUcpMaskLo;                           
  UINT32        PcdSyshubWdtTimerInterval;                        
  UINT8         CbsCmnGnbDataObjectExchange;                      
  UINT8         CbsCmnGnbRtmMarginingSupport;                     
  UINT8         CbsCmnNbioForceSpeedLastAdvertised;               
  UINT8         CbsCmnLcMultUpstreamAuto;                         
  UINT16        STRAP_COMPLIANCE_DIS;                             
  UINT8         CbsCmnNbioPcieAdvertiseEqToHighRateSupport;       
  UINT8         CbsCmnGnbDataLinkFeatureCap;                      
  UINT8         CbsCmnGnbDataLinkFeatureExchange;                 
  UINT8         CbsCmnGnbSris;                                    
  UINT8         CbsDbgGnbDbgACSEnable;                            
  UINT8         CbsGnbCmnPcieTbtSupport;                          
  UINT8         CbsGnbCmnPcieAriEnumeration;                      
  UINT8         CmnGnbPcieAriSupport;                             
  UINT8         CbsPresenceDetectSelectmode;                      
  UINT8         CbsHotPlugHandlingMode;                           
  UINT8         CbsHotPlugPDSettle;                               
  UINT8         CbsHotPlugSettleTime;                             
  UINT8         CbsHotplugSupport;                                
  UINT8         CbsCmnEarlyLinkSpeed;                             
  UINT8         CbsDbgGnbDbgAERCAPEnable;                         
  UINT8         CbsCmnPcieCAPLinkSpeed;                           
  UINT8         CbsCmnPcieTargetLinkSpeed;                        
  UINT8         CbsCmnAllPortsASPM;                               
  UINT8         CbsCmnNbioMctpEn;                                 
  UINT8         CbsCmnNbioMctpMode;                               
  UINT8         CbsCmnNbioMctpDiscoveryNotifyMessage;             
  UINT8         CbsCmnNbioPcieNonPcieCompliantSupport;            
  UINT8         CbsCmnLimitHpDevicesToPcieBootSpeed;              
  UINT8         CbsCmnPCIeSFIConfigviaOOBEn;                      
  UINT8         CbsCmnNbioPcieIdlePowerSetting;                   
  UINT8         CbsCfgAcsEnRccDev0;                               
  UINT8         CbsCfgAerEnRccDev0;                               
  UINT8         CbsCfgDlfEnStrap1;                                
  UINT8         CbsCfgPhy16gtStrap1;                              
  UINT8         CbsCfgMarginEnStrap1;                             
  UINT8         CbsCfgAcsSourceValStrap5;                         
  UINT8         CbsCfgAcsTranslationalBlockingStrap5;             
  UINT8         CbsCfgAcsP2pReq;                                  
  UINT8         CbsCfgAcsP2pCompStrap5;                           
  UINT8         CbsCfgAcsUpstreamFwdStrap5;                       
  UINT8         CbsCfgAcsP2PEgressStrap5;                         
  UINT8         CbsCfgAcsDirectTranslatedStrap5;                  
  UINT8         CbsCfgAcsSsidEnStrap5;                            
  UINT8         CbsCfgPriEnPageReq;                               
  UINT8         CbsCfgPriResetPageReq;                            
  UINT8         CbsCfgAcsSourceVal;                               
  UINT8         CbsCfgAcsTranslationalBlocking;                   
  UINT8         CbsCfgAcsP2pComp;                                 
  UINT8         CbsCfgAcsUpstreamFwd;                             
  UINT8         CbsCfgAcsP2PEgress;                               
  UINT8         CbsCfgAcsP2pReqStrap5;                            
  UINT8         CbsCfgE2EPrefix;                                  
  UINT8         CbsCfgExtendedFmtSupported;                       
  UINT8         CbsCmnNbioAtomicRoutingStrap5;                    
  UINT8         CbsSevSnpSupport;                                 
  UINT8         CbsCmnDrtmMemoryReservation;                      
  UINT8         CbsCmnDrtmSupport;                                
  UINT8         CbsCmnDmaProtection;                              
  UINT8         CbsCmnGnbNbIOMMU;                                 
  UINT8         CbsCmnDmarSupport;                                
  UINT8         CbsCmnEnablePortBifurcation;                      
  UINT8         CbsCmnS0P0Override;                               
  UINT8         CbsCmnS0P1Override;                               
  UINT8         CbsCmnS0P2Override;                               
  UINT8         CbsCmnS0P3Override;                               
  UINT8         CbsCmnS1P0Override;                               
  UINT8         CbsCmnS1P1Override;                               
  UINT8         CbsCmnS1P2Override;                               
  UINT8         CbsCmnS1P3Override;                               
  UINT8         CbsCmnP0Override;                                 
  UINT8         CbsCmnP1Override;                                 
  UINT8         CbsCmnP2Override;                                 
  UINT8         CbsCmnP3Override;                                 
  UINT8         CbsCmnG0Override;                                 
  UINT8         CbsCmnG1Override;                                 
  UINT8         CbsCmnG2Override;                                 
  UINT8         CbsCmnG3Override;                                 
  UINT8         CbsCmnNbioPcieSearchMaskConfigGen3;               
  UINT16        CbsCmnNbioPcieSearchMaskGen3;                     
  UINT8         CbsCmnNbioPcieSearchMaskConfigGen4;               
  UINT16        CbsCmnNbioPcieSearchMaskGen4;                     
  UINT8         CbsCmnNbioPcieSearchMaskConfigGen5;               
  UINT16        CbsCmnNbioPcieSearchMaskGen5;                     
  UINT8         CbsCmnFchI3C0Config;                              
  UINT8         CbsCmnFchI3C1Config;                              
  UINT8         CbsCmnFchI3C2Config;                              
  UINT8         CbsCmnFchI3C3Config;                              
  UINT8         CbsCmnFchI2C4Config;                              
  UINT8         CbsCmnFchI2C5Config;                              
  UINT8         CbsCmnFchReleaseSpdHostControl;                   
  UINT8         CbsCmnFchPMFWDdr5Telemetry;                       
  UINT8         CbsCmnFchIxcTelemetryPortsFence;                  
  UINT8         CbsCmnFchI2cSdaHoldOverride;                      
  UINT8         CbsCmnFchApmlSbtsiSlvMode;                        
  UINT8         CbsCmnFchI3cModeSpeed;                            
  UINT8         CbsCmnFchI3cPpHcntValue;                          
  UINT8         CbsCmnFchI3cSdaHoldValue;                         
  UINT8         CbsCmnFchI3cSdaHoldOverride;                      
  UINT16        CbsCmnFchI2c0SdaTxHoldValue;                      
  UINT16        CbsCmnFchI2c1SdaTxHoldValue;                      
  UINT16        CbsCmnFchI2c2SdaTxHoldValue;                      
  UINT16        CbsCmnFchI2c3SdaTxHoldValue;                      
  UINT16        CbsCmnFchI2c4SdaTxHoldValue;                      
  UINT16        CbsCmnFchI2c5SdaTxHoldValue;                      
  UINT8         CbsCmnFchI2c0SdaRxHoldValue;                      
  UINT8         CbsCmnFchI2c1SdaRxHoldValue;                      
  UINT8         CbsCmnFchI2c2SdaRxHoldValue;                      
  UINT8         CbsCmnFchI2c3SdaRxHoldValue;                      
  UINT8         CbsCmnFchI2c4SdaRxHoldValue;                      
  UINT8         CbsCmnFchI2c5SdaRxHoldValue;                      
  UINT8         CbsCmnFchI3c0SdaHoldValue;                        
  UINT8         CbsCmnFchI3c1SdaHoldValue;                        
  UINT8         CbsCmnFchI3c2SdaHoldValue;                        
  UINT8         CbsCmnFchI3c3SdaHoldValue;                        
  UINT8         CbsCmnFchSataEnable;                              
  UINT8         CbsCmnFchSataClass;                               
  UINT8         CbsCmnFchSataRasSupport;                          
  UINT8         CbsCmnFchSataStaggeredSpinup;                     
  UINT8         CbsCmnFchSataAhciDisPrefetchFunction;             
  UINT8         CbsDbgFchSata0Enable;                             
  UINT8         CbsDbgFchSata1Enable;                             
  UINT8         CbsDbgFchSata2Enable;                             
  UINT8         CbsDbgFchSata3Enable;                             
  UINT8         CbsDbgFchSata4Enable;                             
  UINT8         CbsDbgFchSata5Enable;                             
  UINT8         CbsDbgFchSata6Enable;                             
  UINT8         CbsDbgFchSata7Enable;                             
  UINT8         CbsDbgFchSataeSATAPort0;                          
  UINT8         CbsDbgFchSataeSATAPort1;                          
  UINT8         CbsDbgFchSataeSATAPort2;                          
  UINT8         CbsDbgFchSataeSATAPort3;                          
  UINT8         CbsDbgFchSataeSATAPort4;                          
  UINT8         CbsDbgFchSataeSATAPort5;                          
  UINT8         CbsDbgFchSataeSATAPort6;                          
  UINT8         CbsDbgFchSataeSATAPort7;                          
  UINT8         CbsDbgFchSataMcmDie1EsataPort0;                   
  UINT8         CbsDbgFchSataMcmDie1EsataPort1;                   
  UINT8         CbsDbgFchSataMcmDie1EsataPort2;                   
  UINT8         CbsDbgFchSataMcmDie1EsataPort3;                   
  UINT8         CbsDbgFchSataMcmDie1EsataPort4;                   
  UINT8         CbsDbgFchSataMcmDie1EsataPort5;                   
  UINT8         CbsDbgFchSataMcmDie1EsataPort6;                   
  UINT8         CbsDbgFchSataMcmDie1EsataPort7;                   
  UINT8         CbsDbgFchSataMcmDie2EsataPort0;                   
  UINT8         CbsDbgFchSataMcmDie2EsataPort1;                   
  UINT8         CbsDbgFchSataMcmDie2EsataPort2;                   
  UINT8         CbsDbgFchSataMcmDie2EsataPort3;                   
  UINT8         CbsDbgFchSataMcmDie2EsataPort4;                   
  UINT8         CbsDbgFchSataMcmDie2EsataPort5;                   
  UINT8         CbsDbgFchSataMcmDie2EsataPort6;                   
  UINT8         CbsDbgFchSataMcmDie2EsataPort7;                   
  UINT8         CbsDbgFchSataMcmDie3EsataPort0;                   
  UINT8         CbsDbgFchSataMcmDie3EsataPort1;                   
  UINT8         CbsDbgFchSataMcmDie3EsataPort2;                   
  UINT8         CbsDbgFchSataMcmDie3EsataPort3;                   
  UINT8         CbsDbgFchSataMcmDie3EsataPort4;                   
  UINT8         CbsDbgFchSataMcmDie3EsataPort5;                   
  UINT8         CbsDbgFchSataMcmDie3EsataPort6;                   
  UINT8         CbsDbgFchSataMcmDie3EsataPort7;                   
  UINT8         CbsDbgFchSataMcmDie4EsataPort0;                   
  UINT8         CbsDbgFchSataMcmDie4EsataPort1;                   
  UINT8         CbsDbgFchSataMcmDie4EsataPort2;                   
  UINT8         CbsDbgFchSataMcmDie4EsataPort3;                   
  UINT8         CbsDbgFchSataMcmDie4EsataPort4;                   
  UINT8         CbsDbgFchSataMcmDie4EsataPort5;                   
  UINT8         CbsDbgFchSataMcmDie4EsataPort6;                   
  UINT8         CbsDbgFchSataMcmDie4EsataPort7;                   
  UINT8         CbsDbgFchSataMcmDie5EsataPort0;                   
  UINT8         CbsDbgFchSataMcmDie5EsataPort1;                   
  UINT8         CbsDbgFchSataMcmDie5EsataPort2;                   
  UINT8         CbsDbgFchSataMcmDie5EsataPort3;                   
  UINT8         CbsDbgFchSataMcmDie5EsataPort4;                   
  UINT8         CbsDbgFchSataMcmDie5EsataPort5;                   
  UINT8         CbsDbgFchSataMcmDie5EsataPort6;                   
  UINT8         CbsDbgFchSataMcmDie5EsataPort7;                   
  UINT8         CbsDbgFchSataMcmDie6EsataPort0;                   
  UINT8         CbsDbgFchSataMcmDie6EsataPort1;                   
  UINT8         CbsDbgFchSataMcmDie6EsataPort2;                   
  UINT8         CbsDbgFchSataMcmDie6EsataPort3;                   
  UINT8         CbsDbgFchSataMcmDie6EsataPort4;                   
  UINT8         CbsDbgFchSataMcmDie6EsataPort5;                   
  UINT8         CbsDbgFchSataMcmDie6EsataPort6;                   
  UINT8         CbsDbgFchSataMcmDie6EsataPort7;                   
  UINT8         CbsDbgFchSataMcmDie7EsataPort0;                   
  UINT8         CbsDbgFchSataMcmDie7EsataPort1;                   
  UINT8         CbsDbgFchSataMcmDie7EsataPort2;                   
  UINT8         CbsDbgFchSataMcmDie7EsataPort3;                   
  UINT8         CbsDbgFchSataMcmDie7EsataPort4;                   
  UINT8         CbsDbgFchSataMcmDie7EsataPort5;                   
  UINT8         CbsDbgFchSataMcmDie7EsataPort6;                   
  UINT8         CbsDbgFchSataMcmDie7EsataPort7;                   
  UINT8         CbsDbgFchSataAggresiveDevSlpP0;                   
  UINT8         CbsDbgFchSataDevSlpController0Num;                
  UINT8         CbsDbgFchSataDevSlpPort0Num;                      
  UINT8         CbsDbgFchSataAggresiveDevSlpP1;                   
  UINT8         CbsDbgFchSataDevSlpController1Num;                
  UINT8         CbsDbgFchSataDevSlpPort1Num;                      
  UINT8         CbsDbgFchSataMcmDie4DevSlp0;                      
  UINT8         CbsDbgFchSataMcmDie4DevSlpController0Num;         
  UINT8         CbsDbgFchSataMcmDie4DevSlp0Num;                   
  UINT8         CbsDbgFchSataMcmDie4DevSlp1;                      
  UINT8         CbsDbgFchSataMcmDie4DevSlpController1Num;         
  UINT8         CbsDbgFchSataMcmDie4DevSlp1Num;                   
  UINT8         CbsDbgFchSataSgpio0;                              
  UINT8         CbsDbgFchSataMcmDie1Sgpio0;                       
  UINT8         CbsDbgFchSataMcmDie2Sgpio0;                       
  UINT8         CbsDbgFchSataMcmDie3Sgpio0;                       
  UINT8         CbsDbgFchSataMcmDie4Sgpio0;                       
  UINT8         CbsDbgFchSataMcmDie5Sgpio0;                       
  UINT8         CbsDbgFchSataMcmDie6Sgpio0;                       
  UINT8         CbsDbgFchSataMcmDie7Sgpio0;                       
  UINT8         CbsCmnFchUsbXHCI0Enable;                          
  UINT8         CbsCmnFchUsbXHCI1Enable;                          
  UINT8         CbsCmnFchUsbXHCI2Enable;                          
  UINT8         CbsCmnFchUsbXHCI3Enable;                          
  UINT8         CbsCmnFchSystemPwrFailShadow;                     
  UINT8         CbsCmnFchPwrFailShadowABLEnabled;                 
  UINT8         CbsCmnFchUart0Config;                             
  UINT8         CbsCmnFchUart0LegacyConfig;                       
  UINT8         CbsCmnFchUart1Config;                             
  UINT8         CbsCmnFchUart1LegacyConfig;                       
  UINT8         CbsCmnFchUart2Config;                             
  UINT8         CbsCmnFchUart2LegacyConfig;                       
  UINT8         CbsCmnFchAlinkRasSupport;                         
  UINT8         CbsDbgFchSyncfloodEnable;                         
  UINT8         CbsDbgFchDelaySyncflood;                          
  UINT8         CbsDbgFchSystemSpreadSpectrum;                    
  UINT8         CbsCmnBootTimerEnable;                            
  UINT8         CbsCmnSP3NtbP0P0;                                 
  UINT8         CbsCmnSP3NtbStartLaneP0P0;                        
  UINT8         CbsCmnSP3NtbEndLaneP0P0;                          
  UINT8         CbsCmnSP3NtbLinkSpeedP0P0;                        
  UINT8         CbsCmnSP3NtbModeP0P0;                             
  UINT8         CbsCmnSP3NtbP0P2;                                 
  UINT8         CbsCmnSP3NtbStartLaneP0P2;                        
  UINT8         CbsCmnSP3NtbEndLaneP0P2;                          
  UINT8         CbsCmnSP3NtbLinkSpeedP0P2;                        
  UINT8         CbsCmnSP3NtbModeP0P2;                             
  UINT8         CbsCmnSocAblConOut;                               
  UINT8         CbsCmnSocAblConOutSerialPort;                     
  UINT8         CbsCmnSocAblConOutSerialPortIO;                   
  UINT8         CbsCmnSocAblSerialPortIOCustomEnabled;            
  UINT16        CbsCmnSocAblConOutSerialPortIOCustom;             
  UINT8         CbsCmnSocAblConOutBasic;                          
  UINT8         CbsCmnSocAblPmuMsgCtrl;                           
  UINT8         CbsCmnSocAblMemPopMsgCtrl;                        
  UINT8         CbsCmnPrintSocket1PmuMsgBlock;                    
  UINT8         CbsCmnPrintSocket1TrainingLog;                    
  UINT8         CbsDfCmnPspErrInj;                                
  UINT8         CbsNumberOfSockets;                               
  UINT8         CbsCmnSecI2cVoltMode;                             
  UINT8         CbsCmnSocFarEnforced;                             
  UINT32        CbsCmnSocSplFuse;                                 
  UINT32        CbsCmnSocSplValueInTbl;                           
  UINT8         CbsCmnSocFarSwitch;                               
  UINT8         CbsCmnCxlControl;                                 
  UINT8         CbsCmnCxlSdpReqSysAddr;                           
  UINT8         CbsCmnCxlSpm;                                     
  UINT8         CbsCmnCxlEncryption;                              
  UINT8         CbsCmnCxlDvsecLock;                               
  UINT8         CbsCmnCxlHdmDecoderLockOnCommit;                  
  UINT8         CbsCmnCxlTempGen5Advertisement;                   
  UINT8         CbsCmnSyncHeaderByPass;                           
  UINT8         CbsCxlSyncHeaderBypassCompMode;                   
  UINT8         CbsCmnCxlMemOnlineOffline;                        
  UINT8         CbsDbgCxlOverideCxlMemorySize;                    
  UINT8         CbsCmnCxlProtocolErrorReporting;                  
  UINT8         CbsCmnCxlComponentErrorReporting;                 
  UINT8         CbsCmnCxlMemIsolationEnable;                      
  UINT8         CbsCmnCxlMemIsolationFwNotification;              

  UINT8         Reserved[1024];                                   
} CBS_CONFIG;





#pragma pack(pop)


#line 865 "c:\\1-tpe_bios_code\\turin-a8isbios\\amdcbspkg\\build\\resourcebrh\\AmdCbsVariable.h"

#line 11 "c:\\1-tpe_bios_code\\turin-a8isbios\\AmdCbsPkg\\Build\\ResourceBRH\\AmdCbsForm.vfr"



formset
  guid      = { 0xB04535E3, 0x3004, 0x4946, {0x9E, 0xB7, 0x14, 0x94, 0x28, 0x98, 0x30, 0x53} },
  title     = STRING_TOKEN(0x0003),
  help      = STRING_TOKEN(0x0004),
  class     = 0x55, subclass = 0,

  varstore CBS_CONFIG,                        
    varid = 0x5000,    
    name  = AmdSetup,                         
    guid  = { 0x3A997502, 0x647A, 0x4c82, {0x99, 0x8E, 0x52, 0xEF, 0x94, 0x86, 0xA2, 0x47} };    
  
  
  
  form

    formid        = 0x7000,

    title         = STRING_TOKEN (0x0003);

    subtitle text = STRING_TOKEN (0x0003);
    subtitle text = STRING_TOKEN (0x0002);

    text
      help         = STRING_TOKEN (0x0002),
      text         = STRING_TOKEN (0x0005),
      text         = STRING_TOKEN (0x0006);
    subtitle text = STRING_TOKEN (0x0002);

    goto 0x7001,
      prompt      = STRING_TOKEN (0x0007),
      help        = STRING_TOKEN (0x0007);

    goto 0x7002,
      prompt      = STRING_TOKEN (0x0008),
      help        = STRING_TOKEN (0x0008);

    goto 0x7003,
      prompt      = STRING_TOKEN (0x0009),
      help        = STRING_TOKEN (0x0009);

    goto 0x7004,
      prompt      = STRING_TOKEN (0x000A),
      help        = STRING_TOKEN (0x000A);

    goto 0x7005,
      prompt      = STRING_TOKEN (0x000B),
      help        = STRING_TOKEN (0x000B);

    
    suppressif NOT ideqval CBS_CONFIG.CbsCmnSP3NtbP0P0 == 1;
      goto 0x7006,
        prompt      = STRING_TOKEN (0x000C),
        help        = STRING_TOKEN (0x000C);
    endif;

    goto 0x7007,
      prompt      = STRING_TOKEN (0x000D),
      help        = STRING_TOKEN (0x000D);

    goto 0x7008,
      prompt      = STRING_TOKEN (0x000E),
      help        = STRING_TOKEN (0x000E);

    
    suppressif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
      
      numeric
        varid       = CBS_CONFIG.CbsComboFlag,
        prompt      = STRING_TOKEN (0x000F),
        help        = STRING_TOKEN (0x0010),
        flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
        minimum     = 0x00,
        maximum     = 0xff,
        step        = 0,
        default     = 254,
      endnumeric;
    endif;

  endform;


    
    
    
    form

      formid        = 0x7001,

      title         = STRING_TOKEN (0x0007);

      subtitle text = STRING_TOKEN (0x0007);
      subtitle text = STRING_TOKEN (0x0002);

      goto 0x7009,
        prompt      = STRING_TOKEN (0x0011),
        help        = STRING_TOKEN (0x0011);

      text
        help        = STRING_TOKEN (0x0002),
        text        = STRING_TOKEN (0x0002);

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuRMSS,
        prompt      = STRING_TOKEN (0x0012),
        help        = STRING_TOKEN (0x0013),
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      goto 0x700A,
        prompt      = STRING_TOKEN (0x0016),
        help        = STRING_TOKEN (0x0016);

      goto 0x700B,
        prompt      = STRING_TOKEN (0x0017),
        help        = STRING_TOKEN (0x0017);

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuGenWA05,
        prompt      = STRING_TOKEN (0x0018),
        help        = STRING_TOKEN (0x0019),
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001B),               value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001C),               value = 0,    flags = 0 | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuPfeh,
        prompt      = STRING_TOKEN (0x001D),
        help        = STRING_TOKEN (0x001E),
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 3,    flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuCpb,
        prompt      = STRING_TOKEN (0x001F),
        help        = STRING_TOKEN (0x0020),
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 1,    flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuGlobalCstateCtrl,
        prompt      = STRING_TOKEN (0x0021),
        help        = STRING_TOKEN (0x0022),
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 3,    flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnGnbPowerSupplyIdleCtrl,
        prompt      = STRING_TOKEN (0x0023),
        help        = STRING_TOKEN (0x0024),
        option text = STRING_TOKEN (0x0025), value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0026), value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuStreamingStoresCtrl,
        prompt      = STRING_TOKEN (0x0027),
        help        = STRING_TOKEN (0x0028),
        option text = STRING_TOKEN (0x0014),        value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsDbgCpuLApicMode,
        prompt      = STRING_TOKEN (0x0029),
        help        = STRING_TOKEN (0x002A),
        option text = STRING_TOKEN (0x002B),           value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x002C),          value = 2,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuCstC1Ctrl,
        prompt      = STRING_TOKEN (0x002D),
        help        = STRING_TOKEN (0x002E),
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 3,    flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      numeric
        varid       = CBS_CONFIG.CbsCmnCpuCstC2Latency,
        prompt      = STRING_TOKEN (0x002F),
        help        = STRING_TOKEN (0x0030),
        flags       = RESET_REQUIRED,
        minimum     = 18,
        maximum     = 1000,
        step        = 0,
        default     = 100,
      endnumeric;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuMcaErrThreshEn,
        prompt      = STRING_TOKEN (0x0031),
        help        = STRING_TOKEN (0x0032),
        option text = STRING_TOKEN (0x0033),           value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0034),            value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuMcaErrThreshEn == 1;
        
        numeric
          varid       = CBS_CONFIG.CbsCmnCpuMcaErrThreshCount,
          prompt      = STRING_TOKEN (0x0035),
          help        = STRING_TOKEN (0x0036),
          flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
          minimum     = 0x0,
          maximum     = 0xFFE,
          step        = 0,
          default     = 0xC17,
        endnumeric;
      endif;

      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuMcaErrThreshEn == 1;
        
        numeric
          varid       = CBS_CONFIG.CbsCmnPCIeErrThreshCount,
          prompt      = STRING_TOKEN (0x0037),
          help        = STRING_TOKEN (0x0038),
          flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
          minimum     = 0x1,
          maximum     = 0x4E20,
          step        = 0,
          default     = 10000,
        endnumeric;
      endif;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuMcaFruTextEn,
        prompt      = STRING_TOKEN (0x0039),
        help        = STRING_TOKEN (0x003A),
        option text = STRING_TOKEN (0x0033),           value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0034),            value = 1,    flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      grayoutif NOT ideqval CBS_CONFIG.CbsCmnCpuScanDumpDbgEn == 0;
        
        oneof
          varid       = CBS_CONFIG.CbsCmnCpuSmuPspDebugMode,
          prompt      = STRING_TOKEN (0x003B),
          help        = STRING_TOKEN (0x003C),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 3,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;
      endif;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuPpinCtrl,
        prompt      = STRING_TOKEN (0x003D),
        help        = STRING_TOKEN (0x003E),
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      grayoutif NOT ideqval CBS_CONFIG.CbsCmnMemSmeMkEnable == 0;
        
        oneof
          varid       = CBS_CONFIG.CbsCmnCpuSmee,
          prompt      = STRING_TOKEN (0x003F),
          help        = STRING_TOKEN (0x0040),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 3,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;
      endif;

      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuSmee == 1;
        
        oneof
          varid       = CBS_CONFIG.CbsPspSevCtrl,
          prompt      = STRING_TOKEN (0x0043),
          help        = STRING_TOKEN (0x0044),
          option text = STRING_TOKEN (0x0015),          value = 0,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),         value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;
      endif;

      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuSmee == 1
              OR NOT ideqval CBS_CONFIG.CbsPspSevCtrl == 0;
        
        numeric
          varid       = CBS_CONFIG.CbsCmnCpuSevAsidSpaceLimit,
          questionid  = 0x700C,
          prompt      = STRING_TOKEN (0x0045),
          help        = STRING_TOKEN (0x0046),
          flags       = RESET_REQUIRED | INTERACTIVE,
          minimum     = 1,
          maximum     = 1007,
          step        = 0,
          default     = 1,
        endnumeric;
      endif;

      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuSmee == 1
              OR NOT ideqval CBS_CONFIG.CbsPspSevCtrl == 0;
        
        oneof
          varid       = CBS_CONFIG.CbsDbgCpuSnpMemCover,
          prompt      = STRING_TOKEN (0x0047),
          help        = STRING_TOKEN (0x0048),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0049),          value = 2,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;
      endif;

      
      suppressif NOT ideqval CBS_CONFIG.CbsDbgCpuSnpMemCover == 2;
        
        numeric
          varid       = CBS_CONFIG.CbsDbgCpuSnpMemSizeCover,
          prompt      = STRING_TOKEN (0x004A),
          help        = STRING_TOKEN (0x004B),
          flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
          minimum     = 0x10,
          maximum     = 0x100000,
          step        = 0,
          default     = 0x10,
        endnumeric;
      endif;

      
      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuSmee == 1
              OR NOT ideqval CBS_CONFIG.CbsPspSevCtrl == 0
              OR NOT ideqval CBS_CONFIG.CbsDbgCpuSnpMemCover == 1;
      grayoutif NOT ideqval CBS_CONFIG.CbsDbgCpuSnpMemCover == 1
            AND NOT ideqval CBS_CONFIG.CbsDbgCpuSnpMemCover == 2;
        
        oneof
          varid       = CBS_CONFIG.CbsCmnCpu64BitMMIOCoverage,
          prompt      = STRING_TOKEN (0x004C),
          help        = STRING_TOKEN (0x004D),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;
      endif;
      endif;

      
      
      suppressif NOT ideqval CBS_CONFIG.CbsDbgCpuSnpMemCover == 2;
      grayoutif NOT ideqval CBS_CONFIG.CbsDbgCpuSnpMemCover == 1
            AND NOT ideqval CBS_CONFIG.CbsDbgCpuSnpMemCover == 2;
        
        oneof
          varid       = CBS_CONFIG.CbsCmnCpu64BitMMIOCoverage,
          prompt      = STRING_TOKEN (0x004C),
          help        = STRING_TOKEN (0x004D),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;
      endif;
      endif;

      
      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnCpu64BitMMIOCoverage == 1;
      grayoutif NOT ideqval CBS_CONFIG.CbsDbgCpuSegmentedRMP == 1;
        
        numeric
          varid       = CBS_CONFIG.CbsCmnCpu64BitMMIORmpS0RBMask,
          prompt      = STRING_TOKEN (0x004E),
          help        = STRING_TOKEN (0x004F),
          flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
          minimum     = 0x01,
          maximum     = 0xFF,
          step        = 0,
          default     = 0x01,
        endnumeric;
      endif;
      endif;

      
      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnCpu64BitMMIOCoverage == 1
              OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
      grayoutif NOT ideqval CBS_CONFIG.CbsDbgCpuSegmentedRMP == 1;
        
        numeric
          varid       = CBS_CONFIG.CbsCmnCpu64BitMMIORmpS1RBMask,
          prompt      = STRING_TOKEN (0x0050),
          help        = STRING_TOKEN (0x0051),
          flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
          minimum     = 0x00,
          maximum     = 0xFF,
          step        = 0,
          default     = 0x00,
        endnumeric;
      endif;
      endif;

      
      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuSmee == 1
              OR NOT ideqval CBS_CONFIG.CbsPspSevCtrl == 0
              OR NOT ideqval CBS_CONFIG.CbsDbgCpuSnpMemCover == 1;
      grayoutif NOT ideqval CBS_CONFIG.CbsDbgCpuSegmentedRMP == 0
            AND NOT ideqval CBS_CONFIG.CbsDbgCpuSegmentedRMP == 0xFF;
        
        oneof
          varid       = CBS_CONFIG.CbsDbgCpuSplitRMP,
          prompt      = STRING_TOKEN (0x0052),
          help        = STRING_TOKEN (0x0053),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;
      endif;
      endif;

      
      
      suppressif NOT ideqval CBS_CONFIG.CbsDbgCpuSnpMemCover == 2;
      grayoutif NOT ideqval CBS_CONFIG.CbsDbgCpuSegmentedRMP == 0
            AND NOT ideqval CBS_CONFIG.CbsDbgCpuSegmentedRMP == 0xFF;
        
        oneof
          varid       = CBS_CONFIG.CbsDbgCpuSplitRMP,
          prompt      = STRING_TOKEN (0x0052),
          help        = STRING_TOKEN (0x0053),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;
      endif;
      endif;

      
      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuSmee == 1
              OR NOT ideqval CBS_CONFIG.CbsPspSevCtrl == 0
              OR NOT ideqval CBS_CONFIG.CbsDbgCpuSnpMemCover == 1;
      grayoutif NOT ideqval CBS_CONFIG.CbsDbgCpuSplitRMP == 0
            AND NOT ideqval CBS_CONFIG.CbsDbgCpuSplitRMP == 0xFF;
        
        oneof
          varid       = CBS_CONFIG.CbsDbgCpuSegmentedRMP,
          prompt      = STRING_TOKEN (0x0054),
          help        = STRING_TOKEN (0x0055),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;
      endif;
      endif;

      
      
      suppressif NOT ideqval CBS_CONFIG.CbsDbgCpuSnpMemCover == 2;
      grayoutif NOT ideqval CBS_CONFIG.CbsDbgCpuSplitRMP == 0
            AND NOT ideqval CBS_CONFIG.CbsDbgCpuSplitRMP == 0xFF;
        
        oneof
          varid       = CBS_CONFIG.CbsDbgCpuSegmentedRMP,
          prompt      = STRING_TOKEN (0x0054),
          help        = STRING_TOKEN (0x0055),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;
      endif;
      endif;

      
      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuSmee == 1
              OR NOT ideqval CBS_CONFIG.CbsPspSevCtrl == 0
              OR NOT ideqval CBS_CONFIG.CbsDbgCpuSnpMemCover == 1;
      grayoutif NOT ideqval CBS_CONFIG.CbsDbgCpuSegmentedRMP == 1
            AND NOT ideqval CBS_CONFIG.CbsDbgCpuSegmentedRMP == 0xFF;
        
        oneof
          varid       = CBS_CONFIG.CbsDbgCpuRmpSegmentSize,
          prompt      = STRING_TOKEN (0x0056),
          help        = STRING_TOKEN (0x0057),
          option text = STRING_TOKEN (0x0058),            value = 0x24, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0059),           value = 0x25, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x005A),           value = 0x26, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x005B),           value = 0x27, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x005C),          value = 0x28, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x005D),          value = 0x29, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x005E),          value = 0x2A, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;
      endif;
      endif;

      
      
      suppressif NOT ideqval CBS_CONFIG.CbsDbgCpuSnpMemCover == 2;
      grayoutif NOT ideqval CBS_CONFIG.CbsDbgCpuSegmentedRMP == 1
            AND NOT ideqval CBS_CONFIG.CbsDbgCpuSegmentedRMP == 0xFF;
        
        oneof
          varid       = CBS_CONFIG.CbsDbgCpuRmpSegmentSize,
          prompt      = STRING_TOKEN (0x0056),
          help        = STRING_TOKEN (0x0057),
          option text = STRING_TOKEN (0x0058),            value = 0x24, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0059),           value = 0x25, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x005A),           value = 0x26, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x005B),           value = 0x27, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x005C),          value = 0x28, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x005D),          value = 0x29, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x005E),          value = 0x2A, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;
      endif;
      endif;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnActionOnBistFailure,
        prompt      = STRING_TOKEN (0x005F),
        help        = STRING_TOKEN (0x0060),
        option text = STRING_TOKEN (0x0061),      value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0062),        value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuERMS,
        prompt      = STRING_TOKEN (0x0063),
        help        = STRING_TOKEN (0x0064),
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuLogTransparentErrors,
        prompt      = STRING_TOKEN (0x0065),
        help        = STRING_TOKEN (0x0066),
        option text = STRING_TOKEN (0x001A),            value = 3,    flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuAvx512,
        prompt      = STRING_TOKEN (0x0067),
        help        = STRING_TOKEN (0x0068),
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuDisFstStrErmsb,
        prompt      = STRING_TOKEN (0x0069),
        help        = STRING_TOKEN (0x006A),
        option text = STRING_TOKEN (0x0014),        value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      suppressif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
        
        oneof
          varid       = CBS_CONFIG.CbsCmnCpuMonMwaitDis,
          prompt      = STRING_TOKEN (0x006B),
          help        = STRING_TOKEN (0x006C),
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;
      endif;

      label 0x700E;
      
      oneof
        varid       = CBS_CONFIG.CbsCpuSpeculativeStoreModes,
        questionid  = 0x700D,
        prompt      = STRING_TOKEN (0x006D),
        help        = STRING_TOKEN (0x006E),
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
        option text = STRING_TOKEN (0x006F),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
        option text = STRING_TOKEN (0x0070), value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
        option text = STRING_TOKEN (0x0071), value = 2,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
      endoneof;
      label 0x700F;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuFSRM,
        prompt      = STRING_TOKEN (0x0072),
        help        = STRING_TOKEN (0x0073),
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuPauseCntSel_1_0,
        prompt      = STRING_TOKEN (0x0074),
        help        = STRING_TOKEN (0x0075),
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0076),       value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0077),       value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0078),       value = 2,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0079),      value = 3,    flags = 0 | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuPfReqThrEn,
        prompt      = STRING_TOKEN (0x007A),
        help        = STRING_TOKEN (0x007B),
        option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuPfeh == 0;
        
        oneof
          varid       = CBS_CONFIG.CbsCmnCmcNotificationType,
          prompt      = STRING_TOKEN (0x007C),
          help        = STRING_TOKEN (0x007D),
          option text = STRING_TOKEN (0x007E),          value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x007F),            value = 5,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;
      endif;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuScanDumpDbgEn,
        questionid  = 0x7010,
        prompt      = STRING_TOKEN (0x0080),
        help        = STRING_TOKEN (0x0081),
        option text = STRING_TOKEN (0x0014),         value = 0,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
        option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuMcax64BankSupport,
        prompt      = STRING_TOKEN (0x0082),
        help        = STRING_TOKEN (0x0083),
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuAdaptiveAlloc,
        prompt      = STRING_TOKEN (0x0084),
        help        = STRING_TOKEN (0x0085),
        option text = STRING_TOKEN (0x0015),         value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0014),        value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCpuLatencyUnderLoad,
        prompt      = STRING_TOKEN (0x0086),
        help        = STRING_TOKEN (0x0087),
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0014),        value = 1,    flags = 0 | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCoreTraceDumpEn,
        prompt      = STRING_TOKEN (0x0088),
        help        = STRING_TOKEN (0x0089),
        option text = STRING_TOKEN (0x0014),         value = 0,    flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuFP512,
        prompt      = STRING_TOKEN (0x008A),
        help        = STRING_TOKEN (0x008B),
        option text = STRING_TOKEN (0x0014),        value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCpuAmdErmsbRepo,
        prompt      = STRING_TOKEN (0x008C),
        help        = STRING_TOKEN (0x008D),
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
      endoneof;

    endform;
      
      
      
      form

        formid        = 0x7009,

        title         = STRING_TOKEN (0x0011);

        subtitle text = STRING_TOKEN (0x0011);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnCpuOcMode,
          questionid  = 0x7011,
          prompt      = STRING_TOKEN (0x008E),
          help        = STRING_TOKEN (0x008F),
          option text = STRING_TOKEN (0x0090), value = 0,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x0091),      value = 5,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
        endoneof;

        
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnCpuOcMode == 5;
          goto 0x7012,
            prompt      = STRING_TOKEN (0x0092),
            help        = STRING_TOKEN (0x0092);
        endif;

        label 0x7014;
        
        suppressif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnCpuDowncoreMode,
            questionid  = 0x7013,
            prompt      = STRING_TOKEN (0x0093),
            help        = STRING_TOKEN (0x0094),
            option text = STRING_TOKEN (0x0095), value = 0,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0096),          value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          endoneof;
        endif;
        label 0x7015;

        
        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 1;
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 1;
          goto 0x7016,
            prompt      = STRING_TOKEN (0x0097),
            help        = STRING_TOKEN (0x0097);
        endif;
        endif;

        
        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 0;
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 0;
          goto 0x7017,
            prompt      = STRING_TOKEN (0x0098),
            help        = STRING_TOKEN (0x0098);
        endif;
        endif;

        label 0x7019;
        
        oneof
          varid       = CBS_CONFIG.CbsCpuSmtCtrl,
          questionid  = 0x7018,
          prompt      = STRING_TOKEN (0x0099),
          help        = STRING_TOKEN (0x009A),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
        endoneof;
        label 0x701A;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuEnReqMinFreq == 1;
          
          numeric
            varid       = CBS_CONFIG.CbsCmnCpuReqMinFreq,
            prompt      = STRING_TOKEN (0x009B),
            help        = STRING_TOKEN (0x009C),
            flags       = RESET_REQUIRED,
            minimum     = 1200,
            maximum     = 0xFFFF,
            step        = 0,
            default     = 1800,
          endnumeric;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnCpuEnReqMinFreq,
          prompt      = STRING_TOKEN (0x009D),
          help        = STRING_TOKEN (0x009E),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;

      endform;
        
        
        
        form

          formid        = 0x7012,

          title         = STRING_TOKEN (0x0092);

          subtitle text = STRING_TOKEN (0x0092);
          subtitle text = STRING_TOKEN (0x0002);

          
          text
            help        = STRING_TOKEN (0x00A0),
            text        = STRING_TOKEN (0x009F);

          
          text
            help        = STRING_TOKEN (0x00A2),
            text        = STRING_TOKEN (0x00A1);

          goto 0x7009,
            prompt      = STRING_TOKEN (0x00A3),
            help        = STRING_TOKEN (0x00A3);

          goto 0x701C,
            prompt      = STRING_TOKEN (0x00A4),
            help        = STRING_TOKEN (0x00A4);

        endform;
          
          
          
          form

            formid        = 0x701B,

            title         = STRING_TOKEN (0x00A3);

            subtitle text = STRING_TOKEN (0x00A3);
            subtitle text = STRING_TOKEN (0x0002);

          endform;
          
          
          
          form

            formid        = 0x701C,

            title         = STRING_TOKEN (0x00A4);

            subtitle text = STRING_TOKEN (0x00A4);
            subtitle text = STRING_TOKEN (0x0002);

            
            grayoutif NOT ideqval CBS_CONFIG.CbsCmnCpuOcMode == 5;
              
              oneof
                varid       = CBS_CONFIG.CbsCpuPstCustomP0,
                questionid  = 0x701D,
                prompt      = STRING_TOKEN (0x00A5),
                help        = STRING_TOKEN (0x00A6),
                option text = STRING_TOKEN (0x0049),          value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
                option text = STRING_TOKEN (0x001A),            value = 2,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
              endoneof;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP0 == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsCmnCpuOcMode == 5;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuPst0Freq,
                prompt      = STRING_TOKEN (0x00A7),
                help        = STRING_TOKEN (0x00A8),
                flags       = RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFFFF,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
            grayoutif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP0 == 2;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuCofP0,
                prompt      = STRING_TOKEN (0x00A9),
                help        = STRING_TOKEN (0x00AA),
                flags       = RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xffffffff,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
            grayoutif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP0 == 2;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuVoltageP0,
                prompt      = STRING_TOKEN (0x00AB),
                help        = STRING_TOKEN (0x00AC),
                flags       = RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xffffffff,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
            grayoutif NOT ideqval CBS_CONFIG.CbsCmnCpuOcMode == 5;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuPst0Fid,
                questionid  = 0x701E,
                prompt      = STRING_TOKEN (0x00AD),
                help        = STRING_TOKEN (0x00AE),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0x10,
                maximum     = 0x7ff,
                step        = 0,
                default     = 16,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuPst0Vid,
                questionid  = 0x701F,
                prompt      = STRING_TOKEN (0x00AF),
                help        = STRING_TOKEN (0x00B0),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0x1ff,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
            grayoutif NOT ideqval CBS_CONFIG.CbsCmnCpuOcMode == 5;
              
              oneof
                varid       = CBS_CONFIG.CbsCpuPstCustomP1,
                questionid  = 0x7020,
                prompt      = STRING_TOKEN (0x00B1),
                help        = STRING_TOKEN (0x00B2),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
                option text = STRING_TOKEN (0x0049),          value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
                option text = STRING_TOKEN (0x001A),            value = 2,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
              endoneof;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP1 == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP1 == 2;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuCofP1,
                prompt      = STRING_TOKEN (0x00B3),
                help        = STRING_TOKEN (0x00AA),
                flags       = RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xffffffff,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP1 == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP1 == 2;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuVoltageP1,
                prompt      = STRING_TOKEN (0x00B4),
                help        = STRING_TOKEN (0x00AC),
                flags       = RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xffffffff,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP1 == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuPst1Fid,
                questionid  = 0x7021,
                prompt      = STRING_TOKEN (0x00B5),
                help        = STRING_TOKEN (0x00B6),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0x10,
                maximum     = 0xff,
                step        = 0,
                default     = 16,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP1 == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuPst1Vid,
                questionid  = 0x7022,
                prompt      = STRING_TOKEN (0x00B7),
                help        = STRING_TOKEN (0x00B8),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xff,
                step        = 0,
                default     = 255,
              endnumeric;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
            grayoutif NOT ideqval CBS_CONFIG.CbsCmnCpuOcMode == 5
                   OR NOT ideqval CBS_CONFIG.CbsCpuPstCustomP1 == 1
                  AND NOT ideqval CBS_CONFIG.CbsCpuPstCustomP1 == 2;
              
              oneof
                varid       = CBS_CONFIG.CbsCpuPstCustomP2,
                questionid  = 0x7023,
                prompt      = STRING_TOKEN (0x00B9),
                help        = STRING_TOKEN (0x00BA),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
                option text = STRING_TOKEN (0x0049),          value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
                option text = STRING_TOKEN (0x001A),            value = 2,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
              endoneof;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP2 == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP2 == 2;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuCofP2,
                prompt      = STRING_TOKEN (0x00BB),
                help        = STRING_TOKEN (0x00AA),
                flags       = RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xffffffff,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP2 == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP2 == 2;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuVoltageP2,
                prompt      = STRING_TOKEN (0x00BC),
                help        = STRING_TOKEN (0x00AC),
                flags       = RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xffffffff,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP2 == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuPst2Fid,
                questionid  = 0x7024,
                prompt      = STRING_TOKEN (0x00BD),
                help        = STRING_TOKEN (0x00BE),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0x10,
                maximum     = 0xff,
                step        = 0,
                default     = 16,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP2 == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuPst2Vid,
                questionid  = 0x7025,
                prompt      = STRING_TOKEN (0x00BF),
                help        = STRING_TOKEN (0x00C0),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xff,
                step        = 0,
                default     = 255,
              endnumeric;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
            grayoutif NOT ideqval CBS_CONFIG.CbsCmnCpuOcMode == 5
                   OR NOT ideqval CBS_CONFIG.CbsCpuPstCustomP2 == 1
                  AND NOT ideqval CBS_CONFIG.CbsCpuPstCustomP2 == 2;
              
              oneof
                varid       = CBS_CONFIG.CbsCpuPstCustomP3,
                questionid  = 0x7026,
                prompt      = STRING_TOKEN (0x00C1),
                help        = STRING_TOKEN (0x00C2),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
                option text = STRING_TOKEN (0x0049),          value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
                option text = STRING_TOKEN (0x001A),            value = 2,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
              endoneof;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP3 == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP3 == 2;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuCofP3,
                prompt      = STRING_TOKEN (0x00C3),
                help        = STRING_TOKEN (0x00AA),
                flags       = RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xffffffff,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP3 == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP3 == 2;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuVoltageP3,
                prompt      = STRING_TOKEN (0x00C4),
                help        = STRING_TOKEN (0x00AC),
                flags       = RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xffffffff,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP3 == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuPst3Fid,
                questionid  = 0x7027,
                prompt      = STRING_TOKEN (0x00C5),
                help        = STRING_TOKEN (0x00C6),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0x10,
                maximum     = 0xff,
                step        = 0,
                default     = 16,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP3 == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuPst3Vid,
                questionid  = 0x7028,
                prompt      = STRING_TOKEN (0x00C7),
                help        = STRING_TOKEN (0x00C8),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xff,
                step        = 0,
                default     = 255,
              endnumeric;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
            grayoutif NOT ideqval CBS_CONFIG.CbsCmnCpuOcMode == 5
                   OR NOT ideqval CBS_CONFIG.CbsCpuPstCustomP3 == 1
                  AND NOT ideqval CBS_CONFIG.CbsCpuPstCustomP3 == 2;
              
              oneof
                varid       = CBS_CONFIG.CbsCpuPstCustomP4,
                questionid  = 0x7029,
                prompt      = STRING_TOKEN (0x00C9),
                help        = STRING_TOKEN (0x00CA),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
                option text = STRING_TOKEN (0x0049),          value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
                option text = STRING_TOKEN (0x001A),            value = 2,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
              endoneof;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP4 == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP4 == 2;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuCofP4,
                prompt      = STRING_TOKEN (0x00CB),
                help        = STRING_TOKEN (0x00AA),
                flags       = RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xffffffff,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP4 == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP4 == 2;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuVoltageP4,
                prompt      = STRING_TOKEN (0x00CC),
                help        = STRING_TOKEN (0x00AC),
                flags       = RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xffffffff,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP4 == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuPst4Fid,
                questionid  = 0x702A,
                prompt      = STRING_TOKEN (0x00CD),
                help        = STRING_TOKEN (0x00CE),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0x10,
                maximum     = 0xff,
                step        = 0,
                default     = 16,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP4 == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuPst4Vid,
                questionid  = 0x702B,
                prompt      = STRING_TOKEN (0x00CF),
                help        = STRING_TOKEN (0x00D0),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xff,
                step        = 0,
                default     = 255,
              endnumeric;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
            grayoutif NOT ideqval CBS_CONFIG.CbsCmnCpuOcMode == 5
                   OR NOT ideqval CBS_CONFIG.CbsCpuPstCustomP4 == 1
                  AND NOT ideqval CBS_CONFIG.CbsCpuPstCustomP4 == 2;
              
              oneof
                varid       = CBS_CONFIG.CbsCpuPstCustomP5,
                questionid  = 0x702C,
                prompt      = STRING_TOKEN (0x00D1),
                help        = STRING_TOKEN (0x00D2),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
                option text = STRING_TOKEN (0x0049),          value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
                option text = STRING_TOKEN (0x001A),            value = 2,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
              endoneof;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP5 == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP5 == 2;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuCofP5,
                prompt      = STRING_TOKEN (0x00D3),
                help        = STRING_TOKEN (0x00AA),
                flags       = RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xffffffff,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP5 == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP5 == 2;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuVoltageP5,
                prompt      = STRING_TOKEN (0x00D4),
                help        = STRING_TOKEN (0x00AC),
                flags       = RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xffffffff,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP5 == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuPst5Fid,
                questionid  = 0x702D,
                prompt      = STRING_TOKEN (0x00D5),
                help        = STRING_TOKEN (0x00D6),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0x10,
                maximum     = 0xff,
                step        = 0,
                default     = 16,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP5 == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuPst5Vid,
                questionid  = 0x702E,
                prompt      = STRING_TOKEN (0x00D7),
                help        = STRING_TOKEN (0x00D8),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xff,
                step        = 0,
                default     = 255,
              endnumeric;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
            grayoutif NOT ideqval CBS_CONFIG.CbsCmnCpuOcMode == 5
                   OR NOT ideqval CBS_CONFIG.CbsCpuPstCustomP5 == 1
                  AND NOT ideqval CBS_CONFIG.CbsCpuPstCustomP5 == 2;
              
              oneof
                varid       = CBS_CONFIG.CbsCpuPstCustomP6,
                questionid  = 0x702F,
                prompt      = STRING_TOKEN (0x00D9),
                help        = STRING_TOKEN (0x00DA),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
                option text = STRING_TOKEN (0x0049),          value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
                option text = STRING_TOKEN (0x001A),            value = 2,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
              endoneof;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP6 == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP6 == 2;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuCofP6,
                prompt      = STRING_TOKEN (0x00DB),
                help        = STRING_TOKEN (0x00AA),
                flags       = RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xffffffff,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP6 == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP6 == 2;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuVoltageP6,
                prompt      = STRING_TOKEN (0x00DC),
                help        = STRING_TOKEN (0x00AC),
                flags       = RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xffffffff,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP6 == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuPst6Fid,
                questionid  = 0x7030,
                prompt      = STRING_TOKEN (0x00DD),
                help        = STRING_TOKEN (0x00DE),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0x10,
                maximum     = 0xff,
                step        = 0,
                default     = 16,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP6 == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuPst6Vid,
                questionid  = 0x7031,
                prompt      = STRING_TOKEN (0x00DF),
                help        = STRING_TOKEN (0x00E0),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xff,
                step        = 0,
                default     = 255,
              endnumeric;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
            grayoutif NOT ideqval CBS_CONFIG.CbsCmnCpuOcMode == 5
                   OR NOT ideqval CBS_CONFIG.CbsCpuPstCustomP6 == 1
                  AND NOT ideqval CBS_CONFIG.CbsCpuPstCustomP6 == 2;
              
              oneof
                varid       = CBS_CONFIG.CbsCpuPstCustomP7,
                questionid  = 0x7032,
                prompt      = STRING_TOKEN (0x00E1),
                help        = STRING_TOKEN (0x00E2),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
                option text = STRING_TOKEN (0x0049),          value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
                option text = STRING_TOKEN (0x001A),            value = 2,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
              endoneof;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP7 == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP7 == 2;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuCofP7,
                prompt      = STRING_TOKEN (0x00E3),
                help        = STRING_TOKEN (0x00AA),
                flags       = RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xffffffff,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP7 == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP7 == 2;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuVoltageP7,
                prompt      = STRING_TOKEN (0x00E4),
                help        = STRING_TOKEN (0x00AC),
                flags       = RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xffffffff,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP7 == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuPst7Fid,
                questionid  = 0x7033,
                prompt      = STRING_TOKEN (0x00E5),
                help        = STRING_TOKEN (0x00E6),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0x10,
                maximum     = 0xff,
                step        = 0,
                default     = 16,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCpuPstCustomP7 == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCpuPst7Vid,
                questionid  = 0x7034,
                prompt      = STRING_TOKEN (0x00E7),
                help        = STRING_TOKEN (0x00E8),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xff,
                step        = 0,
                default     = 255,
              endnumeric;
            endif;

          endform;
        
        
        
        form

          formid        = 0x7016,

          title         = STRING_TOKEN (0x0097);

          subtitle text = STRING_TOKEN (0x0097);
          subtitle text = STRING_TOKEN (0x0002);

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnCpuCcd0DowncoreBitMap,
              questionid  = 0x7035,
              prompt      = STRING_TOKEN (0x00E9),
              help        = STRING_TOKEN (0x00EA),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
              minimum     = 0,
              maximum     = 0xffffffff,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnCpuCcd1DowncoreBitMap,
              questionid  = 0x7036,
              prompt      = STRING_TOKEN (0x00EB),
              help        = STRING_TOKEN (0x00EC),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
              minimum     = 0,
              maximum     = 0xffffffff,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnCpuCcd2DowncoreBitMap,
              questionid  = 0x7037,
              prompt      = STRING_TOKEN (0x00ED),
              help        = STRING_TOKEN (0x00EE),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
              minimum     = 0,
              maximum     = 0xffffffff,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnCpuCcd3DowncoreBitMap,
              questionid  = 0x7038,
              prompt      = STRING_TOKEN (0x00EF),
              help        = STRING_TOKEN (0x00F0),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
              minimum     = 0,
              maximum     = 0xffffffff,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnCpuCcd4DowncoreBitMap,
              questionid  = 0x7039,
              prompt      = STRING_TOKEN (0x00F1),
              help        = STRING_TOKEN (0x00F2),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
              minimum     = 0,
              maximum     = 0xffffffff,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnCpuCcd5DowncoreBitMap,
              questionid  = 0x703A,
              prompt      = STRING_TOKEN (0x00F3),
              help        = STRING_TOKEN (0x00F4),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
              minimum     = 0,
              maximum     = 0xffffffff,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnCpuCcd6DowncoreBitMap,
              questionid  = 0x703B,
              prompt      = STRING_TOKEN (0x00F5),
              help        = STRING_TOKEN (0x00F6),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
              minimum     = 0,
              maximum     = 0xffffffff,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnCpuCcd7DowncoreBitMap,
              questionid  = 0x703C,
              prompt      = STRING_TOKEN (0x00F7),
              help        = STRING_TOKEN (0x00F8),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
              minimum     = 0,
              maximum     = 0xffffffff,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnCpuCcd8DowncoreBitMap,
              questionid  = 0x703D,
              prompt      = STRING_TOKEN (0x00F9),
              help        = STRING_TOKEN (0x00FA),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
              minimum     = 0,
              maximum     = 0xffffffff,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnCpuCcd9DowncoreBitMap,
              questionid  = 0x703E,
              prompt      = STRING_TOKEN (0x00FB),
              help        = STRING_TOKEN (0x00FC),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
              minimum     = 0,
              maximum     = 0xffffffff,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnCpuCcd10DowncoreBitMap,
              questionid  = 0x703F,
              prompt      = STRING_TOKEN (0x00FD),
              help        = STRING_TOKEN (0x00FE),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
              minimum     = 0,
              maximum     = 0xffffffff,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnCpuCcd11DowncoreBitMap,
              questionid  = 0x7040,
              prompt      = STRING_TOKEN (0x00FF),
              help        = STRING_TOKEN (0x0100),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
              minimum     = 0,
              maximum     = 0xffffffff,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnCpuCcd12DowncoreBitMap,
              questionid  = 0x7041,
              prompt      = STRING_TOKEN (0x0101),
              help        = STRING_TOKEN (0x0102),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
              minimum     = 0,
              maximum     = 0xffffffff,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnCpuCcd13DowncoreBitMap,
              questionid  = 0x7042,
              prompt      = STRING_TOKEN (0x0103),
              help        = STRING_TOKEN (0x0104),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
              minimum     = 0,
              maximum     = 0xffffffff,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnCpuCcd14DowncoreBitMap,
              questionid  = 0x7043,
              prompt      = STRING_TOKEN (0x0105),
              help        = STRING_TOKEN (0x0106),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
              minimum     = 0,
              maximum     = 0xffffffff,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnCpuCcd15DowncoreBitMap,
              questionid  = 0x7044,
              prompt      = STRING_TOKEN (0x0107),
              help        = STRING_TOKEN (0x0108),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
              minimum     = 0,
              maximum     = 0xffffffff,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

        endform;
        
        
        
        form

          formid        = 0x7017,

          title         = STRING_TOKEN (0x0098);

          subtitle text = STRING_TOKEN (0x0098);
          subtitle text = STRING_TOKEN (0x0002);

          label 0x7046;
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsCpuCcdCtrl,
              questionid  = 0x7045,
              prompt      = STRING_TOKEN (0x0109),
              help        = STRING_TOKEN (0x010A),
              option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x010B),          value = 2,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x010C),          value = 4,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x010D),          value = 6,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x010E),          value = 8,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x010F),         value = 10,   flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x0110),         value = 12,   flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x0111),         value = 14,   flags = 0 | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;
          label 0x7047;

          label 0x7049;
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnCpuDowncoreMode == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsCpuCoreCtrl,
              questionid  = 0x7048,
              prompt      = STRING_TOKEN (0x0112),
              help        = STRING_TOKEN (0x0113),
              option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x0114),         value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x0115),         value = 3,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x0116),       value = 4,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x0117),        value = 6,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x0118),        value = 8,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x0119),         value = 9,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x011A),       value = 10,   flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x011B),       value = 16,   flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x011C),        value = 17,   flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x011D),        value = 18,   flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x011E),     value = 19,   flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x011F),     value = 20,   flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x0120),   value = 21,   flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x0121),   value = 22,   flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x0122),    value = 23,   flags = 0 | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;
          label 0x704A;

        endform;
      
      
      
      form

        formid        = 0x700A,

        title         = STRING_TOKEN (0x0016);

        subtitle text = STRING_TOKEN (0x0016);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnCpuL1StreamHwPrefetcher,
          prompt      = STRING_TOKEN (0x0123),
          help        = STRING_TOKEN (0x0124),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 3,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnCpuL1StridePrefetcher,
          prompt      = STRING_TOKEN (0x0125),
          help        = STRING_TOKEN (0x0126),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 3,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnCpuL1RegionPrefetcher,
          prompt      = STRING_TOKEN (0x0127),
          help        = STRING_TOKEN (0x0128),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 3,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnCpuL2StreamHwPrefetcher,
          prompt      = STRING_TOKEN (0x0129),
          help        = STRING_TOKEN (0x012A),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 3,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnCpuL2UpDownPrefetcher,
          prompt      = STRING_TOKEN (0x012B),
          help        = STRING_TOKEN (0x012C),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 3,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnCpuL1BurstPrefetchMode,
          prompt      = STRING_TOKEN (0x012D),
          help        = STRING_TOKEN (0x012E),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 3,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

      endform;
      
      
      
      form

        formid        = 0x700B,

        title         = STRING_TOKEN (0x0017);

        subtitle text = STRING_TOKEN (0x0017);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsDbgCpuGenCpuWdt,
          questionid  = 0x704B,
          prompt      = STRING_TOKEN (0x012F),
          help        = STRING_TOKEN (0x0130),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x001A),            value = 3,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsDbgCpuGenCpuWdt == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsDbgCpuGenCpuWdtTimeout,
            prompt      = STRING_TOKEN (0x0131),
            help        = STRING_TOKEN (0x0132),
            option text = STRING_TOKEN (0x0133),      value = 0x100, flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0134),      value = 0x200, flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0135),    value = 0x300, flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0136),    value = 0x400, flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0137),    value = 0x500, flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0138),     value = 0x600, flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0139),     value = 0x700, flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x013A),    value = 0x901, flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x013B),    value = 0x801, flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x013C),     value = 0x001, flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x013D),     value = 0x101, flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x013E),     value = 0x201, flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x013F),    value = 0x301, flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0140),     value = 0x401, flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0141),    value = 0x501, flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0142),     value = 0x601, flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0143),     value = 0x701, flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xFFFF, flags = DEFAULT | RESET_REQUIRED;
          endoneof;
        endif;

      endform;
    
    
    
    form

      formid        = 0x7002,

      title         = STRING_TOKEN (0x0008);

      subtitle text = STRING_TOKEN (0x0008);
      subtitle text = STRING_TOKEN (0x0002);

      goto 0x704C,
        prompt      = STRING_TOKEN (0x0144),
        help        = STRING_TOKEN (0x0144);

      goto 0x704D,
        prompt      = STRING_TOKEN (0x0145),
        help        = STRING_TOKEN (0x0145);

      goto 0x704E,
        prompt      = STRING_TOKEN (0x0146),
        help        = STRING_TOKEN (0x0146);

      goto 0x704F,
        prompt      = STRING_TOKEN (0x0147),
        help        = STRING_TOKEN (0x0147);

      goto 0x7050,
        prompt      = STRING_TOKEN (0x0148),
        help        = STRING_TOKEN (0x0148);

      text
        help        = STRING_TOKEN (0x0002),
        text        = STRING_TOKEN (0x0002);

      
      oneof
        varid       = CBS_CONFIG.CbsDfCmnWdtInterval,
        prompt      = STRING_TOKEN (0x0149),
        help        = STRING_TOKEN (0x014A),
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x014B),           value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x014C),          value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x014D),          value = 2,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x014E),          value = 3,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x014F), value = 4,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0150), value = 5,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0151), value = 6,    flags = 0 | RESET_REQUIRED;
      endoneof;

      
      grayoutif NOT ideqval CBS_CONFIG.CbsCmnCpuScanDumpDbgEn == 0;
        
        oneof
          varid       = CBS_CONFIG.CbsDfCmnExtIpSyncFloodProp,
          prompt      = STRING_TOKEN (0x0152),
          help        = STRING_TOKEN (0x0153),
          option text = STRING_TOKEN (0x0154), value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0155), value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;
      endif;

      
      oneof
        varid       = CBS_CONFIG.CbsDfCmnDisSyncFloodProp,
        prompt      = STRING_TOKEN (0x0156),
        help        = STRING_TOKEN (0x0157),
        option text = STRING_TOKEN (0x0154), value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0155), value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsDfCmnFreezeQueueError,
        prompt      = STRING_TOKEN (0x0158),
        help        = STRING_TOKEN (0x0159),
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 3,    flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsDfCmnCc6MemEncryption,
        prompt      = STRING_TOKEN (0x015A),
        help        = STRING_TOKEN (0x015B),
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 3,    flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsDfCmnCcdBwThrottleLv,
        prompt      = STRING_TOKEN (0x015C),
        help        = STRING_TOKEN (0x015D),
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x015E),         value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x015F),         value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0160),         value = 2,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0161),         value = 3,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0162),         value = 4,    flags = 0 | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsDfDbgNumPciSegments,
        prompt      = STRING_TOKEN (0x0163),
        help        = STRING_TOKEN (0x0164),
        option text = STRING_TOKEN (0x0165),       value = 0x10000000, flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0166),      value = 0x20000000, flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0167),      value = 0x40000000, flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xFFFFFFFF, flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsDfCmnCcmThrot,
        prompt      = STRING_TOKEN (0x0168),
        help        = STRING_TOKEN (0x0169),
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
      endoneof;

      
      
      suppressif NOT ideqval CBS_CONFIG.CbsDfCmnCcmThrot == 1;
      grayoutif NOT ideqval CBS_CONFIG.CbsDfCmnCcmThrot == 1;
        
        numeric
          varid       = CBS_CONFIG.CbsDfCmnFineThrotHeavy,
          prompt      = STRING_TOKEN (0x016A),
          help        = STRING_TOKEN (0x016B),
          flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
          minimum     = 0,
          maximum     = 0x1F,
          step        = 0,
          default     = 0,
        endnumeric;
      endif;
      endif;

      
      
      suppressif NOT ideqval CBS_CONFIG.CbsDfCmnCcmThrot == 1;
      grayoutif NOT ideqval CBS_CONFIG.CbsDfCmnCcmThrot == 1;
        
        numeric
          varid       = CBS_CONFIG.CbsDfCmnFineThrotLight,
          prompt      = STRING_TOKEN (0x016C),
          help        = STRING_TOKEN (0x016D),
          flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
          minimum     = 0,
          maximum     = 0x1F,
          step        = 0,
          default     = 0,
        endnumeric;
      endif;
      endif;

      
      oneof
        varid       = CBS_CONFIG.CbsDfCmnCleanVicFtiCmdBal,
        prompt      = STRING_TOKEN (0x016E),
        help        = STRING_TOKEN (0x016F),
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      
      suppressif NOT ideqval CBS_CONFIG.CbsDfCmnCleanVicFtiCmdBal == 1;
      grayoutif NOT ideqval CBS_CONFIG.CbsDfCmnCleanVicFtiCmdBal == 1;
        
        oneof
          varid       = CBS_CONFIG.CbsDfCmnReqvReqNDImbThr,
          prompt      = STRING_TOKEN (0x0170),
          help        = STRING_TOKEN (0x0171),
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0172),              value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0173),              value = 2,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0174),              value = 3,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0175),              value = 4,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0176),              value = 5,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0177),              value = 6,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0178),              value = 7,    flags = 0 | RESET_REQUIRED;
        endoneof;
      endif;
      endif;

      
      oneof
        varid       = CBS_CONFIG.CbsDfCmnCxlStronglyOrderedWrites,
        prompt      = STRING_TOKEN (0x0179),
        help        = STRING_TOKEN (0x017A),
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x017B),   value = 1,    flags = 0 | RESET_REQUIRED;
      endoneof;

    endform;
      
      
      
      form

        formid        = 0x704C,

        title         = STRING_TOKEN (0x0144);

        subtitle text = STRING_TOKEN (0x0144);
        subtitle text = STRING_TOKEN (0x0002);

        label 0x7052;
        
        oneof
          varid       = CBS_CONFIG.CbsDfCmnDramNps,
          questionid  = 0x7051,
          prompt      = STRING_TOKEN (0x017C),
          help        = STRING_TOKEN (0x017D),
          option text = STRING_TOKEN (0x017E),            value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x017F),            value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x0180),            value = 2,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x0181),            value = 3,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x001A),            value = 7,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
        endoneof;
        label 0x7053;

        
        oneof
          varid       = CBS_CONFIG.CbsDfCmnMemIntlv,
          questionid  = 0x7054,
          prompt      = STRING_TOKEN (0x0182),
          help        = STRING_TOKEN (0x0183),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x001A),            value = 7,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsDfCmnMixedInterleavedMode,
          prompt      = STRING_TOKEN (0x0184),
          help        = STRING_TOKEN (0x0185),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnCxlMemOnlineOffline == 0;
          
          oneof
            varid       = CBS_CONFIG.CbsDfCmnCxlMemIntlv,
            questionid  = 0x7055,
            prompt      = STRING_TOKEN (0x0186),
            help        = STRING_TOKEN (0x0187),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;
        endif;

        
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnCxlMemOnlineOffline == 0;
          
          oneof
            varid       = CBS_CONFIG.CbsDfCnliSublinkInterleaving,
            prompt      = STRING_TOKEN (0x0188),
            help        = STRING_TOKEN (0x0189),
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          endoneof;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsDfCmnDramMapInversion,
          prompt      = STRING_TOKEN (0x018A),
          help        = STRING_TOKEN (0x018B),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 3,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        label 0x7057;
        
        oneof
          varid       = CBS_CONFIG.CbsDfCmnCc6AllocationScheme,
          questionid  = 0x7056,
          prompt      = STRING_TOKEN (0x018C),
          help        = STRING_TOKEN (0x018D),
          option text = STRING_TOKEN (0x018E),     value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x018F),    value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x0190), value = 2,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
        endoneof;
        label 0x7058;

      endform;
      
      
      
      form

        formid        = 0x704D,

        title         = STRING_TOKEN (0x0145);

        subtitle text = STRING_TOKEN (0x0145);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsDfCmnAcpiSratL3Numa,
          prompt      = STRING_TOKEN (0x0191),
          help        = STRING_TOKEN (0x0192),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 255,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsDfCmnAcpiSlitDistCtrl,
          prompt      = STRING_TOKEN (0x0193),
          help        = STRING_TOKEN (0x0194),
          option text = STRING_TOKEN (0x0195),          value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsDfCmnAcpiSlitDistCtrl == 0xFF;
          
          oneof
            varid       = CBS_CONFIG.CbsDfCmnAcpiSlitRemoteFar,
            prompt      = STRING_TOKEN (0x0196),
            help        = STRING_TOKEN (0x0197),
            option text = STRING_TOKEN (0x0198),            value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0199),             value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 255,  flags = DEFAULT | RESET_REQUIRED;
          endoneof;
        endif;

        
        suppressif NOT ideqval CBS_CONFIG.CbsDfCmnAcpiSlitDistCtrl == 0
                OR NOT ideqval CBS_CONFIG.CbsDfCmnAcpiSratL3Numa == 1;
          
          numeric
            varid       = CBS_CONFIG.CbsDfCmnAcpiSlitVirtualDist,
            prompt      = STRING_TOKEN (0x019A),
            help        = STRING_TOKEN (0x019B),
            flags       = RESET_REQUIRED,
            minimum     = 10,
            maximum     = 255,
            step        = 0,
            default     = 11,
          endnumeric;
        endif;

        
        suppressif NOT ideqval CBS_CONFIG.CbsDfCmnAcpiSlitDistCtrl == 0;
          
          numeric
            varid       = CBS_CONFIG.CbsDfCmnAcpiSlitLclDist,
            prompt      = STRING_TOKEN (0x019C),
            help        = STRING_TOKEN (0x019D),
            flags       = RESET_REQUIRED,
            minimum     = 10,
            maximum     = 255,
            step        = 0,
            default     = 12,
          endnumeric;
        endif;

        
        suppressif NOT ideqval CBS_CONFIG.CbsDfCmnAcpiSlitDistCtrl == 0;
          
          numeric
            varid       = CBS_CONFIG.CbsDfCmnAcpiSlitRmtDist,
            prompt      = STRING_TOKEN (0x019E),
            help        = STRING_TOKEN (0x019F),
            flags       = RESET_REQUIRED,
            minimum     = 10,
            maximum     = 255,
            step        = 0,
            default     = 32,
          endnumeric;
        endif;

        
        suppressif NOT ideqval CBS_CONFIG.CbsDfCmnAcpiSlitDistCtrl == 0;
          
          numeric
            varid       = CBS_CONFIG.CbsDfCmnAcpiSlitCxlLcl,
            prompt      = STRING_TOKEN (0x01A0),
            help        = STRING_TOKEN (0x01A1),
            flags       = RESET_REQUIRED,
            minimum     = 10,
            maximum     = 255,
            step        = 0,
            default     = 50,
          endnumeric;
        endif;

        
        suppressif NOT ideqval CBS_CONFIG.CbsDfCmnAcpiSlitDistCtrl == 0;
          
          numeric
            varid       = CBS_CONFIG.CbsDfCmnAcpiSlitCxlRmt,
            prompt      = STRING_TOKEN (0x01A2),
            help        = STRING_TOKEN (0x01A3),
            flags       = RESET_REQUIRED,
            minimum     = 10,
            maximum     = 255,
            step        = 0,
            default     = 60,
          endnumeric;
        endif;

      endform;
      
      
      
      form

        formid        = 0x704E,

        title         = STRING_TOKEN (0x0146);

        subtitle text = STRING_TOKEN (0x0146);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsDfCmnGmiEncryption,
          prompt      = STRING_TOKEN (0x01A4),
          help        = STRING_TOKEN (0x01A5),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 3,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsDfCmnXGmiEncryption,
          prompt      = STRING_TOKEN (0x01A6),
          help        = STRING_TOKEN (0x01A7),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 3,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsDfDbgXgmiLinkCfg,
          prompt      = STRING_TOKEN (0x01A8),
          help        = STRING_TOKEN (0x01A9),
          option text = STRING_TOKEN (0x001A),            value = 3,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x01AA),    value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x01AB),    value = 2,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x01AC), value = 4,    flags = 0 | RESET_REQUIRED;
        endoneof;

        label 0x705A;
        
        oneof
          varid       = CBS_CONFIG.CbsDfCmn4LinkMaxXgmiSpeed,
          questionid  = 0x7059,
          prompt      = STRING_TOKEN (0x01AD),
          help        = STRING_TOKEN (0x01AE),
          option text = STRING_TOKEN (0x01AF),          value = 14,   flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x01B0),          value = 19,   flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x01B1),          value = 26,   flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
        endoneof;
        label 0x705B;

        label 0x705D;
        
        oneof
          varid       = CBS_CONFIG.CbsDfCmn3LinkMaxXgmiSpeed,
          questionid  = 0x705C,
          prompt      = STRING_TOKEN (0x01B2),
          help        = STRING_TOKEN (0x01B3),
          option text = STRING_TOKEN (0x01AF),          value = 14,   flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x01B0),          value = 19,   flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x01B1),          value = 26,   flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
        endoneof;
        label 0x705E;

        
        numeric
          varid       = CBS_CONFIG.CbsDfXgmiCrcScale,
          prompt      = STRING_TOKEN (0x01B4),
          help        = STRING_TOKEN (0x01B5),
          flags       = RESET_REQUIRED,
          minimum     = 0,
          maximum     = 21,
          step        = 0,
          default     = 7,
        endnumeric;

        
        numeric
          varid       = CBS_CONFIG.CbsDfXgmiCrcThreshold,
          prompt      = STRING_TOKEN (0x01B6),
          help        = STRING_TOKEN (0x01B7),
          flags       = RESET_REQUIRED,
          minimum     = 0,
          maximum     = 255,
          step        = 0,
          default     = 25,
        endnumeric;

        
        oneof
          varid       = CBS_CONFIG.CbsDfXgmiPresetControl,
          questionid  = 0x705F,
          prompt      = STRING_TOKEN (0x01B8),
          help        = STRING_TOKEN (0x01B9),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = 0 | RESET_REQUIRED | INTERACTIVE;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
          goto 0x7060,
            prompt      = STRING_TOKEN (0x01BA),
            help        = STRING_TOKEN (0x01BA);
        endif;

        
        suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
          goto 0x7061,
            prompt      = STRING_TOKEN (0x01BB),
            help        = STRING_TOKEN (0x01BB);
        endif;

        
        suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
          goto 0x7062,
            prompt      = STRING_TOKEN (0x01BC),
            help        = STRING_TOKEN (0x01BC);
        endif;

        goto 0x7063,
          prompt      = STRING_TOKEN (0x01BD),
          help        = STRING_TOKEN (0x01BD);

        goto 0x7064,
          prompt      = STRING_TOKEN (0x01BE),
          help        = STRING_TOKEN (0x01BE);

        
        oneof
          varid       = CBS_CONFIG.CbsDfXgmiTrainingErrMask,
          prompt      = STRING_TOKEN (0x01BF),
          help        = STRING_TOKEN (0x01C0),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

      endform;
        
        
        
        form

          formid        = 0x7060,

          title         = STRING_TOKEN (0x01BA);

          subtitle text = STRING_TOKEN (0x01BA);
          subtitle text = STRING_TOKEN (0x0002);

          goto 0x7065,
            prompt      = STRING_TOKEN (0x01C1),
            help        = STRING_TOKEN (0x01C1);

          goto 0x7066,
            prompt      = STRING_TOKEN (0x01C2),
            help        = STRING_TOKEN (0x01C2);

          goto 0x7067,
            prompt      = STRING_TOKEN (0x01C3),
            help        = STRING_TOKEN (0x01C3);

          goto 0x7068,
            prompt      = STRING_TOKEN (0x01C4),
            help        = STRING_TOKEN (0x01C4);

          goto 0x7069,
            prompt      = STRING_TOKEN (0x01C5),
            help        = STRING_TOKEN (0x01C5);

        endform;
          
          
          
          form

            formid        = 0x7065,

            title         = STRING_TOKEN (0x01C1);

            subtitle text = STRING_TOKEN (0x01C1);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiPresetP11,
                prompt      = STRING_TOKEN (0x01C6),
                help        = STRING_TOKEN (0x01C7),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFF,
                step        = 0,
                default     = 0x3000,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiCmn1P11,
                questionid  = 0x706A,
                prompt      = STRING_TOKEN (0x01C8),
                help        = STRING_TOKEN (0x01C9),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFF,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiCnP11,
                questionid  = 0x706B,
                prompt      = STRING_TOKEN (0x01CA),
                help        = STRING_TOKEN (0x01CB),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFF,
                step        = 0,
                default     = 0x30,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiCnp1P11,
                questionid  = 0x706C,
                prompt      = STRING_TOKEN (0x01CC),
                help        = STRING_TOKEN (0x01CD),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFF,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;

          endform;
          
          
          
          form

            formid        = 0x7066,

            title         = STRING_TOKEN (0x01C2);

            subtitle text = STRING_TOKEN (0x01C2);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiPresetP12,
                prompt      = STRING_TOKEN (0x01CE),
                help        = STRING_TOKEN (0x01CF),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFF,
                step        = 0,
                default     = 0x3000,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiCmn1P12,
                questionid  = 0x706D,
                prompt      = STRING_TOKEN (0x01D0),
                help        = STRING_TOKEN (0x01D1),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFF,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiCnP12,
                questionid  = 0x706E,
                prompt      = STRING_TOKEN (0x01D2),
                help        = STRING_TOKEN (0x01D3),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFF,
                step        = 0,
                default     = 0x30,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiCnp1P12,
                questionid  = 0x706F,
                prompt      = STRING_TOKEN (0x01D4),
                help        = STRING_TOKEN (0x01D5),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFF,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;

          endform;
          
          
          
          form

            formid        = 0x7067,

            title         = STRING_TOKEN (0x01C3);

            subtitle text = STRING_TOKEN (0x01C3);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiPresetP13,
                prompt      = STRING_TOKEN (0x01D6),
                help        = STRING_TOKEN (0x01D7),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFF,
                step        = 0,
                default     = 0x3000,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiCmn1P13,
                questionid  = 0x7070,
                prompt      = STRING_TOKEN (0x01D8),
                help        = STRING_TOKEN (0x01D9),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFF,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiCnP13,
                questionid  = 0x7071,
                prompt      = STRING_TOKEN (0x01DA),
                help        = STRING_TOKEN (0x01DB),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFF,
                step        = 0,
                default     = 0x30,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiCnp1P13,
                questionid  = 0x7072,
                prompt      = STRING_TOKEN (0x01DC),
                help        = STRING_TOKEN (0x01DD),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFF,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;

          endform;
          
          
          
          form

            formid        = 0x7068,

            title         = STRING_TOKEN (0x01C4);

            subtitle text = STRING_TOKEN (0x01C4);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiPresetP14,
                prompt      = STRING_TOKEN (0x01DE),
                help        = STRING_TOKEN (0x01DF),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFF,
                step        = 0,
                default     = 0x3000,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiCmn1P14,
                questionid  = 0x7073,
                prompt      = STRING_TOKEN (0x01E0),
                help        = STRING_TOKEN (0x01E1),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFF,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiCnP14,
                questionid  = 0x7074,
                prompt      = STRING_TOKEN (0x01E2),
                help        = STRING_TOKEN (0x01E3),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFF,
                step        = 0,
                default     = 0x30,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiCnp1P14,
                questionid  = 0x7075,
                prompt      = STRING_TOKEN (0x01E4),
                help        = STRING_TOKEN (0x01E5),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFF,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;

          endform;
          
          
          
          form

            formid        = 0x7069,

            title         = STRING_TOKEN (0x01C5);

            subtitle text = STRING_TOKEN (0x01C5);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiPresetP15,
                prompt      = STRING_TOKEN (0x01E6),
                help        = STRING_TOKEN (0x01E7),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFF,
                step        = 0,
                default     = 0x3000,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiCmn1P15,
                questionid  = 0x7076,
                prompt      = STRING_TOKEN (0x01E8),
                help        = STRING_TOKEN (0x01E9),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFF,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiCnP15,
                questionid  = 0x7077,
                prompt      = STRING_TOKEN (0x01EA),
                help        = STRING_TOKEN (0x01EB),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFF,
                step        = 0,
                default     = 0x30,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiCnp1P15,
                questionid  = 0x7078,
                prompt      = STRING_TOKEN (0x01EC),
                help        = STRING_TOKEN (0x01ED),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFF,
                step        = 0,
                default     = 0,
              endnumeric;
            endif;

          endform;
        
        
        
        form

          formid        = 0x7061,

          title         = STRING_TOKEN (0x01BB);

          subtitle text = STRING_TOKEN (0x01BB);
          subtitle text = STRING_TOKEN (0x0002);

          goto 0x7079,
            prompt      = STRING_TOKEN (0x01EE),
            help        = STRING_TOKEN (0x01EE);

          goto 0x707A,
            prompt      = STRING_TOKEN (0x01EF),
            help        = STRING_TOKEN (0x01EF);

          goto 0x707B,
            prompt      = STRING_TOKEN (0x01F0),
            help        = STRING_TOKEN (0x01F0);

          goto 0x707C,
            prompt      = STRING_TOKEN (0x01F1),
            help        = STRING_TOKEN (0x01F1);

          goto 0x707D,
            prompt      = STRING_TOKEN (0x01F2),
            help        = STRING_TOKEN (0x01F2);

          goto 0x707E,
            prompt      = STRING_TOKEN (0x01F3),
            help        = STRING_TOKEN (0x01F3);

          goto 0x707F,
            prompt      = STRING_TOKEN (0x01F4),
            help        = STRING_TOKEN (0x01F4);

          goto 0x7080,
            prompt      = STRING_TOKEN (0x01F5),
            help        = STRING_TOKEN (0x01F5);

        endform;
          
          
          
          form

            formid        = 0x7079,

            title         = STRING_TOKEN (0x01EE);

            subtitle text = STRING_TOKEN (0x01EE);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS0L0,
                prompt      = STRING_TOKEN (0x01F6),
                help        = STRING_TOKEN (0x01F7),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x4444,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS0L0P0,
                questionid  = 0x7081,
                prompt      = STRING_TOKEN (0x01F8),
                help        = STRING_TOKEN (0x01F9),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS0L0P1,
                questionid  = 0x7082,
                prompt      = STRING_TOKEN (0x01FA),
                help        = STRING_TOKEN (0x01FB),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS0L0P2,
                questionid  = 0x7083,
                prompt      = STRING_TOKEN (0x01FC),
                help        = STRING_TOKEN (0x01FD),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS0L0P3,
                questionid  = 0x7084,
                prompt      = STRING_TOKEN (0x01FE),
                help        = STRING_TOKEN (0x01FF),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

          endform;
          
          
          
          form

            formid        = 0x707A,

            title         = STRING_TOKEN (0x01EF);

            subtitle text = STRING_TOKEN (0x01EF);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS0L1,
                prompt      = STRING_TOKEN (0x0200),
                help        = STRING_TOKEN (0x0201),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x4444,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS0L1P0,
                questionid  = 0x7085,
                prompt      = STRING_TOKEN (0x0202),
                help        = STRING_TOKEN (0x0203),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS0L1P1,
                questionid  = 0x7086,
                prompt      = STRING_TOKEN (0x0204),
                help        = STRING_TOKEN (0x0205),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS0L1P2,
                questionid  = 0x7087,
                prompt      = STRING_TOKEN (0x0206),
                help        = STRING_TOKEN (0x0207),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS0L1P3,
                questionid  = 0x7088,
                prompt      = STRING_TOKEN (0x0208),
                help        = STRING_TOKEN (0x0209),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

          endform;
          
          
          
          form

            formid        = 0x707B,

            title         = STRING_TOKEN (0x01F0);

            subtitle text = STRING_TOKEN (0x01F0);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS0L2,
                prompt      = STRING_TOKEN (0x020A),
                help        = STRING_TOKEN (0x020B),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x4444,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS0L2P0,
                questionid  = 0x7089,
                prompt      = STRING_TOKEN (0x020C),
                help        = STRING_TOKEN (0x020D),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS0L2P1,
                questionid  = 0x708A,
                prompt      = STRING_TOKEN (0x020E),
                help        = STRING_TOKEN (0x020F),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS0L2P2,
                questionid  = 0x708B,
                prompt      = STRING_TOKEN (0x0210),
                help        = STRING_TOKEN (0x0211),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS0L2P3,
                questionid  = 0x708C,
                prompt      = STRING_TOKEN (0x0212),
                help        = STRING_TOKEN (0x0213),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

          endform;
          
          
          
          form

            formid        = 0x707C,

            title         = STRING_TOKEN (0x01F1);

            subtitle text = STRING_TOKEN (0x01F1);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS0L3,
                prompt      = STRING_TOKEN (0x0214),
                help        = STRING_TOKEN (0x0215),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x4444,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS0L3P0,
                questionid  = 0x708D,
                prompt      = STRING_TOKEN (0x0216),
                help        = STRING_TOKEN (0x0217),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS0L3P1,
                questionid  = 0x708E,
                prompt      = STRING_TOKEN (0x0218),
                help        = STRING_TOKEN (0x0219),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS0L3P2,
                questionid  = 0x708F,
                prompt      = STRING_TOKEN (0x021A),
                help        = STRING_TOKEN (0x021B),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS0L3P3,
                questionid  = 0x7090,
                prompt      = STRING_TOKEN (0x021C),
                help        = STRING_TOKEN (0x021D),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

          endform;
          
          
          
          form

            formid        = 0x707D,

            title         = STRING_TOKEN (0x01F2);

            subtitle text = STRING_TOKEN (0x01F2);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS1L0,
                prompt      = STRING_TOKEN (0x021E),
                help        = STRING_TOKEN (0x021F),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x4444,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS1L0P0,
                questionid  = 0x7091,
                prompt      = STRING_TOKEN (0x0220),
                help        = STRING_TOKEN (0x0221),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS1L0P1,
                questionid  = 0x7092,
                prompt      = STRING_TOKEN (0x0222),
                help        = STRING_TOKEN (0x0223),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS1L0P2,
                questionid  = 0x7093,
                prompt      = STRING_TOKEN (0x0224),
                help        = STRING_TOKEN (0x0225),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS1L0P3,
                questionid  = 0x7094,
                prompt      = STRING_TOKEN (0x0226),
                help        = STRING_TOKEN (0x0227),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

          endform;
          
          
          
          form

            formid        = 0x707E,

            title         = STRING_TOKEN (0x01F3);

            subtitle text = STRING_TOKEN (0x01F3);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS1L1,
                prompt      = STRING_TOKEN (0x0228),
                help        = STRING_TOKEN (0x0229),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x4444,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS1L1P0,
                questionid  = 0x7095,
                prompt      = STRING_TOKEN (0x022A),
                help        = STRING_TOKEN (0x022B),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS1L1P1,
                questionid  = 0x7096,
                prompt      = STRING_TOKEN (0x022C),
                help        = STRING_TOKEN (0x022D),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS1L1P2,
                questionid  = 0x7097,
                prompt      = STRING_TOKEN (0x022E),
                help        = STRING_TOKEN (0x022F),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS1L1P3,
                questionid  = 0x7098,
                prompt      = STRING_TOKEN (0x0230),
                help        = STRING_TOKEN (0x0231),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

          endform;
          
          
          
          form

            formid        = 0x707F,

            title         = STRING_TOKEN (0x01F4);

            subtitle text = STRING_TOKEN (0x01F4);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS1L2,
                prompt      = STRING_TOKEN (0x0232),
                help        = STRING_TOKEN (0x0233),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x4444,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS1L2P0,
                questionid  = 0x7099,
                prompt      = STRING_TOKEN (0x0234),
                help        = STRING_TOKEN (0x0235),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS1L2P1,
                questionid  = 0x709A,
                prompt      = STRING_TOKEN (0x0236),
                help        = STRING_TOKEN (0x0237),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS1L2P2,
                questionid  = 0x709B,
                prompt      = STRING_TOKEN (0x0238),
                help        = STRING_TOKEN (0x0239),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS1L2P3,
                questionid  = 0x709C,
                prompt      = STRING_TOKEN (0x023A),
                help        = STRING_TOKEN (0x023B),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

          endform;
          
          
          
          form

            formid        = 0x7080,

            title         = STRING_TOKEN (0x01F5);

            subtitle text = STRING_TOKEN (0x01F5);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS1L3,
                prompt      = STRING_TOKEN (0x023C),
                help        = STRING_TOKEN (0x023D),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x4444,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS1L3P0,
                questionid  = 0x709D,
                prompt      = STRING_TOKEN (0x023E),
                help        = STRING_TOKEN (0x023F),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS1L3P1,
                questionid  = 0x709E,
                prompt      = STRING_TOKEN (0x0240),
                help        = STRING_TOKEN (0x0241),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS1L3P2,
                questionid  = 0x709F,
                prompt      = STRING_TOKEN (0x0242),
                help        = STRING_TOKEN (0x0243),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiInitPresetS1L3P3,
                questionid  = 0x70A0,
                prompt      = STRING_TOKEN (0x0244),
                help        = STRING_TOKEN (0x0245),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xF,
                step        = 0,
                default     = 0x4,
              endnumeric;
            endif;

          endform;
        
        
        
        form

          formid        = 0x7062,

          title         = STRING_TOKEN (0x01BC);

          subtitle text = STRING_TOKEN (0x01BC);
          subtitle text = STRING_TOKEN (0x0002);

          goto 0x70A1,
            prompt      = STRING_TOKEN (0x0246),
            help        = STRING_TOKEN (0x0246);

          goto 0x70A2,
            prompt      = STRING_TOKEN (0x0247),
            help        = STRING_TOKEN (0x0247);

          goto 0x70A3,
            prompt      = STRING_TOKEN (0x0248),
            help        = STRING_TOKEN (0x0248);

          goto 0x70A4,
            prompt      = STRING_TOKEN (0x0249),
            help        = STRING_TOKEN (0x0249);

          goto 0x70A5,
            prompt      = STRING_TOKEN (0x024A),
            help        = STRING_TOKEN (0x024A);

          goto 0x70A6,
            prompt      = STRING_TOKEN (0x024B),
            help        = STRING_TOKEN (0x024B);

          goto 0x70A7,
            prompt      = STRING_TOKEN (0x024C),
            help        = STRING_TOKEN (0x024C);

          goto 0x70A8,
            prompt      = STRING_TOKEN (0x024D),
            help        = STRING_TOKEN (0x024D);

        endform;
          
          
          
          form

            formid        = 0x70A1,

            title         = STRING_TOKEN (0x0246);

            subtitle text = STRING_TOKEN (0x0246);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L0P01,
                prompt      = STRING_TOKEN (0x024E),
                help        = STRING_TOKEN (0x024F),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFFFF,
                step        = 0,
                default     = 0x007A007A,
              endnumeric;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L0P23,
                prompt      = STRING_TOKEN (0x0250),
                help        = STRING_TOKEN (0x0251),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFFFF,
                step        = 0,
                default     = 0x007A007A,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L0P0,
                questionid  = 0x70A9,
                prompt      = STRING_TOKEN (0x0252),
                help        = STRING_TOKEN (0x0253),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L0P1,
                questionid  = 0x70AA,
                prompt      = STRING_TOKEN (0x0254),
                help        = STRING_TOKEN (0x0255),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L0P2,
                questionid  = 0x70AB,
                prompt      = STRING_TOKEN (0x0256),
                help        = STRING_TOKEN (0x0257),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L0P3,
                questionid  = 0x70AC,
                prompt      = STRING_TOKEN (0x0258),
                help        = STRING_TOKEN (0x0259),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

          endform;
          
          
          
          form

            formid        = 0x70A2,

            title         = STRING_TOKEN (0x0247);

            subtitle text = STRING_TOKEN (0x0247);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L1P01,
                prompt      = STRING_TOKEN (0x025A),
                help        = STRING_TOKEN (0x025B),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFFFF,
                step        = 0,
                default     = 0x007A007A,
              endnumeric;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L1P23,
                prompt      = STRING_TOKEN (0x025C),
                help        = STRING_TOKEN (0x025D),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFFFF,
                step        = 0,
                default     = 0x007A007A,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L1P0,
                questionid  = 0x70AD,
                prompt      = STRING_TOKEN (0x025E),
                help        = STRING_TOKEN (0x025F),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L1P1,
                questionid  = 0x70AE,
                prompt      = STRING_TOKEN (0x0260),
                help        = STRING_TOKEN (0x0261),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L1P2,
                questionid  = 0x70AF,
                prompt      = STRING_TOKEN (0x0262),
                help        = STRING_TOKEN (0x0263),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L1P3,
                questionid  = 0x70B0,
                prompt      = STRING_TOKEN (0x0264),
                help        = STRING_TOKEN (0x0265),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

          endform;
          
          
          
          form

            formid        = 0x70A3,

            title         = STRING_TOKEN (0x0248);

            subtitle text = STRING_TOKEN (0x0248);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L2P01,
                prompt      = STRING_TOKEN (0x0266),
                help        = STRING_TOKEN (0x0267),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFFFF,
                step        = 0,
                default     = 0x007A007A,
              endnumeric;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L2P23,
                prompt      = STRING_TOKEN (0x0268),
                help        = STRING_TOKEN (0x0269),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFFFF,
                step        = 0,
                default     = 0x007A007A,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L2P0,
                questionid  = 0x70B1,
                prompt      = STRING_TOKEN (0x026A),
                help        = STRING_TOKEN (0x026B),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L2P1,
                questionid  = 0x70B2,
                prompt      = STRING_TOKEN (0x026C),
                help        = STRING_TOKEN (0x026D),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L2P2,
                questionid  = 0x70B3,
                prompt      = STRING_TOKEN (0x026E),
                help        = STRING_TOKEN (0x026F),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L2P3,
                questionid  = 0x70B4,
                prompt      = STRING_TOKEN (0x0270),
                help        = STRING_TOKEN (0x0271),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

          endform;
          
          
          
          form

            formid        = 0x70A4,

            title         = STRING_TOKEN (0x0249);

            subtitle text = STRING_TOKEN (0x0249);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L3P01,
                prompt      = STRING_TOKEN (0x0272),
                help        = STRING_TOKEN (0x0273),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFFFF,
                step        = 0,
                default     = 0x007A007A,
              endnumeric;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L3P23,
                prompt      = STRING_TOKEN (0x0274),
                help        = STRING_TOKEN (0x0275),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFFFF,
                step        = 0,
                default     = 0x007A007A,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L3P0,
                questionid  = 0x70B5,
                prompt      = STRING_TOKEN (0x0276),
                help        = STRING_TOKEN (0x0277),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L3P1,
                questionid  = 0x70B6,
                prompt      = STRING_TOKEN (0x0278),
                help        = STRING_TOKEN (0x0279),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L3P2,
                questionid  = 0x70B7,
                prompt      = STRING_TOKEN (0x027A),
                help        = STRING_TOKEN (0x027B),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS0L3P3,
                questionid  = 0x70B8,
                prompt      = STRING_TOKEN (0x027C),
                help        = STRING_TOKEN (0x027D),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

          endform;
          
          
          
          form

            formid        = 0x70A5,

            title         = STRING_TOKEN (0x024A);

            subtitle text = STRING_TOKEN (0x024A);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L0P01,
                prompt      = STRING_TOKEN (0x027E),
                help        = STRING_TOKEN (0x027F),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFFFF,
                step        = 0,
                default     = 0x007A007A,
              endnumeric;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L0P23,
                prompt      = STRING_TOKEN (0x0280),
                help        = STRING_TOKEN (0x0281),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFFFF,
                step        = 0,
                default     = 0x007A007A,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L0P0,
                questionid  = 0x70B9,
                prompt      = STRING_TOKEN (0x0282),
                help        = STRING_TOKEN (0x0283),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L0P1,
                questionid  = 0x70BA,
                prompt      = STRING_TOKEN (0x0284),
                help        = STRING_TOKEN (0x0285),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L0P2,
                questionid  = 0x70BB,
                prompt      = STRING_TOKEN (0x0286),
                help        = STRING_TOKEN (0x0287),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L0P3,
                questionid  = 0x70BC,
                prompt      = STRING_TOKEN (0x0288),
                help        = STRING_TOKEN (0x0289),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

          endform;
          
          
          
          form

            formid        = 0x70A6,

            title         = STRING_TOKEN (0x024B);

            subtitle text = STRING_TOKEN (0x024B);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L1P01,
                prompt      = STRING_TOKEN (0x028A),
                help        = STRING_TOKEN (0x028B),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFFFF,
                step        = 0,
                default     = 0x007A007A,
              endnumeric;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L1P23,
                prompt      = STRING_TOKEN (0x028C),
                help        = STRING_TOKEN (0x028D),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFFFF,
                step        = 0,
                default     = 0x007A007A,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L1P0,
                questionid  = 0x70BD,
                prompt      = STRING_TOKEN (0x028E),
                help        = STRING_TOKEN (0x028F),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L1P1,
                questionid  = 0x70BE,
                prompt      = STRING_TOKEN (0x0290),
                help        = STRING_TOKEN (0x0291),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L1P2,
                questionid  = 0x70BF,
                prompt      = STRING_TOKEN (0x0292),
                help        = STRING_TOKEN (0x0293),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L1P3,
                questionid  = 0x70C0,
                prompt      = STRING_TOKEN (0x0294),
                help        = STRING_TOKEN (0x0295),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

          endform;
          
          
          
          form

            formid        = 0x70A7,

            title         = STRING_TOKEN (0x024C);

            subtitle text = STRING_TOKEN (0x024C);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L2P01,
                prompt      = STRING_TOKEN (0x0296),
                help        = STRING_TOKEN (0x0297),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFFFF,
                step        = 0,
                default     = 0x007A007A,
              endnumeric;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L2P23,
                prompt      = STRING_TOKEN (0x0298),
                help        = STRING_TOKEN (0x0299),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFFFF,
                step        = 0,
                default     = 0x007A007A,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L2P0,
                questionid  = 0x70C1,
                prompt      = STRING_TOKEN (0x029A),
                help        = STRING_TOKEN (0x029B),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L2P1,
                questionid  = 0x70C2,
                prompt      = STRING_TOKEN (0x029C),
                help        = STRING_TOKEN (0x029D),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L2P2,
                questionid  = 0x70C3,
                prompt      = STRING_TOKEN (0x029E),
                help        = STRING_TOKEN (0x029F),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L2P3,
                questionid  = 0x70C4,
                prompt      = STRING_TOKEN (0x02A0),
                help        = STRING_TOKEN (0x02A1),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

          endform;
          
          
          
          form

            formid        = 0x70A8,

            title         = STRING_TOKEN (0x024D);

            subtitle text = STRING_TOKEN (0x024D);
            subtitle text = STRING_TOKEN (0x0002);

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L3P01,
                prompt      = STRING_TOKEN (0x02A2),
                help        = STRING_TOKEN (0x02A3),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFFFF,
                step        = 0,
                default     = 0x007A007A,
              endnumeric;
            endif;
            endif;

            
            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
            grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L3P23,
                prompt      = STRING_TOKEN (0x02A4),
                help        = STRING_TOKEN (0x02A5),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0,
                maximum     = 0xFFFFFFFF,
                step        = 0,
                default     = 0x007A007A,
              endnumeric;
            endif;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L3P0,
                questionid  = 0x70C5,
                prompt      = STRING_TOKEN (0x02A6),
                help        = STRING_TOKEN (0x02A7),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L3P1,
                questionid  = 0x70C6,
                prompt      = STRING_TOKEN (0x02A8),
                help        = STRING_TOKEN (0x02A9),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L3P2,
                questionid  = 0x70C7,
                prompt      = STRING_TOKEN (0x02AA),
                help        = STRING_TOKEN (0x02AB),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiPresetControl == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsDfXgmiTxeqS1L3P3,
                questionid  = 0x70C8,
                prompt      = STRING_TOKEN (0x02AC),
                help        = STRING_TOKEN (0x02AD),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0,
                maximum     = 0xFFFF,
                step        = 0,
                default     = 0x7A,
              endnumeric;
            endif;

          endform;
        
        
        
        form

          formid        = 0x7063,

          title         = STRING_TOKEN (0x01BD);

          subtitle text = STRING_TOKEN (0x01BD);
          subtitle text = STRING_TOKEN (0x0002);

          
          oneof
            varid       = CBS_CONFIG.CbsDfXgmiAcDcCoupledLinkControl,
            prompt      = STRING_TOKEN (0x02AE),
            help        = STRING_TOKEN (0x02AF),
            option text = STRING_TOKEN (0x0195),          value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          endoneof;

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiAcDcCoupledLinkControl == 0;
          grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
            
            numeric
              varid       = CBS_CONFIG.CbsDfXgmiAcDcCoupledLink,
              prompt      = STRING_TOKEN (0x02B0),
              help        = STRING_TOKEN (0x02B1),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
              minimum     = 0,
              maximum     = 0xFF,
              step        = 0,
              default     = 0xFF,
            endnumeric;
          endif;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiAcDcCoupledLinkControl == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsDfXgmiAcDcCoupledLinkSocket0Link0,
              questionid  = 0x70C9,
              prompt      = STRING_TOKEN (0x02B2),
              help        = STRING_TOKEN (0x02B3),
              option text = STRING_TOKEN (0x02B4),      value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x02B5),      value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiAcDcCoupledLinkControl == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsDfXgmiAcDcCoupledLinkSocket0Link1,
              questionid  = 0x70CA,
              prompt      = STRING_TOKEN (0x02B6),
              help        = STRING_TOKEN (0x02B7),
              option text = STRING_TOKEN (0x02B4),      value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x02B5),      value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiAcDcCoupledLinkControl == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsDfXgmiAcDcCoupledLinkSocket0Link2,
              questionid  = 0x70CB,
              prompt      = STRING_TOKEN (0x02B8),
              help        = STRING_TOKEN (0x02B9),
              option text = STRING_TOKEN (0x02B4),      value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x02B5),      value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiAcDcCoupledLinkControl == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsDfXgmiAcDcCoupledLinkSocket0Link3,
              questionid  = 0x70CC,
              prompt      = STRING_TOKEN (0x02BA),
              help        = STRING_TOKEN (0x02BB),
              option text = STRING_TOKEN (0x02B4),      value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x02B5),      value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiAcDcCoupledLinkControl == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsDfXgmiAcDcCoupledLinkSocket1Link0,
              questionid  = 0x70CD,
              prompt      = STRING_TOKEN (0x02BC),
              help        = STRING_TOKEN (0x02BD),
              option text = STRING_TOKEN (0x02B4),      value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x02B5),      value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiAcDcCoupledLinkControl == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsDfXgmiAcDcCoupledLinkSocket1Link1,
              questionid  = 0x70CE,
              prompt      = STRING_TOKEN (0x02BE),
              help        = STRING_TOKEN (0x02BF),
              option text = STRING_TOKEN (0x02B4),      value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x02B5),      value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiAcDcCoupledLinkControl == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsDfXgmiAcDcCoupledLinkSocket1Link2,
              questionid  = 0x70CF,
              prompt      = STRING_TOKEN (0x02C0),
              help        = STRING_TOKEN (0x02C1),
              option text = STRING_TOKEN (0x02B4),      value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x02B5),      value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiAcDcCoupledLinkControl == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsDfXgmiAcDcCoupledLinkSocket1Link3,
              questionid  = 0x70D0,
              prompt      = STRING_TOKEN (0x02C2),
              help        = STRING_TOKEN (0x02C3),
              option text = STRING_TOKEN (0x02B4),      value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x02B5),      value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

        endform;
        
        
        
        form

          formid        = 0x7064,

          title         = STRING_TOKEN (0x01BE);

          subtitle text = STRING_TOKEN (0x01BE);
          subtitle text = STRING_TOKEN (0x0002);

          
          oneof
            varid       = CBS_CONFIG.CbsDfXgmiChannelTypeControl,
            prompt      = STRING_TOKEN (0x02C4),
            help        = STRING_TOKEN (0x02C5),
            option text = STRING_TOKEN (0x0195),          value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          endoneof;

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiChannelTypeControl == 0;
          grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
            
            numeric
              varid       = CBS_CONFIG.CbsDfXgmiChannelType,
              prompt      = STRING_TOKEN (0x02C6),
              help        = STRING_TOKEN (0x02C7),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
              minimum     = 0,
              maximum     = 0xFFFFFFFF,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiChannelTypeControl == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsDfXgmiChannelTypeSocket0Link0,
              questionid  = 0x70D1,
              prompt      = STRING_TOKEN (0x02C8),
              help        = STRING_TOKEN (0x02C9),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x02CA),      value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiChannelTypeControl == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsDfXgmiChannelTypeSocket0Link1,
              questionid  = 0x70D2,
              prompt      = STRING_TOKEN (0x02CB),
              help        = STRING_TOKEN (0x02CC),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x02CA),      value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiChannelTypeControl == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsDfXgmiChannelTypeSocket0Link2,
              questionid  = 0x70D3,
              prompt      = STRING_TOKEN (0x02CD),
              help        = STRING_TOKEN (0x02CE),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x02CA),      value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiChannelTypeControl == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsDfXgmiChannelTypeSocket0Link3,
              questionid  = 0x70D4,
              prompt      = STRING_TOKEN (0x02CF),
              help        = STRING_TOKEN (0x02D0),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x02CA),      value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiChannelTypeControl == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsDfXgmiChannelTypeSocket1Link0,
              questionid  = 0x70D5,
              prompt      = STRING_TOKEN (0x02D1),
              help        = STRING_TOKEN (0x02D2),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x02CA),      value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiChannelTypeControl == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsDfXgmiChannelTypeSocket1Link1,
              questionid  = 0x70D6,
              prompt      = STRING_TOKEN (0x02D3),
              help        = STRING_TOKEN (0x02D4),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x02CA),      value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiChannelTypeControl == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsDfXgmiChannelTypeSocket1Link2,
              questionid  = 0x70D7,
              prompt      = STRING_TOKEN (0x02D5),
              help        = STRING_TOKEN (0x02D6),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x02CA),      value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsDfXgmiChannelTypeControl == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsDfXgmiChannelTypeSocket1Link3,
              questionid  = 0x70D8,
              prompt      = STRING_TOKEN (0x02D7),
              help        = STRING_TOKEN (0x02D8),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x02CA),      value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

        endform;
      
      
      
      form

        formid        = 0x704F,

        title         = STRING_TOKEN (0x0147);

        subtitle text = STRING_TOKEN (0x0147);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsDfCdma,
          prompt      = STRING_TOKEN (0x02D9),
          help        = STRING_TOKEN (0x02DA),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        grayoutif NOT ideqval CBS_CONFIG.CbsDfCdma == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsDfDbgDisRmtSteer,
            prompt      = STRING_TOKEN (0x02DB),
            help        = STRING_TOKEN (0x02DC),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          endoneof;
        endif;

      endform;
      
      
      
      form

        formid        = 0x7050,

        title         = STRING_TOKEN (0x0148);

        subtitle text = STRING_TOKEN (0x0148);
        subtitle text = STRING_TOKEN (0x0002);

        label 0x70DA;
        
        oneof
          varid       = CBS_CONFIG.CbsDfCmnPfOrganization,
          questionid  = 0x70D9,
          prompt      = STRING_TOKEN (0x02DD),
          help        = STRING_TOKEN (0x02DE),
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x02DF),       value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x02E0),          value = 2,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
        endoneof;
        label 0x70DB;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnDfPdrTuning,
          prompt      = STRING_TOKEN (0x02E1),
          help        = STRING_TOKEN (0x02E2),
          option text = STRING_TOKEN (0x02E3),        value = 4,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x02E4),         value = 5,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsDfCmnMemIntlvPageSize,
          questionid  = 0x70DC,
          prompt      = STRING_TOKEN (0x02E5),
          help        = STRING_TOKEN (0x02E6),
          option text = STRING_TOKEN (0x02E7),     value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x02E8),   value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
        endoneof;

      endform;
    
    
    
    form

      formid        = 0x7003,

      title         = STRING_TOKEN (0x0009);

      subtitle text = STRING_TOKEN (0x0009);
      subtitle text = STRING_TOKEN (0x0002);

      goto 0x70DD,
        prompt      = STRING_TOKEN (0x02E9),
        help        = STRING_TOKEN (0x02E9);

      goto 0x70DE,
        prompt      = STRING_TOKEN (0x02EA),
        help        = STRING_TOKEN (0x02EA);

      goto 0x70DF,
        prompt      = STRING_TOKEN (0x02EB),
        help        = STRING_TOKEN (0x02EB);

      goto 0x70E0,
        prompt      = STRING_TOKEN (0x02EC),
        help        = STRING_TOKEN (0x02EC);

      goto 0x70E1,
        prompt      = STRING_TOKEN (0x02ED),
        help        = STRING_TOKEN (0x02ED);

      goto 0x70E2,
        prompt      = STRING_TOKEN (0x02EE),
        help        = STRING_TOKEN (0x02EE);

      goto 0x70E3,
        prompt      = STRING_TOKEN (0x02EF),
        help        = STRING_TOKEN (0x02EF);

      goto 0x70E4,
        prompt      = STRING_TOKEN (0x02F0),
        help        = STRING_TOKEN (0x02F0);

      goto 0x70E5,
        prompt      = STRING_TOKEN (0x02F1),
        help        = STRING_TOKEN (0x02F1);

      goto 0x70E6,
        prompt      = STRING_TOKEN (0x02F2),
        help        = STRING_TOKEN (0x02F2);

      goto 0x70E7,
        prompt      = STRING_TOKEN (0x02F3),
        help        = STRING_TOKEN (0x02F3);

    endform;
      
      
      
      form

        formid        = 0x70DD,

        title         = STRING_TOKEN (0x02E9);

        subtitle text = STRING_TOKEN (0x02E9);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemCsInterleaveDdr,
          prompt      = STRING_TOKEN (0x02F4),
          help        = STRING_TOKEN (0x02F5),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemAddressHashBankDdr,
          prompt      = STRING_TOKEN (0x02F6),
          help        = STRING_TOKEN (0x02F7),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemAddressHashCsDdr,
          prompt      = STRING_TOKEN (0x02F8),
          help        = STRING_TOKEN (0x02F9),
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemAddressHashRmDdr,
          prompt      = STRING_TOKEN (0x02FA),
          help        = STRING_TOKEN (0x02FB),
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemAddressHashSubchannelDdr,
          prompt      = STRING_TOKEN (0x02FC),
          help        = STRING_TOKEN (0x02FD),
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemCtrllerBankSwapModeDdr,
          prompt      = STRING_TOKEN (0x02FE),
          help        = STRING_TOKEN (0x02FF),
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0300),        value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;

      endform;
      
      
      
      form

        formid        = 0x70DE,

        title         = STRING_TOKEN (0x02EA);

        subtitle text = STRING_TOKEN (0x02EA);
        subtitle text = STRING_TOKEN (0x0002);

        goto 0x70E8,
          prompt      = STRING_TOKEN (0x0301),
          help        = STRING_TOKEN (0x0301);

        goto 0x70E9,
          prompt      = STRING_TOKEN (0x0302),
          help        = STRING_TOKEN (0x0302);

        goto 0x70EA,
          prompt      = STRING_TOKEN (0x0303),
          help        = STRING_TOKEN (0x0303);

        text
          help        = STRING_TOKEN (0x0002),
          text        = STRING_TOKEN (0x0002);

        
        suppressif NOT ideqval CBS_CONFIG.CbsComboFlag == 10
               AND NOT ideqval CBS_CONFIG.CbsComboFlag == 16;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemContextRestoreDdr,
            prompt      = STRING_TOKEN (0x0304),
            help        = STRING_TOKEN (0x0305),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          endoneof;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsDramSurvivesWarmReset,
          prompt      = STRING_TOKEN (0x0306),
          help        = STRING_TOKEN (0x0307),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;

      endform;
        
        
        
        form

          formid        = 0x70E8,

          title         = STRING_TOKEN (0x0301);

          subtitle text = STRING_TOKEN (0x0301);
          subtitle text = STRING_TOKEN (0x0002);

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemCtrllerPwrDnEnDdr,
            prompt      = STRING_TOKEN (0x0308),
            help        = STRING_TOKEN (0x0309),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          endoneof;

          
          numeric
            varid       = CBS_CONFIG.CbsCmnMemSubUrgRefLowerBound,
            prompt      = STRING_TOKEN (0x030A),
            help        = STRING_TOKEN (0x030B),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 1,
            maximum     = 6,
            step        = 0,
            default     = 1,
          endnumeric;

          
          numeric
            varid       = CBS_CONFIG.CbsCmnMemUrgRefLimit,
            prompt      = STRING_TOKEN (0x030C),
            help        = STRING_TOKEN (0x030D),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 1,
            maximum     = 6,
            step        = 0,
            default     = 4,
          endnumeric;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemDramRefreshRate,
            prompt      = STRING_TOKEN (0x030E),
            help        = STRING_TOKEN (0x030F),
            option text = STRING_TOKEN (0x0310),    value = 0,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0311),   value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSelfRefreshExitStaggering,
            prompt      = STRING_TOKEN (0x0312),
            help        = STRING_TOKEN (0x0313),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0314),             value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0315),             value = 2,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0316),             value = 3,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0317),             value = 4,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0318),             value = 5,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0319),             value = 6,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x031A),             value = 7,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x031B),             value = 8,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x031C),             value = 9,    flags = DEFAULT | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemt2xRefreshTemperatureThreshold,
            prompt      = STRING_TOKEN (0x031D),
            help        = STRING_TOKEN (0x031E),
            option text = STRING_TOKEN (0x031F),           value = 2,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0320),           value = 3,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0321),          value = 4,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0322),             value = 5,    flags = 0 | RESET_REQUIRED;
          endoneof;

        endform;
        
        
        
        form

          formid        = 0x70E9,

          title         = STRING_TOKEN (0x0302);

          subtitle text = STRING_TOKEN (0x0302);
          subtitle text = STRING_TOKEN (0x0002);

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemChannelDisableFloatPowerGoodDdr,
            prompt      = STRING_TOKEN (0x0323),
            help        = STRING_TOKEN (0x0324),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnMemChannelDisableBitmaskDdr,
              questionid  = 0x70EB,
              prompt      = STRING_TOKEN (0x0325),
              help        = STRING_TOKEN (0x0326),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
              minimum     = 0,
              maximum     = 0xFFFFFFFF,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket0Channel0Ddr,
            questionid  = 0x70EC,
            prompt      = STRING_TOKEN (0x0327),
            help        = STRING_TOKEN (0x0328),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket0Channel1Ddr,
            questionid  = 0x70ED,
            prompt      = STRING_TOKEN (0x0329),
            help        = STRING_TOKEN (0x032A),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket0Channel2Ddr,
            questionid  = 0x70EE,
            prompt      = STRING_TOKEN (0x032B),
            help        = STRING_TOKEN (0x032C),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket0Channel3Ddr,
            questionid  = 0x70EF,
            prompt      = STRING_TOKEN (0x032D),
            help        = STRING_TOKEN (0x032E),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket0Channel4Ddr,
            questionid  = 0x70F0,
            prompt      = STRING_TOKEN (0x032F),
            help        = STRING_TOKEN (0x0330),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket0Channel5Ddr,
            questionid  = 0x70F1,
            prompt      = STRING_TOKEN (0x0331),
            help        = STRING_TOKEN (0x0332),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket0Channel6Ddr,
            questionid  = 0x70F2,
            prompt      = STRING_TOKEN (0x0333),
            help        = STRING_TOKEN (0x0334),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket0Channel7Ddr,
            questionid  = 0x70F3,
            prompt      = STRING_TOKEN (0x0335),
            help        = STRING_TOKEN (0x0336),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket0Channel8Ddr,
            questionid  = 0x70F4,
            prompt      = STRING_TOKEN (0x0337),
            help        = STRING_TOKEN (0x0338),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket0Channel9Ddr,
            questionid  = 0x70F5,
            prompt      = STRING_TOKEN (0x0339),
            help        = STRING_TOKEN (0x033A),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket0Channel10Ddr,
            questionid  = 0x70F6,
            prompt      = STRING_TOKEN (0x033B),
            help        = STRING_TOKEN (0x033C),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket0Channel11Ddr,
            questionid  = 0x70F7,
            prompt      = STRING_TOKEN (0x033D),
            help        = STRING_TOKEN (0x033E),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket1Channel0Ddr,
            questionid  = 0x70F8,
            prompt      = STRING_TOKEN (0x033F),
            help        = STRING_TOKEN (0x0340),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket1Channel1Ddr,
            questionid  = 0x70F9,
            prompt      = STRING_TOKEN (0x0341),
            help        = STRING_TOKEN (0x0342),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket1Channel2Ddr,
            questionid  = 0x70FA,
            prompt      = STRING_TOKEN (0x0343),
            help        = STRING_TOKEN (0x0344),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket1Channel3Ddr,
            questionid  = 0x70FB,
            prompt      = STRING_TOKEN (0x0345),
            help        = STRING_TOKEN (0x0346),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket1Channel4Ddr,
            questionid  = 0x70FC,
            prompt      = STRING_TOKEN (0x0347),
            help        = STRING_TOKEN (0x0348),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket1Channel5Ddr,
            questionid  = 0x70FD,
            prompt      = STRING_TOKEN (0x0349),
            help        = STRING_TOKEN (0x034A),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket1Channel6Ddr,
            questionid  = 0x70FE,
            prompt      = STRING_TOKEN (0x034B),
            help        = STRING_TOKEN (0x034C),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket1Channel7Ddr,
            questionid  = 0x70FF,
            prompt      = STRING_TOKEN (0x034D),
            help        = STRING_TOKEN (0x034E),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket1Channel8Ddr,
            questionid  = 0x7100,
            prompt      = STRING_TOKEN (0x034F),
            help        = STRING_TOKEN (0x0350),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket1Channel9Ddr,
            questionid  = 0x7101,
            prompt      = STRING_TOKEN (0x0351),
            help        = STRING_TOKEN (0x0352),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket1Channel10Ddr,
            questionid  = 0x7102,
            prompt      = STRING_TOKEN (0x0353),
            help        = STRING_TOKEN (0x0354),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSocket1Channel11Ddr,
            questionid  = 0x7103,
            prompt      = STRING_TOKEN (0x0355),
            help        = STRING_TOKEN (0x0356),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          endoneof;

        endform;
        
        
        
        form

          formid        = 0x70EA,

          title         = STRING_TOKEN (0x0303);

          subtitle text = STRING_TOKEN (0x0303);
          subtitle text = STRING_TOKEN (0x0002);

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemRefManagementDdr,
            prompt      = STRING_TOKEN (0x0357),
            help        = STRING_TOKEN (0x0358),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0359),    value = 2,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemArfmDdr,
            prompt      = STRING_TOKEN (0x035A),
            help        = STRING_TOKEN (0x035B),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x035C),    value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x035D),    value = 2,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x035E),    value = 3,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemRAAIMTDdr,
            prompt      = STRING_TOKEN (0x035F),
            help        = STRING_TOKEN (0x0360),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0361),              value = 32,   flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0362),              value = 40,   flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0363),              value = 48,   flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0364),              value = 56,   flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0365),              value = 64,   flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0366),              value = 72,   flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0367),              value = 80,   flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemRAAMMTDdr,
            prompt      = STRING_TOKEN (0x0368),
            help        = STRING_TOKEN (0x0369),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x036A),              value = 2,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x036B),              value = 3,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x036C),              value = 4,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x036D),              value = 5,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemRAARefDecMultiplierDdr,
            prompt      = STRING_TOKEN (0x036E),
            help        = STRING_TOKEN (0x036F),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0370),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001B),               value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemDrfmDdr,
            prompt      = STRING_TOKEN (0x0371),
            help        = STRING_TOKEN (0x0372),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemDrfmBrcDdr,
            prompt      = STRING_TOKEN (0x0373),
            help        = STRING_TOKEN (0x0374),
            option text = STRING_TOKEN (0x0375),            value = 2,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0376),            value = 3,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0377),            value = 4,    flags = DEFAULT | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemDrfmHashDdr,
            prompt      = STRING_TOKEN (0x0378),
            help        = STRING_TOKEN (0x0379),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

        endform;
      
      
      
      form

        formid        = 0x70DF,

        title         = STRING_TOKEN (0x02EB);

        subtitle text = STRING_TOKEN (0x02EB);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemMbistEnDdr,
          prompt      = STRING_TOKEN (0x037A),
          help        = STRING_TOKEN (0x037B),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnMemMbistEnDdr == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemMbistTestmodeDdr,
            prompt      = STRING_TOKEN (0x037C),
            help        = STRING_TOKEN (0x037D),
            option text = STRING_TOKEN (0x037E),  value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x037F),   value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0380),            value = 2,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          endoneof;
        endif;

        
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnMemMbistEnDdr == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemMbistAggressorsDdr,
            prompt      = STRING_TOKEN (0x0381),
            help        = STRING_TOKEN (0x0382),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xff, flags = DEFAULT | RESET_REQUIRED;
          endoneof;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemHealingBistEnableBitMaskDdr,
          prompt      = STRING_TOKEN (0x0383),
          help        = STRING_TOKEN (0x0384),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0385),    value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0386), value = 2,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0387), value = 3,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnMemHealingBistEnableBitMaskDdr == 1
              AND NOT ideqval CBS_CONFIG.CbsCmnMemHealingBistEnableBitMaskDdr == 2
              AND NOT ideqval CBS_CONFIG.CbsCmnMemHealingBistEnableBitMaskDdr == 3;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemHealingBistExecutionMode,
            prompt      = STRING_TOKEN (0x0388),
            help        = STRING_TOKEN (0x0389),
            option text = STRING_TOKEN (0x038A),        value = 0,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x038B),      value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;
        endif;

        
        
        suppressif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnMemHealingBistEnableBitMaskDdr == 1
              AND NOT ideqval CBS_CONFIG.CbsCmnMemHealingBistEnableBitMaskDdr == 3;
          goto 0x7104,
            prompt      = STRING_TOKEN (0x038C),
            help        = STRING_TOKEN (0x038C);
        endif;
        endif;

        
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnMemHealingBistEnableBitMaskDdr == 1
              AND NOT ideqval CBS_CONFIG.CbsCmnMemHealingBistEnableBitMaskDdr == 3;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemHealingBistRepairTypeDdr,
            prompt      = STRING_TOKEN (0x038D),
            help        = STRING_TOKEN (0x038E),
            option text = STRING_TOKEN (0x038F),     value = 0,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0390),     value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0391), value = 2,    flags = 0 | RESET_REQUIRED;
          endoneof;
        endif;

        goto 0x7105,
          prompt      = STRING_TOKEN (0x0392),
          help        = STRING_TOKEN (0x0392);

      endform;
        
        
        
        form

          formid        = 0x7104,

          title         = STRING_TOKEN (0x038C);

          subtitle text = STRING_TOKEN (0x038C);
          subtitle text = STRING_TOKEN (0x0002);

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemPmuBistAlgorithmSelect,
            prompt      = STRING_TOKEN (0x0393),
            help        = STRING_TOKEN (0x0394),
            option text = STRING_TOKEN (0x0395),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0396),       value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          endoneof;

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnMemPmuBistAlgorithmSelect == 0;
          grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnMemPmuBistAlgorithmBitMaskDdr,
              questionid  = 0x7106,
              prompt      = STRING_TOKEN (0x0397),
              help        = STRING_TOKEN (0x0398),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
              minimum     = 0,
              maximum     = 0x1FF,
              step        = 0,
              default     = 0x01FF,
            endnumeric;
          endif;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnMemPmuBistAlgorithmSelect == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnMemPmuBistAlgorithm1,
              questionid  = 0x7107,
              prompt      = STRING_TOKEN (0x0399),
              help        = STRING_TOKEN (0x039A),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnMemPmuBistAlgorithmSelect == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnMemPmuBistAlgorithm2,
              questionid  = 0x7108,
              prompt      = STRING_TOKEN (0x039B),
              help        = STRING_TOKEN (0x039C),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnMemPmuBistAlgorithmSelect == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnMemPmuBistAlgorithm3,
              questionid  = 0x7109,
              prompt      = STRING_TOKEN (0x039D),
              help        = STRING_TOKEN (0x039E),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnMemPmuBistAlgorithmSelect == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnMemPmuBistAlgorithm4,
              questionid  = 0x710A,
              prompt      = STRING_TOKEN (0x039F),
              help        = STRING_TOKEN (0x03A0),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnMemPmuBistAlgorithmSelect == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnMemPmuBistAlgorithm5,
              questionid  = 0x710B,
              prompt      = STRING_TOKEN (0x03A1),
              help        = STRING_TOKEN (0x03A2),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnMemPmuBistAlgorithmSelect == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnMemPmuBistAlgorithm6,
              questionid  = 0x710C,
              prompt      = STRING_TOKEN (0x03A3),
              help        = STRING_TOKEN (0x03A4),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnMemPmuBistAlgorithmSelect == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnMemPmuBistAlgorithm7,
              questionid  = 0x710D,
              prompt      = STRING_TOKEN (0x03A5),
              help        = STRING_TOKEN (0x03A6),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnMemPmuBistAlgorithmSelect == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnMemPmuBistAlgorithm8,
              questionid  = 0x710E,
              prompt      = STRING_TOKEN (0x03A7),
              help        = STRING_TOKEN (0x03A8),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnMemPmuBistAlgorithmSelect == 0;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnMemPmuBistAlgorithm9,
              questionid  = 0x710F,
              prompt      = STRING_TOKEN (0x03A9),
              help        = STRING_TOKEN (0x03AA),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
            endoneof;
          endif;

        endform;
        
        
        
        form

          formid        = 0x7105,

          title         = STRING_TOKEN (0x0392);

          subtitle text = STRING_TOKEN (0x0392);
          subtitle text = STRING_TOKEN (0x0002);

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemMbistPatternSelect,
            prompt      = STRING_TOKEN (0x03AB),
            help        = STRING_TOKEN (0x03AC),
            option text = STRING_TOKEN (0x03AD),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x03AE),             value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0380),            value = 2,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          numeric
            varid       = CBS_CONFIG.CbsCmnMemMbistPatternLength,
            prompt      = STRING_TOKEN (0x03AF),
            help        = STRING_TOKEN (0x03B0),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 3,
            maximum     = 12,
            step        = 0,
            default     = 3,
          endnumeric;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemMbistAggressorsChnl,
            prompt      = STRING_TOKEN (0x03B1),
            help        = STRING_TOKEN (0x03B2),
            option text = STRING_TOKEN (0x03B3), value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x03B4),   value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x03B5),    value = 2,    flags = DEFAULT | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemMbistAggrStaticLaneCtrl,
            prompt      = STRING_TOKEN (0x03B6),
            help        = STRING_TOKEN (0x03B7),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          grayoutif NOT ideqval CBS_CONFIG.CbsCmnMemMbistAggrStaticLaneCtrl == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnMemMbistAggrStaticLaneSelU32,
              prompt      = STRING_TOKEN (0x03B8),
              help        = STRING_TOKEN (0x03B9),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
              minimum     = 0,
              maximum     = 0xFFFFFFFF,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          grayoutif NOT ideqval CBS_CONFIG.CbsCmnMemMbistAggrStaticLaneCtrl == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnMemMbistAggrStaticLaneSelL32,
              prompt      = STRING_TOKEN (0x03BA),
              help        = STRING_TOKEN (0x03BB),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
              minimum     = 0,
              maximum     = 0xFFFFFFFF,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          grayoutif NOT ideqval CBS_CONFIG.CbsCmnMemMbistAggrStaticLaneCtrl == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnMemMbistAggrStaticLaneSelEcc,
              prompt      = STRING_TOKEN (0x03BC),
              help        = STRING_TOKEN (0x03BD),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
              minimum     = 0,
              maximum     = 0xa,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          grayoutif NOT ideqval CBS_CONFIG.CbsCmnMemMbistAggrStaticLaneCtrl == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnMemMbistAggrStaticLaneVal,
              prompt      = STRING_TOKEN (0x03BE),
              help        = STRING_TOKEN (0x03BF),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
              minimum     = 0,
              maximum     = 0xa,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemMbistTgtStaticLaneCtrl,
            prompt      = STRING_TOKEN (0x03C0),
            help        = STRING_TOKEN (0x03C1),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          grayoutif NOT ideqval CBS_CONFIG.CbsCmnMemMbistTgtStaticLaneCtrl == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnMemMbistTgtStaticLaneSelU32,
              prompt      = STRING_TOKEN (0x03C2),
              help        = STRING_TOKEN (0x03C3),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
              minimum     = 0,
              maximum     = 0xFFFFFFFF,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          grayoutif NOT ideqval CBS_CONFIG.CbsCmnMemMbistTgtStaticLaneCtrl == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnMemMbistTgtStaticLaneSelL32,
              prompt      = STRING_TOKEN (0x03C4),
              help        = STRING_TOKEN (0x03C5),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
              minimum     = 0,
              maximum     = 0xa,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          grayoutif NOT ideqval CBS_CONFIG.CbsCmnMemMbistTgtStaticLaneCtrl == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnMemMbistTgtStaticLaneSelEcc,
              prompt      = STRING_TOKEN (0x03C6),
              help        = STRING_TOKEN (0x03C7),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
              minimum     = 0,
              maximum     = 0xa,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          grayoutif NOT ideqval CBS_CONFIG.CbsCmnMemMbistTgtStaticLaneCtrl == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnMemMbistTgtStaticLaneVal,
              prompt      = STRING_TOKEN (0x03C8),
              help        = STRING_TOKEN (0x03C9),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
              minimum     = 0,
              maximum     = 0xa,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemMbistReadDataEyeVoltageStep,
            prompt      = STRING_TOKEN (0x03CA),
            help        = STRING_TOKEN (0x03CB),
            option text = STRING_TOKEN (0x001B),               value = 1,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x03CC),               value = 2,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x03CD),               value = 4,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemMbistReadDataEyeTimingStep,
            prompt      = STRING_TOKEN (0x03CE),
            help        = STRING_TOKEN (0x03CF),
            option text = STRING_TOKEN (0x001B),               value = 1,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x03CC),               value = 2,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x03CD),               value = 4,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemMbistWriteDataEyeVoltageStep,
            prompt      = STRING_TOKEN (0x03D0),
            help        = STRING_TOKEN (0x03D1),
            option text = STRING_TOKEN (0x001B),               value = 1,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x03CC),               value = 2,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x03CD),               value = 4,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemMbistWriteDataEyeTimingStep,
            prompt      = STRING_TOKEN (0x03D2),
            help        = STRING_TOKEN (0x03D3),
            option text = STRING_TOKEN (0x001B),               value = 1,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x03CC),               value = 2,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x03CD),               value = 4,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemMbistDataeyeSilentExecution,
            prompt      = STRING_TOKEN (0x03D4),
            help        = STRING_TOKEN (0x03D5),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

        endform;
      
      
      
      form

        formid        = 0x70E0,

        title         = STRING_TOKEN (0x02EC);

        subtitle text = STRING_TOKEN (0x02EC);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemDataPoisoningDdr,
          prompt      = STRING_TOKEN (0x03D6),
          help        = STRING_TOKEN (0x03D7),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemBootTimePostPackageRepair,
          prompt      = STRING_TOKEN (0x03D8),
          help        = STRING_TOKEN (0x03D9),
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemRuntimePostPackageRepair,
          prompt      = STRING_TOKEN (0x03DA),
          help        = STRING_TOKEN (0x03DB),
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemPostPackageRepairConfigInitiator,
          prompt      = STRING_TOKEN (0x03DC),
          help        = STRING_TOKEN (0x03DD),
          option text = STRING_TOKEN (0x03DE),         value = 0,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x03DF),     value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemRcdParityDdr,
          prompt      = STRING_TOKEN (0x03E0),
          help        = STRING_TOKEN (0x03E1),
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnMemRcdParityDdr == 1;
          
          numeric
            varid       = CBS_CONFIG.CbsCmnMemMaxRcdParityErrorReplayDdr,
            prompt      = STRING_TOKEN (0x03E2),
            help        = STRING_TOKEN (0x03E3),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 1,
            maximum     = 0x3f,
            step        = 0,
            default     = 8,
          endnumeric;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemWriteCrcDdr,
          prompt      = STRING_TOKEN (0x03E4),
          help        = STRING_TOKEN (0x03E5),
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnMemWriteCrcDdr == 1;
          
          numeric
            varid       = CBS_CONFIG.CbsCmnMemMaxWriteCrcErrorReplayDdr,
            prompt      = STRING_TOKEN (0x03E6),
            help        = STRING_TOKEN (0x03E7),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 1,
            maximum     = 0x3f,
            step        = 0,
            default     = 0x8,
          endnumeric;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemReadCrcDdr,
          prompt      = STRING_TOKEN (0x03E8),
          help        = STRING_TOKEN (0x03E9),
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnMemReadCrcDdr == 1;
          
          numeric
            varid       = CBS_CONFIG.CbsCmnMemMaxReadCrcErrorReplayDdr,
            prompt      = STRING_TOKEN (0x03EA),
            help        = STRING_TOKEN (0x03EB),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 1,
            maximum     = 0x3F,
            step        = 0,
            default     = 8,
          endnumeric;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemDisMemErrInj,
          prompt      = STRING_TOKEN (0x03EC),
          help        = STRING_TOKEN (0x03ED),
          option text = STRING_TOKEN (0x0033),           value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0034),            value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xff, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemEcsStatusInterruptDdr,
          prompt      = STRING_TOKEN (0x03EE),
          help        = STRING_TOKEN (0x03EF),
          option text = STRING_TOKEN (0x0033),           value = 0,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0034),            value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;

        goto 0x7110,
          prompt      = STRING_TOKEN (0x03F0),
          help        = STRING_TOKEN (0x03F0);

        goto 0x7111,
          prompt      = STRING_TOKEN (0x03F1),
          help        = STRING_TOKEN (0x03F1);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemCorrectedErrorCounterEnable,
          prompt      = STRING_TOKEN (0x03F2),
          help        = STRING_TOKEN (0x03F3),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x03F4),      value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x03F5),        value = 2,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemCorrectedErrorCounterInterruptEnable,
          prompt      = STRING_TOKEN (0x03F6),
          help        = STRING_TOKEN (0x03F7),
          option text = STRING_TOKEN (0x0033),           value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0034),            value = 1,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        numeric
          varid       = CBS_CONFIG.CbsCmnMemCorrectedErrorCounterLeakRate,
          prompt      = STRING_TOKEN (0x03F8),
          help        = STRING_TOKEN (0x03F9),
          flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
          minimum     = 0x00,
          maximum     = 0x1F,
          step        = 0,
          default     = 0x17,
        endnumeric;

        
        numeric
          varid       = CBS_CONFIG.CbsCmnMemCorrectedErrorCounterStartCount,
          prompt      = STRING_TOKEN (0x03FA),
          help        = STRING_TOKEN (0x03FB),
          flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
          minimum     = 0x00,
          maximum     = 0xFFFF,
          step        = 0,
          default     = 0xDFFF,
        endnumeric;

      endform;
        
        
        
        form

          formid        = 0x7110,

          title         = STRING_TOKEN (0x03F0);

          subtitle text = STRING_TOKEN (0x03F0);
          subtitle text = STRING_TOKEN (0x0002);

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemDramEccSymbolSizeDdr,
            prompt      = STRING_TOKEN (0x03FC),
            help        = STRING_TOKEN (0x03FD),
            option text = STRING_TOKEN (0x03FE),              value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x03FF),             value = 2,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemDramEccEnDdr,
            prompt      = STRING_TOKEN (0x0400),
            help        = STRING_TOKEN (0x0401),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemDramUeccRetryDdr,
            prompt      = STRING_TOKEN (0x0402),
            help        = STRING_TOKEN (0x0403),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          grayoutif NOT ideqval CBS_CONFIG.CbsCmnMemDramUeccRetryDdr == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnMemMaxDramUeccErrorReplayDdr,
              prompt      = STRING_TOKEN (0x0404),
              help        = STRING_TOKEN (0x0405),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
              minimum     = 1,
              maximum     = 0x3F,
              step        = 0,
              default     = 8,
            endnumeric;
          endif;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemDramMemClrDdr,
            prompt      = STRING_TOKEN (0x0406),
            help        = STRING_TOKEN (0x0407),
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemAddrXorAfterEcc,
            prompt      = STRING_TOKEN (0x0408),
            help        = STRING_TOKEN (0x0409),
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsDbgMemCipherTextHiding,
            prompt      = STRING_TOKEN (0x040A),
            help        = STRING_TOKEN (0x040B),
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

        endform;
        
        
        
        form

          formid        = 0x7111,

          title         = STRING_TOKEN (0x03F1);

          subtitle text = STRING_TOKEN (0x03F1);
          subtitle text = STRING_TOKEN (0x0002);

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemDramEcsModeDdr,
            prompt      = STRING_TOKEN (0x040C),
            help        = STRING_TOKEN (0x040D),
            option text = STRING_TOKEN (0x040E),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x040F),       value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0410),      value = 2,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemDramRedirectScrubEnDdr,
            prompt      = STRING_TOKEN (0x0411),
            help        = STRING_TOKEN (0x0412),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemDramRedirectScrubLimitDdr,
            prompt      = STRING_TOKEN (0x0413),
            help        = STRING_TOKEN (0x0414),
            option text = STRING_TOKEN (0x0415),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0416),        value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0417),        value = 2,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0418),         value = 3,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemDramScrubTime,
            prompt      = STRING_TOKEN (0x0419),
            help        = STRING_TOKEN (0x041A),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x041B),          value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x041C),         value = 4,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x041D),         value = 6,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x041E),         value = 8,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x041F),        value = 12,   flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0420),        value = 16,   flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0421),        value = 24,   flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0422),        value = 48,   flags = 0 | RESET_REQUIRED;
          endoneof;

          goto 0x7112,
            prompt      = STRING_TOKEN (0x0423),
            help        = STRING_TOKEN (0x0423);

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnMemDramEcsModeDdr == 1;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnMemtECSintCtrlDdr,
              prompt      = STRING_TOKEN (0x0424),
              help        = STRING_TOKEN (0x0425),
              option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnMemDramEcsModeDdr == 1
                  OR NOT ideqval CBS_CONFIG.CbsCmnMemtECSintCtrlDdr == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnMemtECSintDdr,
              prompt      = STRING_TOKEN (0x0426),
              help        = STRING_TOKEN (0x0427),
              flags       = RESET_REQUIRED,
              minimum     = 25,
              maximum     = 1440,
              step        = 0,
              default     = 1440,
            endnumeric;
          endif;

        endform;
          
          
          
          form

            formid        = 0x7112,

            title         = STRING_TOKEN (0x0423);

            subtitle text = STRING_TOKEN (0x0423);
            subtitle text = STRING_TOKEN (0x0002);

            
            oneof
              varid       = CBS_CONFIG.CbsCmnMemDramEtcDdr,
              prompt      = STRING_TOKEN (0x0428),
              help        = STRING_TOKEN (0x0429),
              option text = STRING_TOKEN (0x042A),           value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x042B),          value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x042C),          value = 2,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x042D),         value = 3,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x042E),        value = 4,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x042F),        value = 5,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            endoneof;

            
            oneof
              varid       = CBS_CONFIG.CbsCmnMemDramEcsCountModeDdr,
              prompt      = STRING_TOKEN (0x0430),
              help        = STRING_TOKEN (0x0431),
              option text = STRING_TOKEN (0x0432),  value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0433), value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            endoneof;

            
            oneof
              varid       = CBS_CONFIG.CbsCmnMemDramAutoEcsSelfRefreshDdr,
              prompt      = STRING_TOKEN (0x0434),
              help        = STRING_TOKEN (0x0435),
              option text = STRING_TOKEN (0x0436), value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0437), value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            endoneof;

            
            oneof
              varid       = CBS_CONFIG.CbsCmnMemDramEcsWritebackSuppressionDdr,
              prompt      = STRING_TOKEN (0x0438),
              help        = STRING_TOKEN (0x0439),
              option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            endoneof;

            
            oneof
              varid       = CBS_CONFIG.CbsCmnMemDramX4WritebackSuppressionDdr,
              prompt      = STRING_TOKEN (0x043A),
              help        = STRING_TOKEN (0x043B),
              option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            endoneof;

          endform;
      
      
      
      form

        formid        = 0x70E1,

        title         = STRING_TOKEN (0x02ED);

        subtitle text = STRING_TOKEN (0x02ED);
        subtitle text = STRING_TOKEN (0x0002);

        goto 0x7113,
          prompt      = STRING_TOKEN (0x043C),
          help        = STRING_TOKEN (0x043C);

        goto 0x7114,
          prompt      = STRING_TOKEN (0x043D),
          help        = STRING_TOKEN (0x043D);

        text
          help        = STRING_TOKEN (0x0002),
          text        = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemOdtImpedProcDdr,
          prompt      = STRING_TOKEN (0x043E),
          help        = STRING_TOKEN (0x043F),
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0440),  value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0441),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0442),         value = 2,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0443),         value = 3,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0444),         value = 4,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0445),          value = 5,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0446),          value = 6,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0447),    value = 7,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0448),          value = 0xC,  flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0449),    value = 0xD,  flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x044A),          value = 0xE,  flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x044B),    value = 0xF,  flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x044C),          value = 0x1C, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x044D),    value = 0x1D, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x044E),    value = 0x1E, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x044F),          value = 0x1F, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0450),          value = 0x3C, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0451),    value = 0x3D, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0452),    value = 0x3E, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0453),    value = 0x3F, flags = 0 | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemOdtPullDownImpedProcDdr,
          prompt      = STRING_TOKEN (0x0454),
          help        = STRING_TOKEN (0x0455),
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0440),  value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0441),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0442),         value = 2,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0443),         value = 3,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0444),         value = 4,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0445),          value = 5,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0446),          value = 6,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0447),    value = 7,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0448),          value = 0xC,  flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0449),    value = 0xD,  flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x044A),          value = 0xE,  flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x044B),    value = 0xF,  flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x044C),          value = 0x1C, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x044D),    value = 0x1D, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x044E),    value = 0x1E, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x044F),          value = 0x1F, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0450),          value = 0x3C, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0451),    value = 0x3D, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0452),    value = 0x3E, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0453),    value = 0x3F, flags = 0 | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemDramDrvStrenDqDdr,
          prompt      = STRING_TOKEN (0x0456),
          help        = STRING_TOKEN (0x0457),
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x044A),          value = 2,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x044C),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0458),          value = 0,    flags = 0 | RESET_REQUIRED;
        endoneof;

      endform;
        
        
        
        form

          formid        = 0x7113,

          title         = STRING_TOKEN (0x043C);

          subtitle text = STRING_TOKEN (0x043C);
          subtitle text = STRING_TOKEN (0x0002);

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemRttNomWrP0Ddr,
            prompt      = STRING_TOKEN (0x0459),
            help        = STRING_TOKEN (0x045A),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045B),         value = 0x0,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045C),         value = 0x1,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045D),       value = 0x2,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045E),        value = 0x3,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045F),        value = 0x4,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0460),        value = 0x5,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0461),        value = 0x6,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0462),        value = 0x7,  flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemRttNomRdP0Ddr,
            prompt      = STRING_TOKEN (0x0463),
            help        = STRING_TOKEN (0x0464),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045B),         value = 0x0,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045C),         value = 0x1,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045D),       value = 0x2,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045E),        value = 0x3,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045F),        value = 0x4,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0460),        value = 0x5,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0461),        value = 0x6,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0462),        value = 0x7,  flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemRttWrP0Ddr,
            prompt      = STRING_TOKEN (0x0465),
            help        = STRING_TOKEN (0x0466),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045B),         value = 0x0,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045C),         value = 0x1,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045D),       value = 0x2,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045E),        value = 0x3,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045F),        value = 0x4,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0460),        value = 0x5,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0461),        value = 0x6,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0462),        value = 0x7,  flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemRttParkP0Ddr,
            prompt      = STRING_TOKEN (0x0467),
            help        = STRING_TOKEN (0x0468),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045B),         value = 0x0,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045C),         value = 0x1,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045D),       value = 0x2,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045E),        value = 0x3,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045F),        value = 0x4,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0460),        value = 0x5,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0461),        value = 0x6,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0462),        value = 0x7,  flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemRttParkDqsP0Ddr,
            prompt      = STRING_TOKEN (0x0469),
            help        = STRING_TOKEN (0x046A),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045B),         value = 0x0,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045C),         value = 0x1,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045D),       value = 0x2,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045E),        value = 0x3,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045F),        value = 0x4,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0460),        value = 0x5,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0461),        value = 0x6,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0462),        value = 0x7,  flags = 0 | RESET_REQUIRED;
          endoneof;

        endform;
        
        
        
        form

          formid        = 0x7114,

          title         = STRING_TOKEN (0x043D);

          subtitle text = STRING_TOKEN (0x043D);
          subtitle text = STRING_TOKEN (0x0002);

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemRttNomWrP1Ddr,
            prompt      = STRING_TOKEN (0x046B),
            help        = STRING_TOKEN (0x046C),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045B),         value = 0x0,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045C),         value = 0x1,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045D),       value = 0x2,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045E),        value = 0x3,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045F),        value = 0x4,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0460),        value = 0x5,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0461),        value = 0x6,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0462),        value = 0x7,  flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemRttNomRdP1Ddr,
            prompt      = STRING_TOKEN (0x046D),
            help        = STRING_TOKEN (0x046E),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045B),         value = 0x0,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045C),         value = 0x1,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045D),       value = 0x2,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045E),        value = 0x3,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045F),        value = 0x4,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0460),        value = 0x5,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0461),        value = 0x6,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0462),        value = 0x7,  flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemRttWrP1Ddr,
            prompt      = STRING_TOKEN (0x046F),
            help        = STRING_TOKEN (0x0470),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045B),         value = 0x0,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045C),         value = 0x1,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045D),       value = 0x2,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045E),        value = 0x3,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045F),        value = 0x4,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0460),        value = 0x5,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0461),        value = 0x6,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0462),        value = 0x7,  flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemRttParkP1Ddr,
            prompt      = STRING_TOKEN (0x0471),
            help        = STRING_TOKEN (0x0472),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045B),         value = 0x0,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045C),         value = 0x1,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045D),       value = 0x2,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045E),        value = 0x3,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045F),        value = 0x4,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0460),        value = 0x5,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0461),        value = 0x6,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0462),        value = 0x7,  flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemRttParkDqsP1Ddr,
            prompt      = STRING_TOKEN (0x0473),
            help        = STRING_TOKEN (0x0474),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045B),         value = 0x0,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045C),         value = 0x1,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045D),       value = 0x2,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045E),        value = 0x3,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x045F),        value = 0x4,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0460),        value = 0x5,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0461),        value = 0x6,  flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0462),        value = 0x7,  flags = 0 | RESET_REQUIRED;
          endoneof;

        endform;
      
      
      
      form

        formid        = 0x70E2,

        title         = STRING_TOKEN (0x02EE);

        subtitle text = STRING_TOKEN (0x02EE);
        subtitle text = STRING_TOKEN (0x0002);

        
        text
          help        = STRING_TOKEN (0x0476),
          text        = STRING_TOKEN (0x0475);

        
        text
          help        = STRING_TOKEN (0x0478),
          text        = STRING_TOKEN (0x0477);

        goto 0x7003,
          prompt      = STRING_TOKEN (0x0479),
          help        = STRING_TOKEN (0x0479);

        goto 0x7116,
          prompt      = STRING_TOKEN (0x047A),
          help        = STRING_TOKEN (0x047A);

      endform;
        
        
        
        form

          formid        = 0x7115,

          title         = STRING_TOKEN (0x0479);

          subtitle text = STRING_TOKEN (0x0479);
          subtitle text = STRING_TOKEN (0x0002);

        endform;
        
        
        
        form

          formid        = 0x7116,

          title         = STRING_TOKEN (0x047A);

          subtitle text = STRING_TOKEN (0x047A);
          subtitle text = STRING_TOKEN (0x0002);

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemTimingSettingDdr,
            prompt      = STRING_TOKEN (0x047B),
            help        = STRING_TOKEN (0x047C),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED;
          endoneof;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnMemTargetSpeedDdr,
              prompt      = STRING_TOKEN (0x047D),
              help        = STRING_TOKEN (0x047E),
              option text = STRING_TOKEN (0x001A),            value = 0xFFFF, flags = DEFAULT | RESET_REQUIRED;
              option text = STRING_TOKEN (0x047F),            value = 3600, flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0480),            value = 4000, flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0481),            value = 4400, flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0482),            value = 4800, flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0483),            value = 5200, flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0484),            value = 5600, flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0485),            value = 6000, flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0486),            value = 6400, flags = 0 | RESET_REQUIRED;
            endoneof;
          endif;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
            goto 0x7117,
              prompt      = STRING_TOKEN (0x0487),
              help        = STRING_TOKEN (0x0487);
          endif;

          
          grayoutif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
            goto 0x7118,
              prompt      = STRING_TOKEN (0x0488),
              help        = STRING_TOKEN (0x0488);
          endif;

        endform;
          
          
          
          form

            formid        = 0x7117,

            title         = STRING_TOKEN (0x0487);

            subtitle text = STRING_TOKEN (0x0487);
            subtitle text = STRING_TOKEN (0x0002);

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTclCtrlDdr,
                prompt      = STRING_TOKEN (0x0489),
                help        = STRING_TOKEN (0x048A),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTclCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTclDdr,
                questionid  = 0x7119,
                prompt      = STRING_TOKEN (0x048B),
                help        = STRING_TOKEN (0x048C),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED | INTERACTIVE,
                minimum     = 0x9,
                maximum     = 0x32,
                step        = 0,
                default     = 0x16,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTrcdCtrlDdr,
                prompt      = STRING_TOKEN (0x048D),
                help        = STRING_TOKEN (0x048E),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTrcdCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTrcdDdr,
                prompt      = STRING_TOKEN (0x048F),
                help        = STRING_TOKEN (0x0490),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x8,
                maximum     = 0x3F,
                step        = 0,
                default     = 8,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTrpCtrlDdr,
                prompt      = STRING_TOKEN (0x0491),
                help        = STRING_TOKEN (0x0492),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTrpCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTrpDdr,
                prompt      = STRING_TOKEN (0x0493),
                help        = STRING_TOKEN (0x0494),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x8,
                maximum     = 0x3F,
                step        = 0,
                default     = 8,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTrasCtrlDdr,
                prompt      = STRING_TOKEN (0x0495),
                help        = STRING_TOKEN (0x0496),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTrasCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTrasDdr,
                prompt      = STRING_TOKEN (0x0497),
                help        = STRING_TOKEN (0x0498),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x20,
                maximum     = 0x75,
                step        = 0,
                default     = 0x27,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTrcCtrlDdr,
                prompt      = STRING_TOKEN (0x0499),
                help        = STRING_TOKEN (0x049A),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTrcCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTrcDdr,
                prompt      = STRING_TOKEN (0x049B),
                help        = STRING_TOKEN (0x049C),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x1D,
                maximum     = 0x87,
                step        = 0,
                default     = 0x39,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTwrCtrlDdr,
                prompt      = STRING_TOKEN (0x049D),
                help        = STRING_TOKEN (0x049E),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTwrCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTwrDdr,
                prompt      = STRING_TOKEN (0x049F),
                help        = STRING_TOKEN (0x04A0),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0xA,
                maximum     = 0x64,
                step        = 0,
                default     = 0x12,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTrfc1CtrlDdr,
                prompt      = STRING_TOKEN (0x04A1),
                help        = STRING_TOKEN (0x04A2),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTrfc1CtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTrfc1Ddr,
                prompt      = STRING_TOKEN (0x04A3),
                help        = STRING_TOKEN (0x04A4),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x3C,
                maximum     = 0x3DE,
                step        = 0,
                default     = 0x138,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTrfc2CtrlDdr,
                prompt      = STRING_TOKEN (0x04A5),
                help        = STRING_TOKEN (0x04A6),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTrfc2CtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTrfc2Ddr,
                prompt      = STRING_TOKEN (0x04A7),
                help        = STRING_TOKEN (0x04A8),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x3C,
                maximum     = 0x3DE,
                step        = 0,
                default     = 0xC0,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTrfcSbCtrlDdr,
                prompt      = STRING_TOKEN (0x04A9),
                help        = STRING_TOKEN (0x04AA),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTrfcSbCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTrfcSbDdr,
                prompt      = STRING_TOKEN (0x04AB),
                help        = STRING_TOKEN (0x04AC),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x32,
                maximum     = 0x7FF,
                step        = 0,
                default     = 50,
              endnumeric;
            endif;

          endform;
          
          
          
          form

            formid        = 0x7118,

            title         = STRING_TOKEN (0x0488);

            subtitle text = STRING_TOKEN (0x0488);
            subtitle text = STRING_TOKEN (0x0002);

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTcwlCtrlDdr,
                prompt      = STRING_TOKEN (0x04AD),
                help        = STRING_TOKEN (0x04AE),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTcwlCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTcwlDdr,
                prompt      = STRING_TOKEN (0x04AF),
                help        = STRING_TOKEN (0x04B0),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x9,
                maximum     = 0x16,
                step        = 0,
                default     = 0x0C,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTrtpCtrlDdr,
                prompt      = STRING_TOKEN (0x04B1),
                help        = STRING_TOKEN (0x04B2),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTrtpCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTrtpDdr,
                prompt      = STRING_TOKEN (0x04B3),
                help        = STRING_TOKEN (0x04B4),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x05,
                maximum     = 0x0E,
                step        = 0,
                default     = 0x09,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTrrdLCtrlDdr,
                prompt      = STRING_TOKEN (0x04B5),
                help        = STRING_TOKEN (0x04B6),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTrrdLCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTrrdLDdr,
                prompt      = STRING_TOKEN (0x04B7),
                help        = STRING_TOKEN (0x04B8),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x04,
                maximum     = 0x0C,
                step        = 0,
                default     = 0x04,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTrrdSCtrlDdr,
                prompt      = STRING_TOKEN (0x04B9),
                help        = STRING_TOKEN (0x04BA),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTrrdSCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTrrdSDdr,
                prompt      = STRING_TOKEN (0x04BB),
                help        = STRING_TOKEN (0x04BC),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x04,
                maximum     = 0x0C,
                step        = 0,
                default     = 0x04,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTfawCtrlDdr,
                prompt      = STRING_TOKEN (0x04BD),
                help        = STRING_TOKEN (0x04BE),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTfawCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTfawDdr,
                prompt      = STRING_TOKEN (0x04BF),
                help        = STRING_TOKEN (0x04C0),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x6,
                maximum     = 0x36,
                step        = 0,
                default     = 0x1A,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTwtrLCtrlDdr,
                prompt      = STRING_TOKEN (0x04C1),
                help        = STRING_TOKEN (0x04C2),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTwtrLCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTwtrLDdr,
                prompt      = STRING_TOKEN (0x04C3),
                help        = STRING_TOKEN (0x04C4),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x02,
                maximum     = 0x0E,
                step        = 0,
                default     = 0x03,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTwtrSCtrlDdr,
                prompt      = STRING_TOKEN (0x04C5),
                help        = STRING_TOKEN (0x04C6),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTwtrSCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTwtrSDdr,
                prompt      = STRING_TOKEN (0x04C7),
                help        = STRING_TOKEN (0x04C8),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x02,
                maximum     = 0x0E,
                step        = 0,
                default     = 0x03,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTrdrdScLCtrlDdr,
                prompt      = STRING_TOKEN (0x04C9),
                help        = STRING_TOKEN (0x04CA),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTrdrdScLCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTrdrdScLDdr,
                prompt      = STRING_TOKEN (0x04CB),
                help        = STRING_TOKEN (0x04CC),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x1,
                maximum     = 0xF,
                step        = 0,
                default     = 0x1,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTrdrdScCtrlDdr,
                prompt      = STRING_TOKEN (0x04CD),
                help        = STRING_TOKEN (0x04CE),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTrdrdScCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTrdrdScDdr,
                prompt      = STRING_TOKEN (0x04CF),
                help        = STRING_TOKEN (0x04D0),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x1,
                maximum     = 0xF,
                step        = 0,
                default     = 0x1,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTrdrdSdCtrlDdr,
                prompt      = STRING_TOKEN (0x04D1),
                help        = STRING_TOKEN (0x04D2),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTrdrdSdCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTrdrdSdDdr,
                prompt      = STRING_TOKEN (0x04D3),
                help        = STRING_TOKEN (0x04D4),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x1,
                maximum     = 0xF,
                step        = 0,
                default     = 0x3,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTrdrdDdCtrlDdr,
                prompt      = STRING_TOKEN (0x04D5),
                help        = STRING_TOKEN (0x04D6),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTrdrdDdCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTrdrdDdDdr,
                prompt      = STRING_TOKEN (0x04D7),
                help        = STRING_TOKEN (0x04D8),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x1,
                maximum     = 0xF,
                step        = 0,
                default     = 0x3,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTwrwrScLCtrlDdr,
                prompt      = STRING_TOKEN (0x04D9),
                help        = STRING_TOKEN (0x04DA),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTwrwrScLCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTwrwrScLDdr,
                prompt      = STRING_TOKEN (0x04DB),
                help        = STRING_TOKEN (0x04DC),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x1,
                maximum     = 0x3f,
                step        = 0,
                default     = 0x1,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTwrwrScCtrlDdr,
                prompt      = STRING_TOKEN (0x04DD),
                help        = STRING_TOKEN (0x04DE),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTwrwrScCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTwrwrScDdr,
                prompt      = STRING_TOKEN (0x04DF),
                help        = STRING_TOKEN (0x04E0),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x1,
                maximum     = 0xF,
                step        = 0,
                default     = 0x1,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTwrwrSdCtrlDdr,
                prompt      = STRING_TOKEN (0x04E1),
                help        = STRING_TOKEN (0x04E2),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTwrwrSdCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTwrwrSdDdr,
                prompt      = STRING_TOKEN (0x04E3),
                help        = STRING_TOKEN (0x04E4),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x1,
                maximum     = 0xF,
                step        = 0,
                default     = 0x3,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTwrwrDdCtrlDdr,
                prompt      = STRING_TOKEN (0x04E5),
                help        = STRING_TOKEN (0x04E6),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTwrwrDdCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTwrwrDdDdr,
                prompt      = STRING_TOKEN (0x04E7),
                help        = STRING_TOKEN (0x04E8),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x1,
                maximum     = 0xF,
                step        = 0,
                default     = 0x3,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTwrrdCtrlDdr,
                prompt      = STRING_TOKEN (0x04E9),
                help        = STRING_TOKEN (0x04EA),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTwrrdCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTwrrdDdr,
                prompt      = STRING_TOKEN (0x04EB),
                help        = STRING_TOKEN (0x04EC),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x1,
                maximum     = 0xF,
                step        = 0,
                default     = 0x1,
              endnumeric;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1;
              
              oneof
                varid       = CBS_CONFIG.CbsCmnMemTimingTrdwrCtrlDdr,
                prompt      = STRING_TOKEN (0x04ED),
                help        = STRING_TOKEN (0x04EE),
                option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
              endoneof;
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsCmnMemTimingSettingDdr == 1
                    OR NOT ideqval CBS_CONFIG.CbsCmnMemTimingTrdwrCtrlDdr == 1;
              
              numeric
                varid       = CBS_CONFIG.CbsCmnMemTimingTrdwrDdr,
                prompt      = STRING_TOKEN (0x04EF),
                help        = STRING_TOKEN (0x04F0),
                flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                minimum     = 0x1,
                maximum     = 0xF,
                step        = 0,
                default     = 0x5,
              endnumeric;
            endif;

          endform;
      
      
      
      form

        formid        = 0x70E3,

        title         = STRING_TOKEN (0x02EF);

        subtitle text = STRING_TOKEN (0x02EF);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemDramPdaEnumIdProgModeDdr,
          prompt      = STRING_TOKEN (0x04F1),
          help        = STRING_TOKEN (0x04F2),
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x04F3), value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x04F4), value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;

        goto 0x711A,
          prompt      = STRING_TOKEN (0x04F5),
          help        = STRING_TOKEN (0x04F5);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemWriteTrainingBurstLength,
          prompt      = STRING_TOKEN (0x04F6),
          help        = STRING_TOKEN (0x04F7),
          option text = STRING_TOKEN (0x036B),              value = 2,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x04F8),              value = 3,    flags = 0 | RESET_REQUIRED;
        endoneof;

      endform;
        
        
        
        form

          formid        = 0x711A,

          title         = STRING_TOKEN (0x04F5);

          subtitle text = STRING_TOKEN (0x04F5);
          subtitle text = STRING_TOKEN (0x0002);

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemPeriodicTrainingModeDdr,
            prompt      = STRING_TOKEN (0x04F9),
            help        = STRING_TOKEN (0x04FA),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x04FB),          value = 1,    flags = DEFAULT | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemPeriodicIntervalMode,
            prompt      = STRING_TOKEN (0x04FC),
            help        = STRING_TOKEN (0x04FD),
            option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnMemPeriodicIntervalMode == 1;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnMemPeriodicInterval,
              prompt      = STRING_TOKEN (0x04FE),
              help        = STRING_TOKEN (0x04FF),
              flags       = RESET_REQUIRED,
              minimum     = 100,
              maximum     = 4095,
              step        = 0,
              default     = 1000,
            endnumeric;
          endif;

        endform;
      
      
      
      form

        formid        = 0x70E4,

        title         = STRING_TOKEN (0x02F0);

        subtitle text = STRING_TOKEN (0x02F0);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemTsmeEnableDdr,
          questionid  = 0x711B,
          prompt      = STRING_TOKEN (0x0500),
          help        = STRING_TOKEN (0x0501),
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemAes,
          prompt      = STRING_TOKEN (0x0502),
          help        = STRING_TOKEN (0x0503),
          option text = STRING_TOKEN (0x0504),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0505),         value = 1,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemDataScramble,
          questionid  = 0x711C,
          prompt      = STRING_TOKEN (0x0506),
          help        = STRING_TOKEN (0x0507),
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
        endoneof;

        
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnCpuSmee == 0
              AND NOT ideqval CBS_CONFIG.CbsCmnCpuSmee == 3;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemSmeMkEnable,
            prompt      = STRING_TOKEN (0x0508),
            help        = STRING_TOKEN (0x0509),
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED;
          endoneof;
        endif;

      endform;
      
      
      
      form

        formid        = 0x70E5,

        title         = STRING_TOKEN (0x02F1);

        subtitle text = STRING_TOKEN (0x02F1);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnPmicErrorReporting,
          prompt      = STRING_TOKEN (0x050A),
          help        = STRING_TOKEN (0x050B),
          option text = STRING_TOKEN (0x0033),           value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0034),            value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemCtrllerPmicOpMode,
          prompt      = STRING_TOKEN (0x050C),
          help        = STRING_TOKEN (0x050D),
          option text = STRING_TOKEN (0x050E),     value = 0,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x050F), value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemCtrllerPmicFaultRecovery,
          prompt      = STRING_TOKEN (0x0510),
          help        = STRING_TOKEN (0x0511),
          option text = STRING_TOKEN (0x0512),          value = 0,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0513),           value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0514),            value = 2,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        numeric
          varid       = CBS_CONFIG.CbsCmnMemCtrllerPmicSwaSwbVddCore,
          prompt      = STRING_TOKEN (0x0515),
          help        = STRING_TOKEN (0x0516),
          flags       = RESET_REQUIRED,
          minimum     = 1000,
          maximum     = 1200,
          step        = 0,
          default     = 1100,
        endnumeric;

        
        numeric
          varid       = CBS_CONFIG.CbsCmnMemCtrllerPmicSwcVddio,
          prompt      = STRING_TOKEN (0x0517),
          help        = STRING_TOKEN (0x0518),
          flags       = RESET_REQUIRED,
          minimum     = 1000,
          maximum     = 1200,
          step        = 0,
          default     = 1100,
        endnumeric;

        
        numeric
          varid       = CBS_CONFIG.CbsCmnMemCtrllerPmicSwdVpp,
          prompt      = STRING_TOKEN (0x0519),
          help        = STRING_TOKEN (0x051A),
          flags       = RESET_REQUIRED,
          minimum     = 1500,
          maximum     = 2135,
          step        = 0,
          default     = 1800,
        endnumeric;

        
        numeric
          varid       = CBS_CONFIG.CbsCmnMemCtrllerPmicStaggerDelay,
          prompt      = STRING_TOKEN (0x051B),
          help        = STRING_TOKEN (0x051C),
          flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
          minimum     = 0,
          maximum     = 0xFF,
          step        = 0,
          default     = 5,
        endnumeric;

        
        numeric
          varid       = CBS_CONFIG.CbsCmnMemCtrllerMaxPmicPowerOn,
          prompt      = STRING_TOKEN (0x051D),
          help        = STRING_TOKEN (0x051E),
          flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
          minimum     = 1,
          maximum     = 0xFF,
          step        = 0,
          default     = 0xFF,
        endnumeric;

      endform;
      
      
      
      form

        formid        = 0x70E6,

        title         = STRING_TOKEN (0x02F2);

        subtitle text = STRING_TOKEN (0x02F2);
        subtitle text = STRING_TOKEN (0x0002);

        
        grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnMemOdtsCmdThrottleCycleCtlDdr,
            prompt      = STRING_TOKEN (0x051F),
            help        = STRING_TOKEN (0x0520),
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          endoneof;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnMemOdtsCmdThrottleThresholdDdr,
          prompt      = STRING_TOKEN (0x0521),
          help        = STRING_TOKEN (0x0522),
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0523),            value = 3,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0524),            value = 4,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0525),            value = 5,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnTsodThermalThrottleControlDdr,
          prompt      = STRING_TOKEN (0x0526),
          help        = STRING_TOKEN (0x0527),
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnTsodThermalThrottleControlDdr == 1;
          
          numeric
            varid       = CBS_CONFIG.CbsCmnTsodThermalThrottleStartTempDdr,
            prompt      = STRING_TOKEN (0x0528),
            help        = STRING_TOKEN (0x0529),
            flags       = RESET_REQUIRED,
            minimum     = 40,
            maximum     = 100,
            step        = 0,
            default     = 85,
          endnumeric;
        endif;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnTsodThermalThrottleControlDdr == 1;
          
          numeric
            varid       = CBS_CONFIG.CbsCmnTsodThermalThrottleHysteresisDdr,
            prompt      = STRING_TOKEN (0x052A),
            help        = STRING_TOKEN (0x052B),
            flags       = RESET_REQUIRED,
            minimum     = 1,
            maximum     = 50,
            step        = 0,
            default     = 5,
          endnumeric;
        endif;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnTsodThermalThrottleControlDdr == 1;
          
          numeric
            varid       = CBS_CONFIG.CbsCmnTsodCmdThrottlePercentage0Ddr,
            prompt      = STRING_TOKEN (0x052C),
            help        = STRING_TOKEN (0x052D),
            flags       = RESET_REQUIRED,
            minimum     = 0,
            maximum     = 80,
            step        = 0,
            default     = 10,
          endnumeric;
        endif;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnTsodThermalThrottleControlDdr == 1;
          
          numeric
            varid       = CBS_CONFIG.CbsCmnTsodCmdThrottlePercentage5Ddr,
            prompt      = STRING_TOKEN (0x052E),
            help        = STRING_TOKEN (0x052F),
            flags       = RESET_REQUIRED,
            minimum     = 0,
            maximum     = 80,
            step        = 0,
            default     = 20,
          endnumeric;
        endif;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnTsodThermalThrottleControlDdr == 1;
          
          numeric
            varid       = CBS_CONFIG.CbsCmnTsodCmdThrottlePercentage10Ddr,
            prompt      = STRING_TOKEN (0x0530),
            help        = STRING_TOKEN (0x0531),
            flags       = RESET_REQUIRED,
            minimum     = 0,
            maximum     = 80,
            step        = 0,
            default     = 40,
          endnumeric;
        endif;

      endform;
      
      
      
      form

        formid        = 0x70E7,

        title         = STRING_TOKEN (0x02F3);

        subtitle text = STRING_TOKEN (0x02F3);
        subtitle text = STRING_TOKEN (0x0002);

      endform;
    
    
    
    form

      formid        = 0x7004,

      title         = STRING_TOKEN (0x000A);

      subtitle text = STRING_TOKEN (0x000A);
      subtitle text = STRING_TOKEN (0x0002);

      goto 0x711D,
        prompt      = STRING_TOKEN (0x0532),
        help        = STRING_TOKEN (0x0532);

      goto 0x711E,
        prompt      = STRING_TOKEN (0x0533),
        help        = STRING_TOKEN (0x0533);

      goto 0x711F,
        prompt      = STRING_TOKEN (0x0534),
        help        = STRING_TOKEN (0x0534);

      goto 0x7120,
        prompt      = STRING_TOKEN (0x0535),
        help        = STRING_TOKEN (0x0535);

      goto 0x7121,
        prompt      = STRING_TOKEN (0x0536),
        help        = STRING_TOKEN (0x0536);

      goto 0x7122,
        prompt      = STRING_TOKEN (0x0537),
        help        = STRING_TOKEN (0x0537);

      goto 0x7123,
        prompt      = STRING_TOKEN (0x0538),
        help        = STRING_TOKEN (0x0538);

      text
        help        = STRING_TOKEN (0x0002),
        text        = STRING_TOKEN (0x0002);

      
      oneof
        varid       = CBS_CONFIG.CbsCmnGnbPcieLoopBackMode,
        prompt      = STRING_TOKEN (0x0539),
        help        = STRING_TOKEN (0x053A),
        option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsEnable2SpcGen4,
        prompt      = STRING_TOKEN (0x053B),
        help        = STRING_TOKEN (0x053C),
        option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsEnable2SpcGen5,
        prompt      = STRING_TOKEN (0x053D),
        help        = STRING_TOKEN (0x053E),
        option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsGnbSafeRecoveryUponABERExceededError,
        prompt      = STRING_TOKEN (0x053F),
        help        = STRING_TOKEN (0x0540),
        option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsGnbPeriodicCalibration,
        prompt      = STRING_TOKEN (0x0541),
        help        = STRING_TOKEN (0x0542),
        option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
      endoneof;

    endform;
      
      
      
      form

        formid        = 0x711D,

        title         = STRING_TOKEN (0x0532);

        subtitle text = STRING_TOKEN (0x0532);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnTDPCtl,
          prompt      = STRING_TOKEN (0x0543),
          help        = STRING_TOKEN (0x0544),
          option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnTDPCtl == 1;
          
          numeric
            varid       = CBS_CONFIG.CbsCmnTDPLimit,
            prompt      = STRING_TOKEN (0x0545),
            help        = STRING_TOKEN (0x0546),
            flags       = RESET_REQUIRED,
            minimum     = 0,
            maximum     = 0xffffffff,
            step        = 0,
            default     = 0,
          endnumeric;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnPPTCtl,
          prompt      = STRING_TOKEN (0x0547),
          help        = STRING_TOKEN (0x0548),
          option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnPPTCtl == 1;
          
          numeric
            varid       = CBS_CONFIG.CbsCmnPPTLimit,
            prompt      = STRING_TOKEN (0x0549),
            help        = STRING_TOKEN (0x054A),
            flags       = RESET_REQUIRED,
            minimum     = 0,
            maximum     = 0xffffffff,
            step        = 0,
            default     = 0,
          endnumeric;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnDeterminismCtl,
          prompt      = STRING_TOKEN (0x054B),
          help        = STRING_TOKEN (0x054C),
          option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnDeterminismCtl == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnDeterminismEnable,
            prompt      = STRING_TOKEN (0x054D),
            help        = STRING_TOKEN (0x054E),
            option text = STRING_TOKEN (0x054F),           value = 0,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0550),     value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnxGmiLinkWidthCtl,
          prompt      = STRING_TOKEN (0x0551),
          help        = STRING_TOKEN (0x0552),
          option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnxGmiLinkWidthCtl == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnxGmiForceLinkWidthCtl,
            prompt      = STRING_TOKEN (0x0553),
            help        = STRING_TOKEN (0x0554),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0555),           value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0556),         value = 0,    flags = 0 | RESET_REQUIRED;
          endoneof;
        endif;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnxGmiLinkWidthCtl == 1
                OR NOT ideqval CBS_CONFIG.CbsCmnxGmiForceLinkWidthCtl == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnxGmiForceLinkWidth,
            prompt      = STRING_TOKEN (0x0557),
            help        = STRING_TOKEN (0x0558),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x03CC),               value = 2,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001B),               value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001C),               value = 0,    flags = 0 | RESET_REQUIRED;
          endoneof;
        endif;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnxGmiLinkWidthCtl == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnxGmiMaxLinkWidthCtl,
            prompt      = STRING_TOKEN (0x0559),
            help        = STRING_TOKEN (0x055A),
            option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
          endoneof;
        endif;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnxGmiLinkWidthCtl == 1
                OR NOT ideqval CBS_CONFIG.CbsCmnxGmiMaxLinkWidthCtl == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnxGmiMaxLinkWidth,
            prompt      = STRING_TOKEN (0x055B),
            help        = STRING_TOKEN (0x055C),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x03CC),               value = 2,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001B),               value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001C),               value = 0,    flags = 0 | RESET_REQUIRED;
          endoneof;
        endif;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnxGmiLinkWidthCtl == 1
                OR NOT ideqval CBS_CONFIG.CbsCmnxGmiMaxLinkWidthCtl == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnxGmiMinLinkWidth,
            prompt      = STRING_TOKEN (0x055D),
            help        = STRING_TOKEN (0x055E),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x03CC),               value = 2,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001B),               value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001C),               value = 0,    flags = 0 | RESET_REQUIRED;
          endoneof;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnApbdis,
          prompt      = STRING_TOKEN (0x055F),
          help        = STRING_TOKEN (0x0560),
          option text = STRING_TOKEN (0x001C),               value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001B),               value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnApbdis == 1;
          
          numeric
            varid       = CBS_CONFIG.CbsCmnApbdisDfPstate,
            prompt      = STRING_TOKEN (0x0561),
            help        = STRING_TOKEN (0x0562),
            flags       = RESET_REQUIRED,
            minimum     = 0,
            maximum     = 2,
            step        = 0,
            default     = 0,
          endnumeric;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnEfficiencyModeEn,
          prompt      = STRING_TOKEN (0x0563),
          help        = STRING_TOKEN (0x0564),
          option text = STRING_TOKEN (0x0565), value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0566), value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0567), value = 2,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0568), value = 3,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0569), value = 4,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x056A), value = 5,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnXgmiPstateControl,
          prompt      = STRING_TOKEN (0x056B),
          help        = STRING_TOKEN (0x056C),
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnXgmiPstateControl == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnXgmiPstateSelection,
            prompt      = STRING_TOKEN (0x056D),
            help        = STRING_TOKEN (0x056E),
            option text = STRING_TOKEN (0x056F),      value = 0,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0570),       value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnBoostFmaxEn,
          prompt      = STRING_TOKEN (0x0571),
          help        = STRING_TOKEN (0x0572),
          option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnBoostFmaxEn == 1;
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnBoostFmaxEn == 1;
          
          numeric
            varid       = CBS_CONFIG.CbsCmnBoostFmax,
            prompt      = STRING_TOKEN (0x0573),
            help        = STRING_TOKEN (0x0574),
            flags       = RESET_REQUIRED,
            minimum     = 0,
            maximum     = 0xFFFF,
            step        = 0,
            default     = 0,
          endnumeric;
        endif;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnGnbSMUDffo,
          prompt      = STRING_TOKEN (0x0575),
          help        = STRING_TOKEN (0x0576),
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnGnbSmuDfCstates,
          questionid  = 0x7124,
          prompt      = STRING_TOKEN (0x0577),
          help        = STRING_TOKEN (0x0578),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnGnbSmuCppc,
          questionid  = 0x7125,
          prompt      = STRING_TOKEN (0x0579),
          help        = STRING_TOKEN (0x057A),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnGnbSMUHsmpSupport,
          questionid  = 0x7126,
          prompt      = STRING_TOKEN (0x057B),
          help        = STRING_TOKEN (0x057C),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnSvi3SvcSpeedCtl,
          prompt      = STRING_TOKEN (0x057D),
          help        = STRING_TOKEN (0x057E),
          option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnSvi3SvcSpeedCtl == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnSvi3SvcSpeed,
            prompt      = STRING_TOKEN (0x057F),
            help        = STRING_TOKEN (0x0580),
            option text = STRING_TOKEN (0x0581),    value = 3,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0582),    value = 5,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0583),     value = 8,    flags = 0 | RESET_REQUIRED;
          endoneof;
        endif;

        label 0x7128;
        
        oneof
          varid       = CBS_CONFIG.CbsCmnX3dStackOverride,
          questionid  = 0x7127,
          prompt      = STRING_TOKEN (0x0584),
          help        = STRING_TOKEN (0x0585),
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x0586),         value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
        endoneof;
        label 0x7129;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnL3Bist,
          prompt      = STRING_TOKEN (0x0587),
          help        = STRING_TOKEN (0x0588),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnGnbDiagMode,
          questionid  = 0x712A,
          prompt      = STRING_TOKEN (0x0589),
          help        = STRING_TOKEN (0x058A),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnGnbSmuGmiFolding,
          questionid  = 0x712B,
          prompt      = STRING_TOKEN (0x058B),
          help        = STRING_TOKEN (0x058C),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnThrottlerMode,
          prompt      = STRING_TOKEN (0x058D),
          help        = STRING_TOKEN (0x058E),
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnDFPstateRangeCtl,
          prompt      = STRING_TOKEN (0x058F),
          help        = STRING_TOKEN (0x0590),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnDFPstateRangeCtl == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnDfPstateMax,
            prompt      = STRING_TOKEN (0x0591),
            help        = STRING_TOKEN (0x0592),
            option text = STRING_TOKEN (0x0593),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0594),            value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0595),            value = 2,    flags = 0 | RESET_REQUIRED;
          endoneof;
        endif;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnDFPstateRangeCtl == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnDfPstateMin,
            prompt      = STRING_TOKEN (0x0596),
            help        = STRING_TOKEN (0x0597),
            option text = STRING_TOKEN (0x0593),            value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0594),            value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0595),            value = 2,    flags = DEFAULT | RESET_REQUIRED;
          endoneof;
        endif;

      endform;
      
      
      
      form

        formid        = 0x711E,

        title         = STRING_TOKEN (0x0533);

        subtitle text = STRING_TOKEN (0x0533);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnRASControl,
          prompt      = STRING_TOKEN (0x0598),
          help        = STRING_TOKEN (0x0599),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x059A),             value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnNBIOSyncFloodGen,
          prompt      = STRING_TOKEN (0x059B),
          help        = STRING_TOKEN (0x059C),
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.PcdSyncFloodToApml,
          prompt      = STRING_TOKEN (0x059D),
          help        = STRING_TOKEN (0x059E),
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CmnGnbAmdPcieAerReportMechanism,
          prompt      = STRING_TOKEN (0x059F),
          help        = STRING_TOKEN (0x05A0),
          option text = STRING_TOKEN (0x05A1),  value = 2,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05A2), value = 3,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05A3),        value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0x0F, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.EdpcControl,
          prompt      = STRING_TOKEN (0x05A4),
          help        = STRING_TOKEN (0x05A5),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 3,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.AcsRasValue,
          prompt      = STRING_TOKEN (0x05A6),
          help        = STRING_TOKEN (0x05A7),
          option text = STRING_TOKEN (0x05A8), value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05A9), value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05AA), value = 2,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnPoisonConsumption,
          prompt      = STRING_TOKEN (0x05AB),
          help        = STRING_TOKEN (0x05AC),
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnGnbRasSyncfloodPcieFatalError,
          prompt      = STRING_TOKEN (0x05AD),
          help        = STRING_TOKEN (0x05AE),
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0034),            value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0033),           value = 0,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnRASNumericalCommonOptions,
          prompt      = STRING_TOKEN (0x05AF),
          help        = STRING_TOKEN (0x05B0),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0195),          value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnRASNumericalCommonOptions == 1;
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnRASNumericalCommonOptions == 1;
          
          numeric
            varid       = CBS_CONFIG.PcdEgressPoisonSeverityHi,
            prompt      = STRING_TOKEN (0x05B1),
            help        = STRING_TOKEN (0x05B2),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0,
            maximum     = 0xffffffff,
            step        = 0,
            default     = 0x00030011,
          endnumeric;
        endif;
        endif;

        
        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnRASNumericalCommonOptions == 1;
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnRASNumericalCommonOptions == 1;
          
          numeric
            varid       = CBS_CONFIG.PcdEgressPoisonSeverityLo,
            prompt      = STRING_TOKEN (0x05B3),
            help        = STRING_TOKEN (0x05B4),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0,
            maximum     = 0xffffffff,
            step        = 0,
            default     = 0x00000004,
          endnumeric;
        endif;
        endif;

        
        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnRASNumericalCommonOptions == 1;
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnRASNumericalCommonOptions == 1;
          
          numeric
            varid       = CBS_CONFIG.PcdAmdNbioEgressPoisonMaskHi,
            prompt      = STRING_TOKEN (0x05B5),
            help        = STRING_TOKEN (0x05B6),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0,
            maximum     = 0xffffffff,
            step        = 0,
            default     = 0xFFFCFFFF,
          endnumeric;
        endif;
        endif;

        
        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnRASNumericalCommonOptions == 1;
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnRASNumericalCommonOptions == 1;
          
          numeric
            varid       = CBS_CONFIG.PcdAmdNbioEgressPoisonMaskLo,
            prompt      = STRING_TOKEN (0x05B7),
            help        = STRING_TOKEN (0x05B8),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0,
            maximum     = 0xffffffff,
            step        = 0,
            default     = 0xFFFFFFFB,
          endnumeric;
        endif;
        endif;

        
        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnRASNumericalCommonOptions == 1;
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnRASNumericalCommonOptions == 1;
          
          numeric
            varid       = CBS_CONFIG.PcdAmdNbioRASUcpMaskHi,
            prompt      = STRING_TOKEN (0x05B9),
            help        = STRING_TOKEN (0x05BA),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0,
            maximum     = 0xffffffff,
            step        = 0,
            default     = 0x00030000,
          endnumeric;
        endif;
        endif;

        
        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnRASNumericalCommonOptions == 1;
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnRASNumericalCommonOptions == 1;
          
          numeric
            varid       = CBS_CONFIG.PcdAmdNbioRASUcpMaskLo,
            prompt      = STRING_TOKEN (0x05BB),
            help        = STRING_TOKEN (0x05BC),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0,
            maximum     = 0xffffffff,
            step        = 0,
            default     = 0x00000004,
          endnumeric;
        endif;
        endif;

        
        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnRASNumericalCommonOptions == 1;
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnRASNumericalCommonOptions == 1;
          
          numeric
            varid       = CBS_CONFIG.PcdSyshubWdtTimerInterval,
            prompt      = STRING_TOKEN (0x05BD),
            help        = STRING_TOKEN (0x05BE),
            flags       = RESET_REQUIRED,
            minimum     = 0,
            maximum     = 5200,
            step        = 0,
            default     = 2600,
          endnumeric;
        endif;
        endif;

      endform;
      
      
      
      form

        formid        = 0x711F,

        title         = STRING_TOKEN (0x0534);

        subtitle text = STRING_TOKEN (0x0534);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnGnbDataObjectExchange,
          prompt      = STRING_TOKEN (0x05BF),
          help        = STRING_TOKEN (0x05C0),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnGnbRtmMarginingSupport,
          prompt      = STRING_TOKEN (0x05C1),
          help        = STRING_TOKEN (0x05C2),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnNbioForceSpeedLastAdvertised,
          prompt      = STRING_TOKEN (0x05C3),
          help        = STRING_TOKEN (0x05C4),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnLcMultUpstreamAuto,
          prompt      = STRING_TOKEN (0x05C5),
          help        = STRING_TOKEN (0x05C6),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.STRAP_COMPLIANCE_DIS,
          prompt      = STRING_TOKEN (0x05C7),
          help        = STRING_TOKEN (0x05C8),
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 0,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnNbioPcieAdvertiseEqToHighRateSupport,
          prompt      = STRING_TOKEN (0x05C9),
          help        = STRING_TOKEN (0x05CA),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnGnbDataLinkFeatureCap,
          prompt      = STRING_TOKEN (0x05CB),
          help        = STRING_TOKEN (0x05CC),
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnGnbDataLinkFeatureCap == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnGnbDataLinkFeatureExchange,
            prompt      = STRING_TOKEN (0x05CD),
            help        = STRING_TOKEN (0x05CE),
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
          endoneof;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnGnbSris,
          prompt      = STRING_TOKEN (0x05CF),
          help        = STRING_TOKEN (0x05D0),
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsDbgGnbDbgAERCAPEnable == 1
               AND NOT ideqval CBS_CONFIG.CbsDbgGnbDbgAERCAPEnable == 0xF;
          
          oneof
            varid       = CBS_CONFIG.CbsDbgGnbDbgACSEnable,
            prompt      = STRING_TOKEN (0x05D1),
            help        = STRING_TOKEN (0x05D2),
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
          endoneof;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsGnbCmnPcieTbtSupport,
          prompt      = STRING_TOKEN (0x05D3),
          help        = STRING_TOKEN (0x05D4),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsGnbCmnPcieAriEnumeration,
          prompt      = STRING_TOKEN (0x05D5),
          help        = STRING_TOKEN (0x05D6),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CmnGnbPcieAriSupport,
          prompt      = STRING_TOKEN (0x05D7),
          help        = STRING_TOKEN (0x05D8),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsPresenceDetectSelectmode,
          prompt      = STRING_TOKEN (0x05D9),
          help        = STRING_TOKEN (0x05DA),
          option text = STRING_TOKEN (0x05DB),              value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05DC),             value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05DD),    value = 2,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05DE), value = 3,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsHotPlugHandlingMode,
          prompt      = STRING_TOKEN (0x05DF),
          help        = STRING_TOKEN (0x05E0),
          option text = STRING_TOKEN (0x05A3),        value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05E1), value = 3,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05A2), value = 6,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05E2), value = 5,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsHotPlugPDSettle,
          prompt      = STRING_TOKEN (0x05E3),
          help        = STRING_TOKEN (0x05E4),
          option text = STRING_TOKEN (0x001A),            value = 0,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0034),            value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0033),           value = 0,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        numeric
          varid       = CBS_CONFIG.CbsHotPlugSettleTime,
          prompt      = STRING_TOKEN (0x05E5),
          help        = STRING_TOKEN (0x05E6),
          flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
          minimum     = 1,
          maximum     = 255,
          step        = 0,
          default     = 255,
        endnumeric;

        
        oneof
          varid       = CBS_CONFIG.CbsHotplugSupport,
          prompt      = STRING_TOKEN (0x05E7),
          help        = STRING_TOKEN (0x05E8),
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnEarlyLinkSpeed,
          prompt      = STRING_TOKEN (0x05E9),
          help        = STRING_TOKEN (0x05EA),
          option text = STRING_TOKEN (0x05EB),             value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05EC),            value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05ED),            value = 2,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsDbgGnbDbgAERCAPEnable,
          prompt      = STRING_TOKEN (0x05EE),
          help        = STRING_TOKEN (0x05EF),
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnPcieCAPLinkSpeed,
          prompt      = STRING_TOKEN (0x05F0),
          help        = STRING_TOKEN (0x05F1),
          option text = STRING_TOKEN (0x05F2),   value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05EC),            value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05ED),            value = 2,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05F3),            value = 3,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05F4),            value = 4,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05F5),            value = 5,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnPcieTargetLinkSpeed,
          prompt      = STRING_TOKEN (0x05F6),
          help        = STRING_TOKEN (0x05F7),
          option text = STRING_TOKEN (0x05F2),   value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05EC),            value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05ED),            value = 2,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05F3),            value = 3,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05F4),            value = 4,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05F5),            value = 5,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnAllPortsASPM,
          prompt      = STRING_TOKEN (0x05F8),
          help        = STRING_TOKEN (0x05F9),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x05FA),              value = 2,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnNbioMctpEn,
          prompt      = STRING_TOKEN (0x05FB),
          help        = STRING_TOKEN (0x05FC),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnNbioMctpEn == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnNbioMctpMode,
            prompt      = STRING_TOKEN (0x05FD),
            help        = STRING_TOKEN (0x05FE),
            option text = STRING_TOKEN (0x05FF),     value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0600), value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          endoneof;
        endif;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnNbioMctpEn == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnNbioMctpDiscoveryNotifyMessage,
            prompt      = STRING_TOKEN (0x0601),
            help        = STRING_TOKEN (0x0602),
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
          endoneof;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnNbioPcieNonPcieCompliantSupport,
          prompt      = STRING_TOKEN (0x0603),
          help        = STRING_TOKEN (0x0604),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnLimitHpDevicesToPcieBootSpeed,
          prompt      = STRING_TOKEN (0x0605),
          help        = STRING_TOKEN (0x0606),
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnPCIeSFIConfigviaOOBEn,
          prompt      = STRING_TOKEN (0x0607),
          help        = STRING_TOKEN (0x0608),
          option text = STRING_TOKEN (0x0034),            value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0033),           value = 0,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnNbioPcieIdlePowerSetting,
          prompt      = STRING_TOKEN (0x0609),
          help        = STRING_TOKEN (0x060A),
          option text = STRING_TOKEN (0x060B), value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x060C), value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

      endform;
      
      
      
      form

        formid        = 0x7120,

        title         = STRING_TOKEN (0x0535);

        subtitle text = STRING_TOKEN (0x0535);
        subtitle text = STRING_TOKEN (0x0002);

        goto 0x712C,
          prompt      = STRING_TOKEN (0x060D),
          help        = STRING_TOKEN (0x060D);

      endform;
        
        
        
        form

          formid        = 0x712C,

          title         = STRING_TOKEN (0x060D);

          subtitle text = STRING_TOKEN (0x060D);
          subtitle text = STRING_TOKEN (0x0002);

          
          oneof
            varid       = CBS_CONFIG.CbsCfgAcsEnRccDev0,
            prompt      = STRING_TOKEN (0x060E),
            help        = STRING_TOKEN (0x060F),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgAerEnRccDev0,
            prompt      = STRING_TOKEN (0x0610),
            help        = STRING_TOKEN (0x0611),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgDlfEnStrap1,
            prompt      = STRING_TOKEN (0x0612),
            help        = STRING_TOKEN (0x0613),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgPhy16gtStrap1,
            prompt      = STRING_TOKEN (0x0614),
            help        = STRING_TOKEN (0x0615),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgMarginEnStrap1,
            prompt      = STRING_TOKEN (0x0616),
            help        = STRING_TOKEN (0x0617),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgAcsSourceValStrap5,
            prompt      = STRING_TOKEN (0x0618),
            help        = STRING_TOKEN (0x0619),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgAcsTranslationalBlockingStrap5,
            prompt      = STRING_TOKEN (0x061A),
            help        = STRING_TOKEN (0x061B),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgAcsP2pReq,
            prompt      = STRING_TOKEN (0x061C),
            help        = STRING_TOKEN (0x061D),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgAcsP2pCompStrap5,
            prompt      = STRING_TOKEN (0x061E),
            help        = STRING_TOKEN (0x061F),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgAcsUpstreamFwdStrap5,
            prompt      = STRING_TOKEN (0x0620),
            help        = STRING_TOKEN (0x0621),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgAcsP2PEgressStrap5,
            prompt      = STRING_TOKEN (0x0622),
            help        = STRING_TOKEN (0x0623),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgAcsDirectTranslatedStrap5,
            prompt      = STRING_TOKEN (0x0624),
            help        = STRING_TOKEN (0x0625),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgAcsSsidEnStrap5,
            prompt      = STRING_TOKEN (0x0626),
            help        = STRING_TOKEN (0x0627),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgPriEnPageReq,
            prompt      = STRING_TOKEN (0x0628),
            help        = STRING_TOKEN (0x0629),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgPriResetPageReq,
            prompt      = STRING_TOKEN (0x062A),
            help        = STRING_TOKEN (0x062B),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgAcsSourceVal,
            prompt      = STRING_TOKEN (0x062C),
            help        = STRING_TOKEN (0x062D),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgAcsTranslationalBlocking,
            prompt      = STRING_TOKEN (0x062E),
            help        = STRING_TOKEN (0x062F),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgAcsP2pComp,
            prompt      = STRING_TOKEN (0x0630),
            help        = STRING_TOKEN (0x0631),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgAcsUpstreamFwd,
            prompt      = STRING_TOKEN (0x0632),
            help        = STRING_TOKEN (0x0633),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgAcsP2PEgress,
            prompt      = STRING_TOKEN (0x0634),
            help        = STRING_TOKEN (0x0635),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgAcsP2pReqStrap5,
            prompt      = STRING_TOKEN (0x0636),
            help        = STRING_TOKEN (0x0637),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgE2EPrefix,
            prompt      = STRING_TOKEN (0x0638),
            help        = STRING_TOKEN (0x0639),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCfgExtendedFmtSupported,
            prompt      = STRING_TOKEN (0x063A),
            help        = STRING_TOKEN (0x063B),
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnNbioAtomicRoutingStrap5,
            prompt      = STRING_TOKEN (0x063C),
            help        = STRING_TOKEN (0x063D),
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
          endoneof;

        endform;
      
      
      
      form

        formid        = 0x7121,

        title         = STRING_TOKEN (0x0536);

        subtitle text = STRING_TOKEN (0x0536);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsSevSnpSupport,
          prompt      = STRING_TOKEN (0x063E),
          help        = STRING_TOKEN (0x063F),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnDrtmMemoryReservation,
          prompt      = STRING_TOKEN (0x0640),
          help        = STRING_TOKEN (0x0641),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnDrtmSupport,
          prompt      = STRING_TOKEN (0x0642),
          help        = STRING_TOKEN (0x0643),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnDmaProtection,
          prompt      = STRING_TOKEN (0x0644),
          help        = STRING_TOKEN (0x0645),
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnGnbNbIOMMU,
          prompt      = STRING_TOKEN (0x0646),
          help        = STRING_TOKEN (0x0647),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnGnbNbIOMMU == 1
              AND NOT ideqval CBS_CONFIG.CbsCmnGnbNbIOMMU == 0xf;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnDmarSupport,
            prompt      = STRING_TOKEN (0x0648),
            help        = STRING_TOKEN (0x0649),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
          endoneof;
        endif;

      endform;
      
      
      
      form

        formid        = 0x7122,

        title         = STRING_TOKEN (0x0537);

        subtitle text = STRING_TOKEN (0x0537);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnEnablePortBifurcation,
          prompt      = STRING_TOKEN (0x064A),
          help        = STRING_TOKEN (0x064B),
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnEnablePortBifurcation == 1
                OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
        grayoutif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
          goto 0x712D,
            prompt      = STRING_TOKEN (0x064C),
            help        = STRING_TOKEN (0x064C);
        endif;
        endif;

        
        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnEnablePortBifurcation == 1
                OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
        grayoutif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
          goto 0x712E,
            prompt      = STRING_TOKEN (0x064D),
            help        = STRING_TOKEN (0x064D);
        endif;
        endif;

        
        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnEnablePortBifurcation == 1
                OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 1;
        grayoutif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 1;
          goto 0x712F,
            prompt      = STRING_TOKEN (0x064E),
            help        = STRING_TOKEN (0x064E);
        endif;
        endif;

        
        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnEnablePortBifurcation == 1
                OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 1;
        grayoutif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 1;
          goto 0x7130,
            prompt      = STRING_TOKEN (0x064F),
            help        = STRING_TOKEN (0x064F);
        endif;
        endif;

      endform;
        
        
        
        form

          formid        = 0x712D,

          title         = STRING_TOKEN (0x064C);

          subtitle text = STRING_TOKEN (0x064C);
          subtitle text = STRING_TOKEN (0x0002);

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnEnablePortBifurcation == 1
                  OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
          grayoutif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnS0P0Override,
              prompt      = STRING_TOKEN (0x0650),
              help        = STRING_TOKEN (0x0651),
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0652), value = 0x9,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0653), value = 0xA,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0654),   value = 0xB,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0655),   value = 0xC,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0656),   value = 0xD,  flags = 0 | RESET_REQUIRED;
            endoneof;
          endif;
          endif;

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnEnablePortBifurcation == 1
                  OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
          grayoutif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnS0P1Override,
              prompt      = STRING_TOKEN (0x0657),
              help        = STRING_TOKEN (0x0658),
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0652), value = 0x9,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0653), value = 0xA,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0654),   value = 0xB,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0655),   value = 0xC,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0656),   value = 0xD,  flags = 0 | RESET_REQUIRED;
            endoneof;
          endif;
          endif;

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnEnablePortBifurcation == 1
                  OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
          grayoutif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnS0P2Override,
              prompt      = STRING_TOKEN (0x0659),
              help        = STRING_TOKEN (0x065A),
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0652), value = 0x9,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0653), value = 0xA,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0654),   value = 0xB,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0655),   value = 0xC,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0656),   value = 0xD,  flags = 0 | RESET_REQUIRED;
            endoneof;
          endif;
          endif;

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnEnablePortBifurcation == 1
                  OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
          grayoutif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnS0P3Override,
              prompt      = STRING_TOKEN (0x065B),
              help        = STRING_TOKEN (0x065C),
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0652), value = 0x9,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0653), value = 0xA,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0654),   value = 0xB,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0655),   value = 0xC,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0656),   value = 0xD,  flags = 0 | RESET_REQUIRED;
            endoneof;
          endif;
          endif;

        endform;
        
        
        
        form

          formid        = 0x712E,

          title         = STRING_TOKEN (0x064D);

          subtitle text = STRING_TOKEN (0x064D);
          subtitle text = STRING_TOKEN (0x0002);

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnEnablePortBifurcation == 1
                  OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
          grayoutif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnS1P0Override,
              prompt      = STRING_TOKEN (0x065D),
              help        = STRING_TOKEN (0x065E),
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0652), value = 0x9,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0653), value = 0xA,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0654),   value = 0xB,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0655),   value = 0xC,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0656),   value = 0xD,  flags = 0 | RESET_REQUIRED;
            endoneof;
          endif;
          endif;

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnEnablePortBifurcation == 1
                  OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
          grayoutif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnS1P1Override,
              prompt      = STRING_TOKEN (0x065F),
              help        = STRING_TOKEN (0x0660),
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0652), value = 0x9,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0653), value = 0xA,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0654),   value = 0xB,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0655),   value = 0xC,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0656),   value = 0xD,  flags = 0 | RESET_REQUIRED;
            endoneof;
          endif;
          endif;

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnEnablePortBifurcation == 1
                  OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
          grayoutif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnS1P2Override,
              prompt      = STRING_TOKEN (0x0661),
              help        = STRING_TOKEN (0x0662),
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0652), value = 0x9,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0653), value = 0xA,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0654),   value = 0xB,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0655),   value = 0xC,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0656),   value = 0xD,  flags = 0 | RESET_REQUIRED;
            endoneof;
          endif;
          endif;

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnEnablePortBifurcation == 1
                  OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
          grayoutif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnS1P3Override,
              prompt      = STRING_TOKEN (0x0663),
              help        = STRING_TOKEN (0x0664),
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0652), value = 0x9,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0653), value = 0xA,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0654),   value = 0xB,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0655),   value = 0xC,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0656),   value = 0xD,  flags = 0 | RESET_REQUIRED;
            endoneof;
          endif;
          endif;

        endform;
        
        
        
        form

          formid        = 0x712F,

          title         = STRING_TOKEN (0x064E);

          subtitle text = STRING_TOKEN (0x064E);
          subtitle text = STRING_TOKEN (0x0002);

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnEnablePortBifurcation == 1
                  OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 1;
          grayoutif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 1;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnP0Override,
              prompt      = STRING_TOKEN (0x0665),
              help        = STRING_TOKEN (0x0666),
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0652), value = 0x9,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0653), value = 0xA,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0654),   value = 0xB,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0655),   value = 0xC,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0656),   value = 0xD,  flags = 0 | RESET_REQUIRED;
            endoneof;
          endif;
          endif;

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnEnablePortBifurcation == 1
                  OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 1;
          grayoutif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 1;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnP1Override,
              prompt      = STRING_TOKEN (0x0667),
              help        = STRING_TOKEN (0x0668),
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0652), value = 0x9,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0653), value = 0xA,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0654),   value = 0xB,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0655),   value = 0xC,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0656),   value = 0xD,  flags = 0 | RESET_REQUIRED;
            endoneof;
          endif;
          endif;

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnEnablePortBifurcation == 1
                  OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 1;
          grayoutif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 1;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnP2Override,
              prompt      = STRING_TOKEN (0x0669),
              help        = STRING_TOKEN (0x066A),
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0652), value = 0x9,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0653), value = 0xA,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0654),   value = 0xB,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0655),   value = 0xC,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0656),   value = 0xD,  flags = 0 | RESET_REQUIRED;
            endoneof;
          endif;
          endif;

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnEnablePortBifurcation == 1
                  OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 1;
          grayoutif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 1;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnP3Override,
              prompt      = STRING_TOKEN (0x066B),
              help        = STRING_TOKEN (0x066C),
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0652), value = 0x9,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0653), value = 0xA,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0654),   value = 0xB,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0655),   value = 0xC,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0656),   value = 0xD,  flags = 0 | RESET_REQUIRED;
            endoneof;
          endif;
          endif;

        endform;
        
        
        
        form

          formid        = 0x7130,

          title         = STRING_TOKEN (0x064F);

          subtitle text = STRING_TOKEN (0x064F);
          subtitle text = STRING_TOKEN (0x0002);

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnEnablePortBifurcation == 1
                  OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 1;
          grayoutif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 1;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnG0Override,
              prompt      = STRING_TOKEN (0x066D),
              help        = STRING_TOKEN (0x066E),
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0652), value = 0x9,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0653), value = 0xA,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0654),   value = 0xB,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0655),   value = 0xC,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0656),   value = 0xD,  flags = 0 | RESET_REQUIRED;
            endoneof;
          endif;
          endif;

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnEnablePortBifurcation == 1
                  OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 1;
          grayoutif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 1;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnG1Override,
              prompt      = STRING_TOKEN (0x066F),
              help        = STRING_TOKEN (0x0670),
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0652), value = 0x9,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0653), value = 0xA,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0654),   value = 0xB,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0655),   value = 0xC,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0656),   value = 0xD,  flags = 0 | RESET_REQUIRED;
            endoneof;
          endif;
          endif;

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnEnablePortBifurcation == 1
                  OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 1;
          grayoutif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 1;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnG2Override,
              prompt      = STRING_TOKEN (0x0671),
              help        = STRING_TOKEN (0x0672),
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0652), value = 0x9,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0653), value = 0xA,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0654),   value = 0xB,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0655),   value = 0xC,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0656),   value = 0xD,  flags = 0 | RESET_REQUIRED;
            endoneof;
          endif;
          endif;

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnEnablePortBifurcation == 1
                  OR NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 1;
          grayoutif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 1;
            
            oneof
              varid       = CBS_CONFIG.CbsCmnG3Override,
              prompt      = STRING_TOKEN (0x0673),
              help        = STRING_TOKEN (0x0674),
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0652), value = 0x9,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0653), value = 0xA,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0654),   value = 0xB,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0655),   value = 0xC,  flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0656),   value = 0xD,  flags = 0 | RESET_REQUIRED;
            endoneof;
          endif;
          endif;

        endform;
      
      
      
      form

        formid        = 0x7123,

        title         = STRING_TOKEN (0x0538);

        subtitle text = STRING_TOKEN (0x0538);
        subtitle text = STRING_TOKEN (0x0002);

        goto 0x7131,
          prompt      = STRING_TOKEN (0x0675),
          help        = STRING_TOKEN (0x0675);

        goto 0x7132,
          prompt      = STRING_TOKEN (0x0676),
          help        = STRING_TOKEN (0x0676);

        goto 0x7133,
          prompt      = STRING_TOKEN (0x0677),
          help        = STRING_TOKEN (0x0677);

      endform;
        
        
        
        form

          formid        = 0x7131,

          title         = STRING_TOKEN (0x0675);

          subtitle text = STRING_TOKEN (0x0675);
          subtitle text = STRING_TOKEN (0x0002);

          
          oneof
            varid       = CBS_CONFIG.CbsCmnNbioPcieSearchMaskConfigGen3,
            prompt      = STRING_TOKEN (0x0678),
            help        = STRING_TOKEN (0x0679),
            option text = STRING_TOKEN (0x0049),          value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xff, flags = DEFAULT | RESET_REQUIRED;
          endoneof;

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnNbioPcieSearchMaskConfigGen3 == 0;
          grayoutif NOT ideqval CBS_CONFIG.CbsCmnNbioPcieSearchMaskConfigGen3 == 0;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnNbioPcieSearchMaskGen3,
              prompt      = STRING_TOKEN (0x067A),
              help        = STRING_TOKEN (0x067B),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
              minimum     = 0,
              maximum     = 0x3ff,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;
          endif;

        endform;
        
        
        
        form

          formid        = 0x7132,

          title         = STRING_TOKEN (0x0676);

          subtitle text = STRING_TOKEN (0x0676);
          subtitle text = STRING_TOKEN (0x0002);

          
          oneof
            varid       = CBS_CONFIG.CbsCmnNbioPcieSearchMaskConfigGen4,
            prompt      = STRING_TOKEN (0x067C),
            help        = STRING_TOKEN (0x067D),
            option text = STRING_TOKEN (0x0049),          value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xff, flags = DEFAULT | RESET_REQUIRED;
          endoneof;

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnNbioPcieSearchMaskConfigGen4 == 0;
          grayoutif NOT ideqval CBS_CONFIG.CbsCmnNbioPcieSearchMaskConfigGen4 == 0;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnNbioPcieSearchMaskGen4,
              prompt      = STRING_TOKEN (0x067E),
              help        = STRING_TOKEN (0x067F),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
              minimum     = 0,
              maximum     = 0x3ff,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;
          endif;

        endform;
        
        
        
        form

          formid        = 0x7133,

          title         = STRING_TOKEN (0x0677);

          subtitle text = STRING_TOKEN (0x0677);
          subtitle text = STRING_TOKEN (0x0002);

          
          oneof
            varid       = CBS_CONFIG.CbsCmnNbioPcieSearchMaskConfigGen5,
            prompt      = STRING_TOKEN (0x0680),
            help        = STRING_TOKEN (0x0681),
            option text = STRING_TOKEN (0x0049),          value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xff, flags = DEFAULT | RESET_REQUIRED;
          endoneof;

          
          
          suppressif NOT ideqval CBS_CONFIG.CbsCmnNbioPcieSearchMaskConfigGen5 == 0;
          grayoutif NOT ideqval CBS_CONFIG.CbsCmnNbioPcieSearchMaskConfigGen5 == 0;
            
            numeric
              varid       = CBS_CONFIG.CbsCmnNbioPcieSearchMaskGen5,
              prompt      = STRING_TOKEN (0x0682),
              help        = STRING_TOKEN (0x0683),
              flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
              minimum     = 0,
              maximum     = 0x3ff,
              step        = 0,
              default     = 0,
            endnumeric;
          endif;
          endif;

        endform;
    
    
    
    form

      formid        = 0x7005,

      title         = STRING_TOKEN (0x000B);

      subtitle text = STRING_TOKEN (0x000B);
      subtitle text = STRING_TOKEN (0x0002);

      goto 0x7134,
        prompt      = STRING_TOKEN (0x0684),
        help        = STRING_TOKEN (0x0684);

      goto 0x7135,
        prompt      = STRING_TOKEN (0x0685),
        help        = STRING_TOKEN (0x0685);

      goto 0x7136,
        prompt      = STRING_TOKEN (0x0686),
        help        = STRING_TOKEN (0x0686);

      goto 0x7137,
        prompt      = STRING_TOKEN (0x0687),
        help        = STRING_TOKEN (0x0687);

      goto 0x7138,
        prompt      = STRING_TOKEN (0x0688),
        help        = STRING_TOKEN (0x0688);

      goto 0x7139,
        prompt      = STRING_TOKEN (0x0689),
        help        = STRING_TOKEN (0x0689);

      goto 0x713A,
        prompt      = STRING_TOKEN (0x068A),
        help        = STRING_TOKEN (0x068A);

    endform;
      
      
      
      form

        formid        = 0x7134,

        title         = STRING_TOKEN (0x0684);

        subtitle text = STRING_TOKEN (0x0684);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchI3C0Config,
          prompt      = STRING_TOKEN (0x068B),
          help        = STRING_TOKEN (0x068C),
          option text = STRING_TOKEN (0x068D),   value = 3,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x068E),     value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x068F),     value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchI3C1Config,
          prompt      = STRING_TOKEN (0x0690),
          help        = STRING_TOKEN (0x0691),
          option text = STRING_TOKEN (0x068D),   value = 3,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x068E),     value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x068F),     value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchI3C2Config,
          prompt      = STRING_TOKEN (0x0692),
          help        = STRING_TOKEN (0x0693),
          option text = STRING_TOKEN (0x068D),   value = 3,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x068E),     value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x068F),     value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchI3C3Config,
          prompt      = STRING_TOKEN (0x0694),
          help        = STRING_TOKEN (0x0695),
          option text = STRING_TOKEN (0x068D),   value = 3,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x068E),     value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x068F),     value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchI2C4Config,
          prompt      = STRING_TOKEN (0x0696),
          help        = STRING_TOKEN (0x0697),
          option text = STRING_TOKEN (0x0014),        value = 3,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchI2C5Config,
          prompt      = STRING_TOKEN (0x0698),
          help        = STRING_TOKEN (0x0699),
          option text = STRING_TOKEN (0x0014),        value = 3,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchReleaseSpdHostControl,
          prompt      = STRING_TOKEN (0x069A),
          help        = STRING_TOKEN (0x069B),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnFchReleaseSpdHostControl == 0;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnFchPMFWDdr5Telemetry,
            prompt      = STRING_TOKEN (0x069C),
            help        = STRING_TOKEN (0x069D),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED;
          endoneof;
        endif;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnFchPMFWDdr5Telemetry == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnFchIxcTelemetryPortsFence,
            prompt      = STRING_TOKEN (0x069E),
            help        = STRING_TOKEN (0x069F),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = DEFAULT | RESET_REQUIRED;
          endoneof;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchI2cSdaHoldOverride,
          prompt      = STRING_TOKEN (0x06A0),
          help        = STRING_TOKEN (0x06A1),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchApmlSbtsiSlvMode,
          prompt      = STRING_TOKEN (0x06A2),
          help        = STRING_TOKEN (0x06A3),
          option text = STRING_TOKEN (0x06A4),             value = 0,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x06A5),             value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnFchI3cModeSpeed,
            prompt      = STRING_TOKEN (0x06A6),
            help        = STRING_TOKEN (0x06A7),
            option text = STRING_TOKEN (0x06A8),      value = 0x2,  flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = 0 | RESET_REQUIRED;
          endoneof;
        endif;

        
        numeric
          varid       = CBS_CONFIG.CbsCmnFchI3cPpHcntValue,
          prompt      = STRING_TOKEN (0x06A9),
          help        = STRING_TOKEN (0x06AA),
          flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
          minimum     = 0x08,
          maximum     = 0x0D,
          step        = 0,
          default     = 0x08,
        endnumeric;

        
        numeric
          varid       = CBS_CONFIG.CbsCmnFchI3cSdaHoldValue,
          prompt      = STRING_TOKEN (0x06AB),
          help        = STRING_TOKEN (0x06AC),
          flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
          minimum     = 0x1,
          maximum     = 0x7,
          step        = 0,
          default     = 0x2,
        endnumeric;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnFchI2cSdaHoldOverride == 1;
          goto 0x713B,
            prompt      = STRING_TOKEN (0x06AD),
            help        = STRING_TOKEN (0x06AD);
        endif;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnFchI2cSdaHoldOverride == 1;
          goto 0x713C,
            prompt      = STRING_TOKEN (0x06AE),
            help        = STRING_TOKEN (0x06AE);
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchI3cSdaHoldOverride,
          prompt      = STRING_TOKEN (0x06AF),
          help        = STRING_TOKEN (0x06B0),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnFchI3cSdaHoldOverride == 1;
          goto 0x713D,
            prompt      = STRING_TOKEN (0x06B1),
            help        = STRING_TOKEN (0x06B1);
        endif;

      endform;
        
        
        
        form

          formid        = 0x713B,

          title         = STRING_TOKEN (0x06AD);

          subtitle text = STRING_TOKEN (0x06AD);
          subtitle text = STRING_TOKEN (0x0002);

          
          numeric
            varid       = CBS_CONFIG.CbsCmnFchI2c0SdaTxHoldValue,
            prompt      = STRING_TOKEN (0x06B2),
            help        = STRING_TOKEN (0x06B3),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0x1,
            maximum     = 0xFFFF,
            step        = 0,
            default     = 0x35,
          endnumeric;

          
          numeric
            varid       = CBS_CONFIG.CbsCmnFchI2c1SdaTxHoldValue,
            prompt      = STRING_TOKEN (0x06B4),
            help        = STRING_TOKEN (0x06B5),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0x1,
            maximum     = 0xFFFF,
            step        = 0,
            default     = 0x35,
          endnumeric;

          
          numeric
            varid       = CBS_CONFIG.CbsCmnFchI2c2SdaTxHoldValue,
            prompt      = STRING_TOKEN (0x06B6),
            help        = STRING_TOKEN (0x06B7),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0x1,
            maximum     = 0xFFFF,
            step        = 0,
            default     = 0x35,
          endnumeric;

          
          numeric
            varid       = CBS_CONFIG.CbsCmnFchI2c3SdaTxHoldValue,
            prompt      = STRING_TOKEN (0x06B8),
            help        = STRING_TOKEN (0x06B9),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0x1,
            maximum     = 0xFFFF,
            step        = 0,
            default     = 0x35,
          endnumeric;

          
          numeric
            varid       = CBS_CONFIG.CbsCmnFchI2c4SdaTxHoldValue,
            prompt      = STRING_TOKEN (0x06BA),
            help        = STRING_TOKEN (0x06BB),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0x1,
            maximum     = 0xFFFF,
            step        = 0,
            default     = 0x35,
          endnumeric;

          
          numeric
            varid       = CBS_CONFIG.CbsCmnFchI2c5SdaTxHoldValue,
            prompt      = STRING_TOKEN (0x06BC),
            help        = STRING_TOKEN (0x06BD),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0x1,
            maximum     = 0xFFFF,
            step        = 0,
            default     = 0x35,
          endnumeric;

        endform;
        
        
        
        form

          formid        = 0x713C,

          title         = STRING_TOKEN (0x06AE);

          subtitle text = STRING_TOKEN (0x06AE);
          subtitle text = STRING_TOKEN (0x0002);

          
          numeric
            varid       = CBS_CONFIG.CbsCmnFchI2c0SdaRxHoldValue,
            prompt      = STRING_TOKEN (0x06BE),
            help        = STRING_TOKEN (0x06BF),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0x00,
            maximum     = 0xFF,
            step        = 0,
            default     = 0x00,
          endnumeric;

          
          numeric
            varid       = CBS_CONFIG.CbsCmnFchI2c1SdaRxHoldValue,
            prompt      = STRING_TOKEN (0x06C0),
            help        = STRING_TOKEN (0x06C1),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0x00,
            maximum     = 0xFF,
            step        = 0,
            default     = 0x00,
          endnumeric;

          
          numeric
            varid       = CBS_CONFIG.CbsCmnFchI2c2SdaRxHoldValue,
            prompt      = STRING_TOKEN (0x06C2),
            help        = STRING_TOKEN (0x06C3),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0x00,
            maximum     = 0xFF,
            step        = 0,
            default     = 0x00,
          endnumeric;

          
          numeric
            varid       = CBS_CONFIG.CbsCmnFchI2c3SdaRxHoldValue,
            prompt      = STRING_TOKEN (0x06C4),
            help        = STRING_TOKEN (0x06C5),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0x00,
            maximum     = 0xFF,
            step        = 0,
            default     = 0x00,
          endnumeric;

          
          numeric
            varid       = CBS_CONFIG.CbsCmnFchI2c4SdaRxHoldValue,
            prompt      = STRING_TOKEN (0x06C6),
            help        = STRING_TOKEN (0x06C7),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0x00,
            maximum     = 0xFF,
            step        = 0,
            default     = 0x00,
          endnumeric;

          
          numeric
            varid       = CBS_CONFIG.CbsCmnFchI2c5SdaRxHoldValue,
            prompt      = STRING_TOKEN (0x06C8),
            help        = STRING_TOKEN (0x06C9),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0x00,
            maximum     = 0xFF,
            step        = 0,
            default     = 0x00,
          endnumeric;

        endform;
        
        
        
        form

          formid        = 0x713D,

          title         = STRING_TOKEN (0x06B1);

          subtitle text = STRING_TOKEN (0x06B1);
          subtitle text = STRING_TOKEN (0x0002);

          
          numeric
            varid       = CBS_CONFIG.CbsCmnFchI3c0SdaHoldValue,
            prompt      = STRING_TOKEN (0x06CA),
            help        = STRING_TOKEN (0x06CB),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0x1,
            maximum     = 0x7,
            step        = 0,
            default     = 0x2,
          endnumeric;

          
          numeric
            varid       = CBS_CONFIG.CbsCmnFchI3c1SdaHoldValue,
            prompt      = STRING_TOKEN (0x06CC),
            help        = STRING_TOKEN (0x06CD),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0x1,
            maximum     = 0x7,
            step        = 0,
            default     = 0x2,
          endnumeric;

          
          numeric
            varid       = CBS_CONFIG.CbsCmnFchI3c2SdaHoldValue,
            prompt      = STRING_TOKEN (0x06CE),
            help        = STRING_TOKEN (0x06CF),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0x1,
            maximum     = 0x7,
            step        = 0,
            default     = 0x2,
          endnumeric;

          
          numeric
            varid       = CBS_CONFIG.CbsCmnFchI3c3SdaHoldValue,
            prompt      = STRING_TOKEN (0x06D0),
            help        = STRING_TOKEN (0x06D1),
            flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
            minimum     = 0x1,
            maximum     = 0x7,
            step        = 0,
            default     = 0x2,
          endnumeric;

        endform;
      
      
      
      form

        formid        = 0x7135,

        title         = STRING_TOKEN (0x0685);

        subtitle text = STRING_TOKEN (0x0685);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchSataEnable,
          questionid  = 0x713E,
          prompt      = STRING_TOKEN (0x06D2),
          help        = STRING_TOKEN (0x06D3),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnFchSataEnable == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnFchSataClass,
            prompt      = STRING_TOKEN (0x06D4),
            help        = STRING_TOKEN (0x06D5),
            option text = STRING_TOKEN (0x06D6),            value = 2,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x06D7), value = 5,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = 0 | RESET_REQUIRED;
          endoneof;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchSataRasSupport,
          prompt      = STRING_TOKEN (0x06D8),
          help        = STRING_TOKEN (0x06D9),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchSataStaggeredSpinup,
          prompt      = STRING_TOKEN (0x06DA),
          help        = STRING_TOKEN (0x06DB),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchSataAhciDisPrefetchFunction,
          prompt      = STRING_TOKEN (0x06DC),
          help        = STRING_TOKEN (0x06DD),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        goto 0x713F,
          prompt      = STRING_TOKEN (0x06DE),
          help        = STRING_TOKEN (0x06DE);

      endform;
        
        
        
        form

          formid        = 0x713F,

          title         = STRING_TOKEN (0x06DE);

          subtitle text = STRING_TOKEN (0x06DE);
          subtitle text = STRING_TOKEN (0x0002);

          goto 0x7140,
            prompt      = STRING_TOKEN (0x06DF),
            help        = STRING_TOKEN (0x06DF);

          goto 0x7141,
            prompt      = STRING_TOKEN (0x06E0),
            help        = STRING_TOKEN (0x06E0);

          goto 0x7142,
            prompt      = STRING_TOKEN (0x06E1),
            help        = STRING_TOKEN (0x06E1);

          goto 0x7143,
            prompt      = STRING_TOKEN (0x06E2),
            help        = STRING_TOKEN (0x06E2);

        endform;
          
          
          
          form

            formid        = 0x7140,

            title         = STRING_TOKEN (0x06DF);

            subtitle text = STRING_TOKEN (0x06DF);
            subtitle text = STRING_TOKEN (0x0002);

            
            oneof
              varid       = CBS_CONFIG.CbsDbgFchSata0Enable,
              prompt      = STRING_TOKEN (0x06E3),
              help        = STRING_TOKEN (0x06E4),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
            endoneof;

            
            oneof
              varid       = CBS_CONFIG.CbsDbgFchSata1Enable,
              prompt      = STRING_TOKEN (0x06E5),
              help        = STRING_TOKEN (0x06E6),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
            endoneof;

            
            oneof
              varid       = CBS_CONFIG.CbsDbgFchSata2Enable,
              prompt      = STRING_TOKEN (0x06E7),
              help        = STRING_TOKEN (0x06E8),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
            endoneof;

            
            oneof
              varid       = CBS_CONFIG.CbsDbgFchSata3Enable,
              prompt      = STRING_TOKEN (0x06E9),
              help        = STRING_TOKEN (0x06EA),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
            endoneof;

            
            oneof
              varid       = CBS_CONFIG.CbsDbgFchSata4Enable,
              prompt      = STRING_TOKEN (0x06EB),
              help        = STRING_TOKEN (0x06EC),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
            endoneof;

            
            oneof
              varid       = CBS_CONFIG.CbsDbgFchSata5Enable,
              prompt      = STRING_TOKEN (0x06ED),
              help        = STRING_TOKEN (0x06EE),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
            endoneof;

            
            oneof
              varid       = CBS_CONFIG.CbsDbgFchSata6Enable,
              prompt      = STRING_TOKEN (0x06EF),
              help        = STRING_TOKEN (0x06F0),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
            endoneof;

            
            oneof
              varid       = CBS_CONFIG.CbsDbgFchSata7Enable,
              prompt      = STRING_TOKEN (0x06F1),
              help        = STRING_TOKEN (0x06F2),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
            endoneof;

          endform;
          
          
          
          form

            formid        = 0x7141,

            title         = STRING_TOKEN (0x06E0);

            subtitle text = STRING_TOKEN (0x06E0);
            subtitle text = STRING_TOKEN (0x0002);

            
            suppressif NOT ideqval CBS_CONFIG.CbsDbgFchSata0Enable == 1;
              goto 0x7144,
                prompt      = STRING_TOKEN (0x06F3),
                help        = STRING_TOKEN (0x06F3);
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDbgFchSata1Enable == 1;
              goto 0x7145,
                prompt      = STRING_TOKEN (0x06F4),
                help        = STRING_TOKEN (0x06F4);
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDbgFchSata2Enable == 1;
              goto 0x7146,
                prompt      = STRING_TOKEN (0x06F5),
                help        = STRING_TOKEN (0x06F5);
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDbgFchSata3Enable == 1;
              goto 0x7147,
                prompt      = STRING_TOKEN (0x06F6),
                help        = STRING_TOKEN (0x06F6);
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDbgFchSata4Enable == 1;
              goto 0x7148,
                prompt      = STRING_TOKEN (0x06F7),
                help        = STRING_TOKEN (0x06F7);
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDbgFchSata5Enable == 1;
              goto 0x7149,
                prompt      = STRING_TOKEN (0x06F8),
                help        = STRING_TOKEN (0x06F8);
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDbgFchSata6Enable == 1;
              goto 0x714A,
                prompt      = STRING_TOKEN (0x06F9),
                help        = STRING_TOKEN (0x06F9);
            endif;

            
            suppressif NOT ideqval CBS_CONFIG.CbsDbgFchSata7Enable == 1;
              goto 0x714B,
                prompt      = STRING_TOKEN (0x06FA),
                help        = STRING_TOKEN (0x06FA);
            endif;

          endform;
            
            
            
            form

              formid        = 0x7144,

              title         = STRING_TOKEN (0x06F3);

              subtitle text = STRING_TOKEN (0x06F3);
              subtitle text = STRING_TOKEN (0x0002);

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataeSATAPort0,
                prompt      = STRING_TOKEN (0x06FB),
                help        = STRING_TOKEN (0x06FC),
                option text = STRING_TOKEN (0x06FD),           value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x06FE),           value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataeSATAPort1,
                prompt      = STRING_TOKEN (0x06FF),
                help        = STRING_TOKEN (0x0700),
                option text = STRING_TOKEN (0x06FD),           value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x06FE),           value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataeSATAPort2,
                prompt      = STRING_TOKEN (0x0701),
                help        = STRING_TOKEN (0x0702),
                option text = STRING_TOKEN (0x06FD),           value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x06FE),           value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataeSATAPort3,
                prompt      = STRING_TOKEN (0x0703),
                help        = STRING_TOKEN (0x0704),
                option text = STRING_TOKEN (0x06FD),           value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x06FE),           value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataeSATAPort4,
                prompt      = STRING_TOKEN (0x0705),
                help        = STRING_TOKEN (0x0706),
                option text = STRING_TOKEN (0x06FD),           value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x06FE),           value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataeSATAPort5,
                prompt      = STRING_TOKEN (0x0707),
                help        = STRING_TOKEN (0x0708),
                option text = STRING_TOKEN (0x06FD),           value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x06FE),           value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataeSATAPort6,
                prompt      = STRING_TOKEN (0x0709),
                help        = STRING_TOKEN (0x070A),
                option text = STRING_TOKEN (0x06FD),           value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x06FE),           value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataeSATAPort7,
                prompt      = STRING_TOKEN (0x070B),
                help        = STRING_TOKEN (0x070C),
                option text = STRING_TOKEN (0x06FD),           value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x06FE),           value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

            endform;
            
            
            
            form

              formid        = 0x7145,

              title         = STRING_TOKEN (0x06F4);

              subtitle text = STRING_TOKEN (0x06F4);
              subtitle text = STRING_TOKEN (0x0002);

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie1EsataPort0,
                prompt      = STRING_TOKEN (0x070D),
                help        = STRING_TOKEN (0x070E),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie1EsataPort1,
                prompt      = STRING_TOKEN (0x070F),
                help        = STRING_TOKEN (0x0710),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie1EsataPort2,
                prompt      = STRING_TOKEN (0x0711),
                help        = STRING_TOKEN (0x0712),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie1EsataPort3,
                prompt      = STRING_TOKEN (0x0713),
                help        = STRING_TOKEN (0x0714),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie1EsataPort4,
                prompt      = STRING_TOKEN (0x0715),
                help        = STRING_TOKEN (0x0716),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie1EsataPort5,
                prompt      = STRING_TOKEN (0x0717),
                help        = STRING_TOKEN (0x0718),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie1EsataPort6,
                prompt      = STRING_TOKEN (0x0719),
                help        = STRING_TOKEN (0x071A),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie1EsataPort7,
                prompt      = STRING_TOKEN (0x071B),
                help        = STRING_TOKEN (0x071C),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

            endform;
            
            
            
            form

              formid        = 0x7146,

              title         = STRING_TOKEN (0x06F5);

              subtitle text = STRING_TOKEN (0x06F5);
              subtitle text = STRING_TOKEN (0x0002);

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie2EsataPort0,
                prompt      = STRING_TOKEN (0x071D),
                help        = STRING_TOKEN (0x071E),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie2EsataPort1,
                prompt      = STRING_TOKEN (0x071F),
                help        = STRING_TOKEN (0x0720),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie2EsataPort2,
                prompt      = STRING_TOKEN (0x0721),
                help        = STRING_TOKEN (0x0722),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie2EsataPort3,
                prompt      = STRING_TOKEN (0x0723),
                help        = STRING_TOKEN (0x0724),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie2EsataPort4,
                prompt      = STRING_TOKEN (0x0725),
                help        = STRING_TOKEN (0x0726),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie2EsataPort5,
                prompt      = STRING_TOKEN (0x0727),
                help        = STRING_TOKEN (0x0728),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie2EsataPort6,
                prompt      = STRING_TOKEN (0x0729),
                help        = STRING_TOKEN (0x072A),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie2EsataPort7,
                prompt      = STRING_TOKEN (0x072B),
                help        = STRING_TOKEN (0x072C),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

            endform;
            
            
            
            form

              formid        = 0x7147,

              title         = STRING_TOKEN (0x06F6);

              subtitle text = STRING_TOKEN (0x06F6);
              subtitle text = STRING_TOKEN (0x0002);

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie3EsataPort0,
                prompt      = STRING_TOKEN (0x072D),
                help        = STRING_TOKEN (0x072E),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie3EsataPort1,
                prompt      = STRING_TOKEN (0x072F),
                help        = STRING_TOKEN (0x0730),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie3EsataPort2,
                prompt      = STRING_TOKEN (0x0731),
                help        = STRING_TOKEN (0x0732),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie3EsataPort3,
                prompt      = STRING_TOKEN (0x0733),
                help        = STRING_TOKEN (0x0734),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie3EsataPort4,
                prompt      = STRING_TOKEN (0x0735),
                help        = STRING_TOKEN (0x0736),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie3EsataPort5,
                prompt      = STRING_TOKEN (0x0737),
                help        = STRING_TOKEN (0x0738),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie3EsataPort6,
                prompt      = STRING_TOKEN (0x0739),
                help        = STRING_TOKEN (0x073A),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie3EsataPort7,
                prompt      = STRING_TOKEN (0x073B),
                help        = STRING_TOKEN (0x073C),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

            endform;
            
            
            
            form

              formid        = 0x7148,

              title         = STRING_TOKEN (0x06F7);

              subtitle text = STRING_TOKEN (0x06F7);
              subtitle text = STRING_TOKEN (0x0002);

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie4EsataPort0,
                prompt      = STRING_TOKEN (0x073D),
                help        = STRING_TOKEN (0x073E),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie4EsataPort1,
                prompt      = STRING_TOKEN (0x073F),
                help        = STRING_TOKEN (0x0740),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie4EsataPort2,
                prompt      = STRING_TOKEN (0x0741),
                help        = STRING_TOKEN (0x0742),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie4EsataPort3,
                prompt      = STRING_TOKEN (0x0743),
                help        = STRING_TOKEN (0x0744),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie4EsataPort4,
                prompt      = STRING_TOKEN (0x0745),
                help        = STRING_TOKEN (0x0746),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie4EsataPort5,
                prompt      = STRING_TOKEN (0x0747),
                help        = STRING_TOKEN (0x0748),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie4EsataPort6,
                prompt      = STRING_TOKEN (0x0749),
                help        = STRING_TOKEN (0x074A),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie4EsataPort7,
                prompt      = STRING_TOKEN (0x074B),
                help        = STRING_TOKEN (0x074C),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

            endform;
            
            
            
            form

              formid        = 0x7149,

              title         = STRING_TOKEN (0x06F8);

              subtitle text = STRING_TOKEN (0x06F8);
              subtitle text = STRING_TOKEN (0x0002);

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie5EsataPort0,
                prompt      = STRING_TOKEN (0x074D),
                help        = STRING_TOKEN (0x074E),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie5EsataPort1,
                prompt      = STRING_TOKEN (0x074F),
                help        = STRING_TOKEN (0x0750),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie5EsataPort2,
                prompt      = STRING_TOKEN (0x0751),
                help        = STRING_TOKEN (0x0752),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie5EsataPort3,
                prompt      = STRING_TOKEN (0x0753),
                help        = STRING_TOKEN (0x0754),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie5EsataPort4,
                prompt      = STRING_TOKEN (0x0755),
                help        = STRING_TOKEN (0x0756),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie5EsataPort5,
                prompt      = STRING_TOKEN (0x0757),
                help        = STRING_TOKEN (0x0758),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie5EsataPort6,
                prompt      = STRING_TOKEN (0x0759),
                help        = STRING_TOKEN (0x075A),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie5EsataPort7,
                prompt      = STRING_TOKEN (0x075B),
                help        = STRING_TOKEN (0x075C),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

            endform;
            
            
            
            form

              formid        = 0x714A,

              title         = STRING_TOKEN (0x06F9);

              subtitle text = STRING_TOKEN (0x06F9);
              subtitle text = STRING_TOKEN (0x0002);

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie6EsataPort0,
                prompt      = STRING_TOKEN (0x075D),
                help        = STRING_TOKEN (0x075E),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie6EsataPort1,
                prompt      = STRING_TOKEN (0x075F),
                help        = STRING_TOKEN (0x0760),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie6EsataPort2,
                prompt      = STRING_TOKEN (0x0761),
                help        = STRING_TOKEN (0x0762),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie6EsataPort3,
                prompt      = STRING_TOKEN (0x0763),
                help        = STRING_TOKEN (0x0764),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie6EsataPort4,
                prompt      = STRING_TOKEN (0x0765),
                help        = STRING_TOKEN (0x0766),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie6EsataPort5,
                prompt      = STRING_TOKEN (0x0767),
                help        = STRING_TOKEN (0x0768),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie6EsataPort6,
                prompt      = STRING_TOKEN (0x0769),
                help        = STRING_TOKEN (0x076A),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie6EsataPort7,
                prompt      = STRING_TOKEN (0x076B),
                help        = STRING_TOKEN (0x076C),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

            endform;
            
            
            
            form

              formid        = 0x714B,

              title         = STRING_TOKEN (0x06FA);

              subtitle text = STRING_TOKEN (0x06FA);
              subtitle text = STRING_TOKEN (0x0002);

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie7EsataPort0,
                prompt      = STRING_TOKEN (0x076D),
                help        = STRING_TOKEN (0x076E),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie7EsataPort1,
                prompt      = STRING_TOKEN (0x076F),
                help        = STRING_TOKEN (0x0770),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie7EsataPort2,
                prompt      = STRING_TOKEN (0x0771),
                help        = STRING_TOKEN (0x0772),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie7EsataPort3,
                prompt      = STRING_TOKEN (0x0773),
                help        = STRING_TOKEN (0x0774),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie7EsataPort4,
                prompt      = STRING_TOKEN (0x0775),
                help        = STRING_TOKEN (0x0776),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie7EsataPort5,
                prompt      = STRING_TOKEN (0x0777),
                help        = STRING_TOKEN (0x0778),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie7EsataPort6,
                prompt      = STRING_TOKEN (0x0779),
                help        = STRING_TOKEN (0x077A),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie7EsataPort7,
                prompt      = STRING_TOKEN (0x077B),
                help        = STRING_TOKEN (0x077C),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

            endform;
          
          
          
          form

            formid        = 0x7142,

            title         = STRING_TOKEN (0x06E1);

            subtitle text = STRING_TOKEN (0x06E1);
            subtitle text = STRING_TOKEN (0x0002);

            goto 0x714C,
              prompt      = STRING_TOKEN (0x077D),
              help        = STRING_TOKEN (0x077D);

            goto 0x714D,
              prompt      = STRING_TOKEN (0x077E),
              help        = STRING_TOKEN (0x077E);

          endform;
            
            
            
            form

              formid        = 0x714C,

              title         = STRING_TOKEN (0x077D);

              subtitle text = STRING_TOKEN (0x077D);
              subtitle text = STRING_TOKEN (0x0002);

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataAggresiveDevSlpP0,
                prompt      = STRING_TOKEN (0x077F),
                help        = STRING_TOKEN (0x0780),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              suppressif NOT ideqval CBS_CONFIG.CbsDbgFchSataAggresiveDevSlpP0 == 1;
                
                numeric
                  varid       = CBS_CONFIG.CbsDbgFchSataDevSlpController0Num,
                  prompt      = STRING_TOKEN (0x0781),
                  help        = STRING_TOKEN (0x0782),
                  flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                  minimum     = 0,
                  maximum     = 3,
                  step        = 0,
                  default     = 0,
                endnumeric;
              endif;

              
              suppressif NOT ideqval CBS_CONFIG.CbsDbgFchSataAggresiveDevSlpP0 == 1;
                
                numeric
                  varid       = CBS_CONFIG.CbsDbgFchSataDevSlpPort0Num,
                  prompt      = STRING_TOKEN (0x0783),
                  help        = STRING_TOKEN (0x0784),
                  flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                  minimum     = 0,
                  maximum     = 7,
                  step        = 0,
                  default     = 0,
                endnumeric;
              endif;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataAggresiveDevSlpP1,
                prompt      = STRING_TOKEN (0x0785),
                help        = STRING_TOKEN (0x0786),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              suppressif NOT ideqval CBS_CONFIG.CbsDbgFchSataAggresiveDevSlpP1 == 1;
                
                numeric
                  varid       = CBS_CONFIG.CbsDbgFchSataDevSlpController1Num,
                  prompt      = STRING_TOKEN (0x0787),
                  help        = STRING_TOKEN (0x0788),
                  flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                  minimum     = 0,
                  maximum     = 3,
                  step        = 0,
                  default     = 1,
                endnumeric;
              endif;

              
              suppressif NOT ideqval CBS_CONFIG.CbsDbgFchSataAggresiveDevSlpP1 == 1;
                
                numeric
                  varid       = CBS_CONFIG.CbsDbgFchSataDevSlpPort1Num,
                  prompt      = STRING_TOKEN (0x0789),
                  help        = STRING_TOKEN (0x078A),
                  flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                  minimum     = 0,
                  maximum     = 7,
                  step        = 0,
                  default     = 0,
                endnumeric;
              endif;

            endform;
            
            
            
            form

              formid        = 0x714D,

              title         = STRING_TOKEN (0x077E);

              subtitle text = STRING_TOKEN (0x077E);
              subtitle text = STRING_TOKEN (0x0002);

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie4DevSlp0,
                prompt      = STRING_TOKEN (0x078B),
                help        = STRING_TOKEN (0x078C),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              suppressif NOT ideqval CBS_CONFIG.CbsDbgFchSataMcmDie4DevSlp0 == 1;
                
                numeric
                  varid       = CBS_CONFIG.CbsDbgFchSataMcmDie4DevSlpController0Num,
                  prompt      = STRING_TOKEN (0x078D),
                  help        = STRING_TOKEN (0x078E),
                  flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                  minimum     = 4,
                  maximum     = 7,
                  step        = 0,
                  default     = 4,
                endnumeric;
              endif;

              
              suppressif NOT ideqval CBS_CONFIG.CbsDbgFchSataMcmDie4DevSlp0 == 1;
                
                numeric
                  varid       = CBS_CONFIG.CbsDbgFchSataMcmDie4DevSlp0Num,
                  prompt      = STRING_TOKEN (0x078F),
                  help        = STRING_TOKEN (0x0790),
                  flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                  minimum     = 0,
                  maximum     = 7,
                  step        = 0,
                  default     = 0,
                endnumeric;
              endif;

              
              oneof
                varid       = CBS_CONFIG.CbsDbgFchSataMcmDie4DevSlp1,
                prompt      = STRING_TOKEN (0x0791),
                help        = STRING_TOKEN (0x0792),
                option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
                option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
              endoneof;

              
              suppressif NOT ideqval CBS_CONFIG.CbsDbgFchSataMcmDie4DevSlp1 == 1;
                
                numeric
                  varid       = CBS_CONFIG.CbsDbgFchSataMcmDie4DevSlpController1Num,
                  prompt      = STRING_TOKEN (0x0793),
                  help        = STRING_TOKEN (0x0794),
                  flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                  minimum     = 4,
                  maximum     = 7,
                  step        = 0,
                  default     = 5,
                endnumeric;
              endif;

              
              suppressif NOT ideqval CBS_CONFIG.CbsDbgFchSataMcmDie4DevSlp1 == 1;
                
                numeric
                  varid       = CBS_CONFIG.CbsDbgFchSataMcmDie4DevSlp1Num,
                  prompt      = STRING_TOKEN (0x0795),
                  help        = STRING_TOKEN (0x0796),
                  flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
                  minimum     = 0,
                  maximum     = 7,
                  step        = 0,
                  default     = 1,
                endnumeric;
              endif;

            endform;
          
          
          
          form

            formid        = 0x7143,

            title         = STRING_TOKEN (0x06E2);

            subtitle text = STRING_TOKEN (0x06E2);
            subtitle text = STRING_TOKEN (0x0002);

            
            oneof
              varid       = CBS_CONFIG.CbsDbgFchSataSgpio0,
              prompt      = STRING_TOKEN (0x0797),
              help        = STRING_TOKEN (0x0798),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
            endoneof;

            
            oneof
              varid       = CBS_CONFIG.CbsDbgFchSataMcmDie1Sgpio0,
              prompt      = STRING_TOKEN (0x0799),
              help        = STRING_TOKEN (0x079A),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
            endoneof;

            
            oneof
              varid       = CBS_CONFIG.CbsDbgFchSataMcmDie2Sgpio0,
              prompt      = STRING_TOKEN (0x079B),
              help        = STRING_TOKEN (0x079C),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
            endoneof;

            
            oneof
              varid       = CBS_CONFIG.CbsDbgFchSataMcmDie3Sgpio0,
              prompt      = STRING_TOKEN (0x079D),
              help        = STRING_TOKEN (0x079E),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
            endoneof;

            
            oneof
              varid       = CBS_CONFIG.CbsDbgFchSataMcmDie4Sgpio0,
              prompt      = STRING_TOKEN (0x079F),
              help        = STRING_TOKEN (0x07A0),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
            endoneof;

            
            oneof
              varid       = CBS_CONFIG.CbsDbgFchSataMcmDie5Sgpio0,
              prompt      = STRING_TOKEN (0x07A1),
              help        = STRING_TOKEN (0x07A2),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
            endoneof;

            
            oneof
              varid       = CBS_CONFIG.CbsDbgFchSataMcmDie6Sgpio0,
              prompt      = STRING_TOKEN (0x07A3),
              help        = STRING_TOKEN (0x07A4),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
            endoneof;

            
            oneof
              varid       = CBS_CONFIG.CbsDbgFchSataMcmDie7Sgpio0,
              prompt      = STRING_TOKEN (0x07A5),
              help        = STRING_TOKEN (0x07A6),
              option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
              option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
            endoneof;

          endform;
      
      
      
      form

        formid        = 0x7136,

        title         = STRING_TOKEN (0x0686);

        subtitle text = STRING_TOKEN (0x0686);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchUsbXHCI0Enable,
          prompt      = STRING_TOKEN (0x07A7),
          help        = STRING_TOKEN (0x07A8),
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchUsbXHCI1Enable,
          prompt      = STRING_TOKEN (0x07A9),
          help        = STRING_TOKEN (0x07AA),
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        goto 0x714E,
          prompt      = STRING_TOKEN (0x07AB),
          help        = STRING_TOKEN (0x07AB);

      endform;
        
        
        
        form

          formid        = 0x714E,

          title         = STRING_TOKEN (0x07AB);

          subtitle text = STRING_TOKEN (0x07AB);
          subtitle text = STRING_TOKEN (0x0002);

          
          oneof
            varid       = CBS_CONFIG.CbsCmnFchUsbXHCI2Enable,
            prompt      = STRING_TOKEN (0x07AC),
            help        = STRING_TOKEN (0x07AD),
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
          endoneof;

          
          oneof
            varid       = CBS_CONFIG.CbsCmnFchUsbXHCI3Enable,
            prompt      = STRING_TOKEN (0x07AE),
            help        = STRING_TOKEN (0x07AF),
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
          endoneof;

        endform;
      
      
      
      form

        formid        = 0x7137,

        title         = STRING_TOKEN (0x0687);

        subtitle text = STRING_TOKEN (0x0687);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchSystemPwrFailShadow,
          prompt      = STRING_TOKEN (0x07B0),
          help        = STRING_TOKEN (0x07B1),
          option text = STRING_TOKEN (0x07B2),      value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07B3),       value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07B4),        value = 3,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchPwrFailShadowABLEnabled,
          prompt      = STRING_TOKEN (0x07B5),
          help        = STRING_TOKEN (0x07B6),
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

      endform;
      
      
      
      form

        formid        = 0x7138,

        title         = STRING_TOKEN (0x0688);

        subtitle text = STRING_TOKEN (0x0688);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchUart0Config,
          prompt      = STRING_TOKEN (0x07B7),
          help        = STRING_TOKEN (0x07B8),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnFchUart0Config == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnFchUart0LegacyConfig,
            prompt      = STRING_TOKEN (0x07B9),
            help        = STRING_TOKEN (0x07BA),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x07BB),           value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x07BC),           value = 2,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x07BD),           value = 3,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x07BE),           value = 4,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
          endoneof;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchUart1Config,
          prompt      = STRING_TOKEN (0x07BF),
          help        = STRING_TOKEN (0x07C0),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnFchUart1Config == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnFchUart1LegacyConfig,
            prompt      = STRING_TOKEN (0x07C1),
            help        = STRING_TOKEN (0x07C2),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x07BB),           value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x07BC),           value = 2,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x07BD),           value = 3,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x07BE),           value = 4,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
          endoneof;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchUart2Config,
          prompt      = STRING_TOKEN (0x07C3),
          help        = STRING_TOKEN (0x07C4),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        suppressif NOT ideqval CBS_CONFIG.CbsCmnFchUart2Config == 1;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnFchUart2LegacyConfig,
            prompt      = STRING_TOKEN (0x07C5),
            help        = STRING_TOKEN (0x07C6),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x07BB),           value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x07BC),           value = 2,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x07BD),           value = 3,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x07BE),           value = 4,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
          endoneof;
        endif;

      endform;
      
      
      
      form

        formid        = 0x7139,

        title         = STRING_TOKEN (0x0689);

        subtitle text = STRING_TOKEN (0x0689);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnFchAlinkRasSupport,
          prompt      = STRING_TOKEN (0x07C7),
          help        = STRING_TOKEN (0x07C8),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        grayoutif NOT ideqval CBS_CONFIG.CbsCmnCpuScanDumpDbgEn == 0;
          
          oneof
            varid       = CBS_CONFIG.CbsDbgFchSyncfloodEnable,
            prompt      = STRING_TOKEN (0x07C9),
            help        = STRING_TOKEN (0x07CA),
            option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
            option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
          endoneof;
        endif;

        
        suppressif NOT ideqval CBS_CONFIG.CbsDbgFchSyncfloodEnable == 1;
          
          numeric
            varid       = CBS_CONFIG.CbsDbgFchDelaySyncflood,
            questionid  = 0x714F,
            prompt      = STRING_TOKEN (0x07CB),
            help        = STRING_TOKEN (0x07CC),
            flags       = RESET_REQUIRED | INTERACTIVE,
            minimum     = 0,
            maximum     = 255,
            step        = 0,
            default     = 0,
          endnumeric;
        endif;

      endform;
      
      
      
      form

        formid        = 0x713A,

        title         = STRING_TOKEN (0x068A);

        subtitle text = STRING_TOKEN (0x068A);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsDbgFchSystemSpreadSpectrum,
          prompt      = STRING_TOKEN (0x07CD),
          help        = STRING_TOKEN (0x07CE),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnBootTimerEnable,
          prompt      = STRING_TOKEN (0x07CF),
          help        = STRING_TOKEN (0x07D0),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 2,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

      endform;
    
    
    
    form

      formid        = 0x7006,

      title         = STRING_TOKEN (0x000C);

      subtitle text = STRING_TOKEN (0x000C);
      subtitle text = STRING_TOKEN (0x0002);

      
      oneof
        varid       = CBS_CONFIG.CbsCmnSP3NtbP0P0,
        prompt      = STRING_TOKEN (0x07D1),
        help        = STRING_TOKEN (0x07D2),
        option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
      endoneof;

      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnSP3NtbP0P0 == 1;
        
        numeric
          varid       = CBS_CONFIG.CbsCmnSP3NtbStartLaneP0P0,
          prompt      = STRING_TOKEN (0x07D3),
          help        = STRING_TOKEN (0x07D4),
          flags       = RESET_REQUIRED,
          minimum     = 0,
          maximum     = 15,
          step        = 0,
          default     = 0,
        endnumeric;
      endif;

      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnSP3NtbP0P0 == 1;
        
        numeric
          varid       = CBS_CONFIG.CbsCmnSP3NtbEndLaneP0P0,
          prompt      = STRING_TOKEN (0x07D5),
          help        = STRING_TOKEN (0x07D6),
          flags       = RESET_REQUIRED,
          minimum     = 0,
          maximum     = 15,
          step        = 0,
          default     = 15,
        endnumeric;
      endif;

      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnSP3NtbP0P0 == 1;
        
        oneof
          varid       = CBS_CONFIG.CbsCmnSP3NtbLinkSpeedP0P0,
          prompt      = STRING_TOKEN (0x07D7),
          help        = STRING_TOKEN (0x07D8),
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07D9),           value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07DA),           value = 2,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07DB),           value = 3,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07DC),           value = 4,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07DD),           value = 5,    flags = 0 | RESET_REQUIRED;
        endoneof;
      endif;

      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnSP3NtbP0P0 == 1;
        
        oneof
          varid       = CBS_CONFIG.CbsCmnSP3NtbModeP0P0,
          prompt      = STRING_TOKEN (0x07DE),
          help        = STRING_TOKEN (0x07DF),
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07E0),    value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07E1),     value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07E2),   value = 2,    flags = 0 | RESET_REQUIRED;
        endoneof;
      endif;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnSP3NtbP0P2,
        prompt      = STRING_TOKEN (0x07E3),
        help        = STRING_TOKEN (0x07E4),
        option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
      endoneof;

      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnSP3NtbP0P2 == 1;
        
        numeric
          varid       = CBS_CONFIG.CbsCmnSP3NtbStartLaneP0P2,
          prompt      = STRING_TOKEN (0x07E5),
          help        = STRING_TOKEN (0x07E6),
          flags       = RESET_REQUIRED,
          minimum     = 48,
          maximum     = 63,
          step        = 0,
          default     = 48,
        endnumeric;
      endif;

      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnSP3NtbP0P2 == 1;
        
        numeric
          varid       = CBS_CONFIG.CbsCmnSP3NtbEndLaneP0P2,
          prompt      = STRING_TOKEN (0x07E7),
          help        = STRING_TOKEN (0x07E8),
          flags       = RESET_REQUIRED,
          minimum     = 48,
          maximum     = 63,
          step        = 0,
          default     = 63,
        endnumeric;
      endif;

      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnSP3NtbP0P2 == 1;
        
        oneof
          varid       = CBS_CONFIG.CbsCmnSP3NtbLinkSpeedP0P2,
          prompt      = STRING_TOKEN (0x07E9),
          help        = STRING_TOKEN (0x07EA),
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07D9),           value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07DA),           value = 2,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07DB),           value = 3,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07DC),           value = 4,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07DD),           value = 5,    flags = 0 | RESET_REQUIRED;
        endoneof;
      endif;

      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnSP3NtbP0P2 == 1;
        
        oneof
          varid       = CBS_CONFIG.CbsCmnSP3NtbModeP0P2,
          prompt      = STRING_TOKEN (0x07EB),
          help        = STRING_TOKEN (0x07EC),
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07E0),    value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07E1),     value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07E2),   value = 2,    flags = 0 | RESET_REQUIRED;
        endoneof;
      endif;

    endform;
    
    
    
    form

      formid        = 0x7007,

      title         = STRING_TOKEN (0x000D);

      subtitle text = STRING_TOKEN (0x000D);
      subtitle text = STRING_TOKEN (0x0002);

      
      oneof
        varid       = CBS_CONFIG.CbsCmnSocAblConOut,
        prompt      = STRING_TOKEN (0x07ED),
        help        = STRING_TOKEN (0x07EE),
        option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 2,    flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      grayoutif NOT ideqval CBS_CONFIG.CbsCmnSocAblConOut == 1;
        
        oneof
          varid       = CBS_CONFIG.CbsCmnSocAblConOutSerialPort,
          prompt      = STRING_TOKEN (0x07EF),
          help        = STRING_TOKEN (0x07F0),
          option text = STRING_TOKEN (0x07F1),       value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07F2),       value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07F3),       value = 2,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;
      endif;

      
      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnSocAblSerialPortIOCustomEnabled == 0;
      grayoutif NOT ideqval CBS_CONFIG.CbsCmnSocAblConOutSerialPort == 0;
        
        oneof
          varid       = CBS_CONFIG.CbsCmnSocAblConOutSerialPortIO,
          prompt      = STRING_TOKEN (0x07F4),
          help        = STRING_TOKEN (0x07F5),
          option text = STRING_TOKEN (0x07BE),           value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07BC),           value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07BD),           value = 2,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07BB),           value = 3,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;
      endif;
      endif;

      
      grayoutif NOT ideqval CBS_CONFIG.CbsCmnSocAblConOutSerialPort == 0;
        
        oneof
          varid       = CBS_CONFIG.CbsCmnSocAblSerialPortIOCustomEnabled,
          prompt      = STRING_TOKEN (0x07F6),
          help        = STRING_TOKEN (0x07F7),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;
      endif;

      
      
      suppressif NOT ideqval CBS_CONFIG.CbsCmnSocAblSerialPortIOCustomEnabled == 1;
      grayoutif NOT ideqval CBS_CONFIG.CbsCmnSocAblSerialPortIOCustomEnabled == 1;
        
        numeric
          varid       = CBS_CONFIG.CbsCmnSocAblConOutSerialPortIOCustom,
          prompt      = STRING_TOKEN (0x07F8),
          help        = STRING_TOKEN (0x07F9),
          flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
          minimum     = 0,
          maximum     = 0xFFFF,
          step        = 0,
          default     = 0,
        endnumeric;
      endif;
      endif;

      
      grayoutif NOT ideqval CBS_CONFIG.CbsCmnSocAblConOut == 1;
        
        oneof
          varid       = CBS_CONFIG.CbsCmnSocAblConOutBasic,
          prompt      = STRING_TOKEN (0x07FA),
          help        = STRING_TOKEN (0x07FB),
          option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;
      endif;

      
      grayoutif NOT ideqval CBS_CONFIG.CbsCmnSocAblConOut == 1;
        
        oneof
          varid       = CBS_CONFIG.CbsCmnSocAblPmuMsgCtrl,
          prompt      = STRING_TOKEN (0x07FC),
          help        = STRING_TOKEN (0x07FD),
          option text = STRING_TOKEN (0x07FE), value = 0x04, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x07FF), value = 0x0A, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0800), value = 0xC8, flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;
      endif;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnSocAblMemPopMsgCtrl,
        prompt      = STRING_TOKEN (0x0801),
        help        = STRING_TOKEN (0x0802),
        option text = STRING_TOKEN (0x0803), value = 0,    flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0804),     value = 1,    flags = 0 | RESET_REQUIRED;
      endoneof;

      
      suppressif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
        
        oneof
          varid       = CBS_CONFIG.CbsCmnPrintSocket1PmuMsgBlock,
          prompt      = STRING_TOKEN (0x0805),
          help        = STRING_TOKEN (0x0806),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;
      endif;

      
      suppressif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 2;
        
        oneof
          varid       = CBS_CONFIG.CbsCmnPrintSocket1TrainingLog,
          prompt      = STRING_TOKEN (0x0807),
          help        = STRING_TOKEN (0x0808),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        endoneof;
      endif;

      
      oneof
        varid       = CBS_CONFIG.CbsDfCmnPspErrInj,
        prompt      = STRING_TOKEN (0x0809),
        help        = STRING_TOKEN (0x080A),
        option text = STRING_TOKEN (0x0033),           value = 0,    flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0034),            value = 1,    flags = 0 | RESET_REQUIRED;
      endoneof;

      goto 0x7150,
        prompt      = STRING_TOKEN (0x080B),
        help        = STRING_TOKEN (0x080B);

      
      suppressif NOT ideqval CBS_CONFIG.CbsNumberOfSockets == 0;
        
        numeric
          varid       = CBS_CONFIG.CbsNumberOfSockets,
          prompt      = STRING_TOKEN (0x080C),
          help        = STRING_TOKEN (0x080D),
          flags       = DISPLAY_UINT_HEX | RESET_REQUIRED,
          minimum     = 0,
          maximum     = 2,
          step        = 0,
          default     = 0,
        endnumeric;
      endif;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnSecI2cVoltMode,
        prompt      = STRING_TOKEN (0x080E),
        help        = STRING_TOKEN (0x080F),
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0810),       value = 0x12, flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0811),       value = 0xB,  flags = 0 | RESET_REQUIRED;
      endoneof;

    endform;
      
      
      
      form

        formid        = 0x7150,

        title         = STRING_TOKEN (0x080B);

        subtitle text = STRING_TOKEN (0x080B);
        subtitle text = STRING_TOKEN (0x0002);

        
        grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
          
          oneof
            varid       = CBS_CONFIG.CbsCmnSocFarEnforced,
            prompt      = STRING_TOKEN (0x0812),
            help        = STRING_TOKEN (0x0813),
            option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED;
            option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          endoneof;
        endif;

        
        grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
          
          numeric
            varid       = CBS_CONFIG.CbsCmnSocSplFuse,
            prompt      = STRING_TOKEN (0x0814),
            help        = STRING_TOKEN (0x0815),
            flags       = RESET_REQUIRED,
            minimum     = 0,
            maximum     = 0xff,
            step        = 0,
            default     = 0,
          endnumeric;
        endif;

        
        grayoutif NOT ideqval CBS_CONFIG.CbsComboFlag == 255;
          
          numeric
            varid       = CBS_CONFIG.CbsCmnSocSplValueInTbl,
            prompt      = STRING_TOKEN (0x0816),
            help        = STRING_TOKEN (0x0817),
            flags       = RESET_REQUIRED,
            minimum     = 0,
            maximum     = 0xff,
            step        = 0,
            default     = 0,
          endnumeric;
        endif;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnSocFarSwitch,
          prompt      = STRING_TOKEN (0x0818),
          help        = STRING_TOKEN (0x0819),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
        endoneof;

      endform;
    
    
    
    form

      formid        = 0x7008,

      title         = STRING_TOKEN (0x000E);

      subtitle text = STRING_TOKEN (0x000E);
      subtitle text = STRING_TOKEN (0x0002);

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCxlControl,
        prompt      = STRING_TOKEN (0x081A),
        help        = STRING_TOKEN (0x081B),
        option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCxlSdpReqSysAddr,
        prompt      = STRING_TOKEN (0x081C),
        help        = STRING_TOKEN (0x081D),
        option text = STRING_TOKEN (0x081E), value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x081F),  value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCxlSpm,
        prompt      = STRING_TOKEN (0x0820),
        help        = STRING_TOKEN (0x0821),
        option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCxlEncryption,
        questionid  = 0x7151,
        prompt      = STRING_TOKEN (0x0822),
        help        = STRING_TOKEN (0x0823),
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED | INTERACTIVE;
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED | INTERACTIVE;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCxlDvsecLock,
        prompt      = STRING_TOKEN (0x0824),
        help        = STRING_TOKEN (0x0825),
        option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCxlHdmDecoderLockOnCommit,
        prompt      = STRING_TOKEN (0x0826),
        help        = STRING_TOKEN (0x0827),
        option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCxlTempGen5Advertisement,
        prompt      = STRING_TOKEN (0x0828),
        help        = STRING_TOKEN (0x0829),
        option text = STRING_TOKEN (0x0014),         value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),          value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCmnSyncHeaderByPass,
        prompt      = STRING_TOKEN (0x082A),
        help        = STRING_TOKEN (0x082B),
        option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsCxlSyncHeaderBypassCompMode,
        prompt      = STRING_TOKEN (0x082C),
        help        = STRING_TOKEN (0x082D),
        option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
      endoneof;

      goto 0x7152,
        prompt      = STRING_TOKEN (0x082E),
        help        = STRING_TOKEN (0x082E);

      
      oneof
        varid       = CBS_CONFIG.CbsCmnCxlMemOnlineOffline,
        prompt      = STRING_TOKEN (0x082F),
        help        = STRING_TOKEN (0x0830),
        option text = STRING_TOKEN (0x0014),        value = 0,    flags = DEFAULT | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
      endoneof;

      
      oneof
        varid       = CBS_CONFIG.CbsDbgCxlOverideCxlMemorySize,
        prompt      = STRING_TOKEN (0x0831),
        help        = STRING_TOKEN (0x0832),
        option text = STRING_TOKEN (0x0833),            value = 0,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0058),            value = 1,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x0059),           value = 2,    flags = 0 | RESET_REQUIRED;
        option text = STRING_TOKEN (0x001A),            value = 0xFF, flags = DEFAULT | RESET_REQUIRED;
      endoneof;

    endform;
      
      
      
      form

        formid        = 0x7152,

        title         = STRING_TOKEN (0x082E);

        subtitle text = STRING_TOKEN (0x082E);
        subtitle text = STRING_TOKEN (0x0002);

        
        oneof
          varid       = CBS_CONFIG.CbsCmnCxlProtocolErrorReporting,
          prompt      = STRING_TOKEN (0x0834),
          help        = STRING_TOKEN (0x0835),
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0836),   value = 1,    flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0837), value = 2,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnCxlComponentErrorReporting,
          prompt      = STRING_TOKEN (0x0838),
          help        = STRING_TOKEN (0x0839),
          option text = STRING_TOKEN (0x083A),  value = 0,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x083B),  value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x083C),  value = 2,    flags = DEFAULT | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnCxlMemIsolationEnable,
          prompt      = STRING_TOKEN (0x083D),
          help        = STRING_TOKEN (0x083E),
          option text = STRING_TOKEN (0x001A),            value = 0xf,  flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        endoneof;

        
        oneof
          varid       = CBS_CONFIG.CbsCmnCxlMemIsolationFwNotification,
          prompt      = STRING_TOKEN (0x083F),
          help        = STRING_TOKEN (0x0840),
          option text = STRING_TOKEN (0x001A),            value = 0xF,  flags = DEFAULT | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0015),         value = 1,    flags = 0 | RESET_REQUIRED;
          option text = STRING_TOKEN (0x0014),        value = 0,    flags = 0 | RESET_REQUIRED;
        endoneof;

      endform;
endformset;

