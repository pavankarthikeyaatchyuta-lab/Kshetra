import type { Language } from '../models/types';

export interface TranslationDictionary {
  tagline: string;
  preparing: string;
  home: string;
  scan: string;
  passport: string;
  evidence: string;
  more: string;
  office: string;
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  intelligenceAtGlance: string;
  activeField: string;
  fieldId: string;
  crop: string;
  area: string;
  acres: string;
  location: string;
  status: string;
  monitoring: string;
  locationNotSet: string;
  useMyLocation: string;
  useDemoField: string;
  demoBadge: string;
  pocDemo: string;
  nativeAndroid: string;
  scanFieldCTA: string;
  openPassportCTA: string;
  fieldStoryPreview: string;
  evidenceContinuity: string;
  evidenceContinuityDesc: string;
  // Scanner
  cameraTitle: string;
  startCamera: string;
  capturePhoto: string;
  retakePhoto: string;
  analyzePhoto: string;
  saveWithoutAnalysis: string;
  selectSampleImage: string;
  cameraPermissionDenied: string;
  cameraPermissionNeeded: string;
  // Analysis
  analysisTitle: string;
  stepReading: string;
  stepCrop: string;
  stepCondition: string;
  stepSeverity: string;
  stepGuidance: string;
  analysisComplete: string;
  scanResult: string;
  conditionLabel: string;
  confidenceLabel: string;
  severityLabel: string;
  whatKshetraObserved: string;
  whatToDoNext: string;
  recordAction: string;
  addToPassport: string;
  scanAgain: string;
  // Passport
  passportTitle: string;
  passportSubtitle: string;
  lastScan: string;
  currentStatus: string;
  timelineTitle: string;
  noObservations: string;
  noObservationsPrompt: string;
  deleteObservationTitle: string;
  deleteObservationDesc: string;
  deleteBtn: string;
  cancelBtn: string;
  recordInterventionTitle: string;
  interventionActionPrompt: string;
  interventionNotesPrompt: string;
  saveInterventionBtn: string;
  // Evidence
  evidenceModeTitle: string;
  evidenceModeSubtitle: string;
  evidencePurpose: string;
  evidencePackage: string;
  buildPackageCTA: string;
  sha256Seal: string;
  originalHash: string;
  currentHash: string;
  simulateTamperCTA: string;
  verifyIntegrityCTA: string;
  restoreOriginalCTA: string;
  integrityVerified: string;
  hashMismatch: string;
  tamperAlert: string;
  browserPocNotice: string;
  nativeKeystoreNotice: string;
  deleteEvidenceTitle: string;
  deleteEvidenceDesc: string;
  // Settings & More
  settingsTitle: string;
  hardwarePermissions: string;
  cameraPerm: string;
  locationPerm: string;
  motionPerm: string;
  granted: string;
  denied: string;
  prompt: string;
  unsupported: string;
  offlineMode: string;
  simulateOffline: string;
  clearDemoData: string;
  resetPrototypeDesc: string;
  resetConfirm: string;
  aboutTitle: string;
  architectureComparison: string;
  languageSelect: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    tagline: 'THE FIELD THAT REMEMBERS',
    preparing: 'Preparing field intelligence...',
    home: 'Home',
    scan: 'Scan',
    passport: 'Passport',
    evidence: 'Evidence',
    more: 'More',
    office: 'Office',
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    intelligenceAtGlance: 'Field intelligence at a glance.',
    activeField: 'ACTIVE FIELD',
    fieldId: 'Field ID',
    crop: 'Crop',
    area: 'Area',
    acres: 'acres',
    location: 'Location',
    status: 'Status',
    monitoring: 'Monitoring',
    locationNotSet: 'Location not set',
    useMyLocation: 'Use my location',
    useDemoField: 'Use demo field',
    demoBadge: 'DEMO',
    pocDemo: 'POC DEMO ANALYSIS',
    nativeAndroid: 'NATIVE ANDROID IMPLEMENTATION',
    scanFieldCTA: 'Scan Field',
    openPassportCTA: 'Open Field Passport',
    fieldStoryPreview: 'Field Story',
    evidenceContinuity: 'EVIDENCE CONTINUITY',
    evidenceContinuityDesc: 'Kshetra remembers what the field looked like before, what changed, what was detected, and seals verifiable proof.',
    cameraTitle: 'Field Scanner',
    startCamera: 'Start Camera',
    capturePhoto: 'Capture',
    retakePhoto: 'Retake',
    analyzePhoto: 'Analyze',
    saveWithoutAnalysis: 'Save without analysis',
    selectSampleImage: 'Or select a field leaf sample',
    cameraPermissionDenied: 'Camera permission not granted. Use a sample image or enable camera permissions.',
    cameraPermissionNeeded: 'Tap "Start Camera" to access device camera lens.',
    analysisTitle: 'On-Device Analysis',
    stepReading: 'Reading image',
    stepCrop: 'Identifying crop',
    stepCondition: 'Assessing visible condition',
    stepSeverity: 'Estimating severity',
    stepGuidance: 'Preparing structured agronomy guidance',
    analysisComplete: 'Assessment Prepared',
    scanResult: 'SCAN RESULT',
    conditionLabel: 'Condition',
    confidenceLabel: 'Confidence',
    severityLabel: 'Severity',
    whatKshetraObserved: 'WHAT KSHETRA OBSERVED',
    whatToDoNext: 'WHAT TO DO NEXT',
    recordAction: 'Record Action',
    addToPassport: 'Add to Passport',
    scanAgain: 'Scan Again',
    passportTitle: 'Digital Field Passport',
    passportSubtitle: 'Everything Kshetra remembers about this field.',
    lastScan: 'Last scan',
    currentStatus: 'Current status',
    timelineTitle: 'Chronological Field History',
    noObservations: 'No field history yet.',
    noObservationsPrompt: 'Scan your field to start building its living story.',
    deleteObservationTitle: 'Delete this observation?',
    deleteObservationDesc: 'Deleting this record removes it from this prototype’s local field history.',
    deleteBtn: 'Delete',
    cancelBtn: 'Cancel',
    recordInterventionTitle: 'Record Field Intervention',
    interventionActionPrompt: 'What action did you take?',
    interventionNotesPrompt: 'Additional observations or notes...',
    saveInterventionBtn: 'Save Intervention',
    evidenceModeTitle: 'EVIDENCE MODE',
    evidenceModeSubtitle: 'Important Event Record',
    evidencePurpose: 'Create an integrity-checkable evidence package sealed with cryptographic proof.',
    evidencePackage: 'Evidence Package',
    buildPackageCTA: 'Build Evidence Package',
    sha256Seal: 'SHA-256 Integrity Hash',
    originalHash: 'Original Hash',
    currentHash: 'Current Hash',
    simulateTamperCTA: 'Simulate Tamper',
    verifyIntegrityCTA: 'Verify Integrity',
    restoreOriginalCTA: 'Restore Original',
    integrityVerified: 'INTEGRITY VERIFIED',
    hashMismatch: 'HASH MISMATCH',
    tamperAlert: 'Evidence changed after sealing. SHA-256 hash does not match original sealed record.',
    browserPocNotice: 'Browser Cryptographic Integrity Demonstration (Web Crypto API)',
    nativeKeystoreNotice: 'Native Android implementation uses Android Keystore hardware-backed signing.',
    deleteEvidenceTitle: 'Delete evidence package?',
    deleteEvidenceDesc: 'Once removed from this device, this prototype cannot restore it.',
    settingsTitle: 'Settings & Device Context',
    hardwarePermissions: 'Hardware Permissions',
    cameraPerm: 'Camera',
    locationPerm: 'Location (GPS)',
    motionPerm: 'Motion Sensors',
    granted: 'Granted',
    denied: 'Denied / Not set',
    prompt: 'Not requested',
    unsupported: 'Not supported',
    offlineMode: 'Offline-First Operation',
    simulateOffline: 'Simulate Offline Mode',
    clearDemoData: 'Clear Demo Data',
    resetPrototypeDesc: 'Reset this prototype to its original demo state?',
    resetConfirm: 'Reset Demo Data',
    aboutTitle: 'About Kshetra Architecture',
    architectureComparison: 'Browser Prototype vs Native Android Roadmap',
    languageSelect: 'Language',
  },
  hi: {
    tagline: 'वह खेत जो याद रखता है',
    preparing: 'खेत की बुद्धिमत्ता तैयार हो रही है...',
    home: 'होम',
    scan: 'स्कैन',
    passport: 'पासपोर्ट',
    evidence: 'प्रमाण',
    more: 'अधिक',
    office: 'ऑफिस',
    goodMorning: 'शुभ प्रभात',
    goodAfternoon: 'शुभ दोपहर',
    goodEvening: 'शुभ संध्या',
    intelligenceAtGlance: 'खेत की स्थिति एक नज़र में।',
    activeField: 'सक्रिय खेत',
    fieldId: 'खेत संख्या',
    crop: 'फसल',
    area: 'क्षेत्रफल',
    acres: 'एकड़',
    location: 'स्थान',
    status: 'स्थिति',
    monitoring: 'निगरानी में',
    locationNotSet: 'स्थान निर्धारित नहीं है',
    useMyLocation: 'मेरा स्थान उपयोग करें',
    useDemoField: 'डेमो खेत चुनें',
    demoBadge: 'डेमो',
    pocDemo: 'पीओसी डेमो विश्लेषण',
    nativeAndroid: 'नेटिव एंड्रॉइड कार्यान्वयन',
    scanFieldCTA: 'खेत स्कैन करें',
    openPassportCTA: 'फील्ड पासपोर्ट खोलें',
    fieldStoryPreview: 'खेत का इतिहास',
    evidenceContinuity: 'प्रमाण निरंतरता',
    evidenceContinuityDesc: 'क्षेत्र याद रखता है कि खेत पहले कैसा था, क्या बदलाव आया, और सत्यापन योग्य प्रमाण सुरक्षित करता है।',
    cameraTitle: 'फील्ड स्कैनर',
    startCamera: 'कैमरा शुरू करें',
    capturePhoto: 'फोटो लें',
    retakePhoto: 'दोबारा लें',
    analyzePhoto: 'विश्लेषण करें',
    saveWithoutAnalysis: 'बिना विश्लेषण सहेजें',
    selectSampleImage: 'या पत्ते का नमूना चुनें',
    cameraPermissionDenied: 'कैमरा अनुमति नहीं मिली। नमूना छवि का उपयोग करें।',
    cameraPermissionNeeded: 'कैमरा शुरू करने के लिए टैप करें।',
    analysisTitle: 'डिवाइस पर विश्लेषण',
    stepReading: 'छवि पढ़ना',
    stepCrop: 'फसल पहचानना',
    stepCondition: 'लक्षणों का आकलन',
    stepSeverity: 'गंभीरता का अनुमान',
    stepGuidance: 'कृषि मार्गदर्शन तैयार करना',
    analysisComplete: 'मूल्यांकन तैयार',
    scanResult: 'स्कैन परिणाम',
    conditionLabel: 'स्थिति',
    confidenceLabel: 'विश्वसनीयता',
    severityLabel: 'गंभीरता',
    whatKshetraObserved: 'क्षेत्र ने क्या देखा',
    whatToDoNext: 'आगे क्या करें',
    recordAction: 'कार्रवाई दर्ज करें',
    addToPassport: 'पासपोर्ट में जोड़ें',
    scanAgain: 'फिर स्कैन करें',
    passportTitle: 'डिजिटल फील्ड पासपोर्ट',
    passportSubtitle: 'इस खेत के बारे में क्षेत्र जो कुछ भी याद रखता है।',
    lastScan: 'अंतिम स्कैन',
    currentStatus: 'वर्तमान स्थिति',
    timelineTitle: 'कालानुक्रमिक खेत इतिहास',
    noObservations: 'अभी कोई इतिहास नहीं है।',
    noObservationsPrompt: 'खेत की कहानी शुरू करने के लिए स्कैन करें।',
    deleteObservationTitle: 'क्या इस अवलोकन को हटाना चाहते हैं?',
    deleteObservationDesc: 'इस रिकॉर्ड को हटाने से यह स्थानीय इतिहास से हट जाएगा।',
    deleteBtn: 'हटाएं',
    cancelBtn: 'रद्द करें',
    recordInterventionTitle: 'उपाय दर्ज करें',
    interventionActionPrompt: 'आपने क्या कार्रवाई की?',
    interventionNotesPrompt: 'अतिरिक्त विवरण या टिप्पणियां...',
    saveInterventionBtn: 'उपाय सहेजें',
    evidenceModeTitle: 'प्रमाण मोड',
    evidenceModeSubtitle: 'महत्वपूर्ण घटना रिकॉर्ड',
    evidencePurpose: 'सत्यापन योग्य क्रिप्टोग्राफ़िक प्रमाण पैकेज बनाएं।',
    evidencePackage: 'प्रमाण पैकेज',
    buildPackageCTA: 'प्रमाण पैकेज तैयार करें',
    sha256Seal: 'SHA-256 अखंडता हैश',
    originalHash: 'मूल हैश',
    currentHash: 'वर्तमान हैश',
    simulateTamperCTA: 'छेड़छाड़ का अनुकरण करें',
    verifyIntegrityCTA: 'सत्यता जांचें',
    restoreOriginalCTA: 'मूल स्थिति में लाएं',
    integrityVerified: 'सत्यता सत्यापित',
    hashMismatch: 'हैश मेल नहीं खाता',
    tamperAlert: 'सील करने के बाद डेटा बदला गया। SHA-256 हैश मूल से मेल नहीं खाता।',
    browserPocNotice: 'ब्राउज़र क्रिप्टोग्राफिक अखंडता प्रदर्शन (Web Crypto API)',
    nativeKeystoreNotice: 'नेटिव एंड्रॉइड Android Keystore हार्डवेयर-समर्थित साइनिंग का उपयोग करता है।',
    deleteEvidenceTitle: 'प्रमाण पैकेज हटाएं?',
    deleteEvidenceDesc: 'एक बार हटाए जाने पर इसे पुनः प्राप्त नहीं किया जा सकता।',
    settingsTitle: 'सेटिंग्स और डिवाइस संदर्भ',
    hardwarePermissions: 'हार्डवेयर अनुमतियां',
    cameraPerm: 'कैमरा',
    locationPerm: 'स्थान (जीपीएस)',
    motionPerm: 'मोशन सेंसर',
    granted: 'स्वीकृत',
    denied: 'अस्वीकृत / सेट नहीं',
    prompt: 'अनुरोध नहीं किया गया',
    unsupported: 'असमर्थित',
    offlineMode: 'ऑफ़लाइन-प्रथम संचालन',
    simulateOffline: 'ऑफ़लाइन मोड का अनुकरण करें',
    clearDemoData: 'डेमो डेटा साफ़ करें',
    resetPrototypeDesc: 'क्या इस प्रोटोटाइप को मूल स्थिति में रीसेट करना चाहते हैं?',
    resetConfirm: 'रीसेट करें',
    aboutTitle: 'क्षेत्र वास्तुकला',
    architectureComparison: 'ब्राउज़र प्रोटोटाइप बनाम एंड्रॉइड रोडमैप',
    languageSelect: 'भाषा',
  },
  te: {
    tagline: 'గుర్తుంచుకునే పొలం',
    preparing: 'క్షేత్ర సమాచారం సిద్ధమవుతోంది...',
    home: 'హోమ్',
    scan: 'స్కాన్',
    passport: 'పాస్‌పోర్ట్',
    evidence: 'సాక్ష్యం',
    more: 'మరిన్ని',
    office: 'ఆఫీస్',
    goodMorning: 'శుభోదయం',
    goodAfternoon: 'శుభ మధ్యాహ్నం',
    goodEvening: 'శుభ సాయంత్రం',
    intelligenceAtGlance: 'పొలం సమాచారం ఒక్కచూపులో.',
    activeField: 'ప్రస్తుత పొలం',
    fieldId: 'పొలం సంఖ్య',
    crop: 'పంట',
    area: 'విస్తీర్ణం',
    acres: 'ఎకరాలు',
    location: 'స్థానం',
    status: 'స్థితి',
    monitoring: 'పర్యవేక్షణలో ఉంది',
    locationNotSet: 'లొకేషన్ సెట్ చేయలేదు',
    useMyLocation: 'నా లొకేషన్ ఉపయోగించండి',
    useDemoField: 'డెమో పొలం వాడండి',
    demoBadge: 'డెమో',
    pocDemo: 'POC డెమో విశ్లేషణ',
    nativeAndroid: 'స్థానిక ఆండ్రాయిడ్ అమలు',
    scanFieldCTA: 'పొలం స్కాన్ చేయండి',
    openPassportCTA: 'ఫీల్డ్ పాస్‌పోర్ట్ తెరవండి',
    fieldStoryPreview: 'పొలం చరిత్ర',
    evidenceContinuity: 'సాక్ష్యాల నిరంతరత',
    evidenceContinuityDesc: 'పొలం గతంలో ఎలా ఉంది, ఏం మారింది, ఏం గుర్తించారో క్షేత్ర గుర్తుంచుకుంటుంది.',
    cameraTitle: 'ఫీల్డ్ స్కానర్',
    startCamera: 'కెమెరా ప్రారంభించండి',
    capturePhoto: 'ఫోటో తీయండి',
    retakePhoto: 'మళ్ళీ తీయండి',
    analyzePhoto: 'విశ్లేషించండి',
    saveWithoutAnalysis: 'విశ్లేషణ లేకుండా సేవ్ చేయండి',
    selectSampleImage: 'లేదా ఆకు నమూనాను ఎంచుకోండి',
    cameraPermissionDenied: 'కెమెరా అనుమతి లభించలేదు. నమూనా ఫోటోను వాడండి.',
    cameraPermissionNeeded: 'కెమెరా ఆన్ చేయడానికి ట్యాప్ చేయండి.',
    analysisTitle: 'పరికరంలో విశ్లేషణ',
    stepReading: 'చిత్రాన్ని చదవడం',
    stepCrop: 'పంటను గుర్తించడం',
    stepCondition: 'లక్షణాలను అంచనా వేయడం',
    stepSeverity: 'తీవ్రతను లెక్కించడం',
    stepGuidance: 'వ్యవసాయ సలహాలు సిద్ధం చేయడం',
    analysisComplete: 'విశ్లేషణ పూర్తయింది',
    scanResult: 'స్కాన్ ఫలితం',
    conditionLabel: 'పరిస్థితి',
    confidenceLabel: 'ఖచ్చితత్వం',
    severityLabel: 'తీవ్రత',
    whatKshetraObserved: 'క్షేత్ర గమనించిన వివరాలు',
    whatToDoNext: 'తర్వాత చేయవలసినవి',
    recordAction: 'చర్య నమోదు చేయండి',
    addToPassport: 'పాస్‌పోర్ట్‌కు జోడించండి',
    scanAgain: 'మళ్ళీ స్కాన్ చేయండి',
    passportTitle: 'డిజిటల్ ఫీల్డ్ పాస్‌పోర్ట్',
    passportSubtitle: 'ఈ పొలం గురించి క్షేత్ర గుర్తుంచుకునే సమగ్ర సమాచారం.',
    lastScan: 'చివరి స్కాన్',
    currentStatus: 'ప్రస్తుత పరిస్థితి',
    timelineTitle: 'పొలం సమగ్ర చరిత్ర',
    noObservations: 'ఇంకా ఎటువంటి చరిత్ర లేదు.',
    noObservationsPrompt: 'మీ పొలం కథను ప్రారంభించడానికి స్కాన్ చేయండి.',
    deleteObservationTitle: 'ఈ వివరాలను తొలగించాలా?',
    deleteObservationDesc: 'ఈ రికార్డును తొలగిస్తే స్థానిక చరిత్ర నుండి తొలగించబడుతుంది.',
    deleteBtn: 'తొలగించు',
    cancelBtn: 'రద్దు చేయి',
    recordInterventionTitle: 'తీసుకున్న చర్య నమోదు',
    interventionActionPrompt: 'మీరు ఏ చర్య తీసుకున్నారు?',
    interventionNotesPrompt: 'అదనపు వివరాలు...',
    saveInterventionBtn: 'చర్య సేవ్ చేయండి',
    evidenceModeTitle: 'సాక్ష్యం మోడ్',
    evidenceModeSubtitle: 'ముఖ్యమైన రికార్డు',
    evidencePurpose: 'మార్చలేని క్రిప్టోగ్రాఫిక్ సాక్ష్య ప్యాకేజీని సిద్ధం చేయండి.',
    evidencePackage: 'సాక్ష్య ప్యాకేజీ',
    buildPackageCTA: 'సాక్ష్య ప్యాకేజీని రూపొందించండి',
    sha256Seal: 'SHA-256 సమగ్రత హ్యాష్',
    originalHash: 'అసలు హ్యాష్',
    currentHash: 'ప్రస్తుత హ్యాష్',
    simulateTamperCTA: 'మార్పును అనుకరించండి',
    verifyIntegrityCTA: 'సమగ్రతను ధృవీకరించండి',
    restoreOriginalCTA: 'మొదటి రూపానికి పునరుద్ధరించు',
    integrityVerified: 'సమగ్రత ధృవీకరించబడింది',
    hashMismatch: 'హ్యాష్ సరిపోలలేదు',
    tamperAlert: 'సీల్ చేసిన తర్వాత డేటా మార్చబడింది. SHA-256 హ్యాష్ సరిపోలడం లేదు.',
    browserPocNotice: 'బ్రౌజర్ క్రిప్టోగ్రాఫిక్ ప్రదర్శన (Web Crypto API)',
    nativeKeystoreNotice: 'ఆండ్రాయిడ్ యాప్ Android Keystore హార్డ్‌వేర్ సైనింగ్‌ను ఉపయోగిస్తుంది.',
    deleteEvidenceTitle: 'సాక్ష్య ప్యాకేజీని తొలగించాలా?',
    deleteEvidenceDesc: 'ఒకసారి తొలగిస్తే మళ్ళీ పొందలేరు.',
    settingsTitle: 'సెట్టింగ్‌లు & పరికర వివరాలు',
    hardwarePermissions: 'హార్డ్‌వేర్ అనుమతులు',
    cameraPerm: 'కెమెరా',
    locationPerm: 'లొకేషన్ (జీపీఎస్)',
    motionPerm: 'మోషన్ సెన్సార్లు',
    granted: 'అనుమతించబడింది',
    denied: 'నిరాకరించబడింది / సెట్ చేయలేదు',
    prompt: 'అభ్యర్థించలేదు',
    unsupported: 'సహకరించదు',
    offlineMode: 'ఆఫ్‌లైన్ ఆపరేషన్',
    simulateOffline: 'ఆఫ్‌లైన్ మోడ్ పరీక్షించండి',
    clearDemoData: 'డెమో డేటాను తొలగించండి',
    resetPrototypeDesc: 'ఈ ప్రోటోటైప్‌ను ప్రారంభ స్థితికి మార్చాలా?',
    resetConfirm: 'రీసెట్ చేయి',
    aboutTitle: 'క్షేత్ర నిర్మాణం',
    architectureComparison: 'బ్రౌజర్ ప్రోటోటైప్ vs ఆండ్రాయిడ్ రోడ్‌మ్యాప్',
    languageSelect: 'భాష',
  },
};

// Knowledge base with controlled, safe agronomic observations & actionable advice
export interface AgronomyConditionInfo {
  condition: string;
  crop: string;
  defaultSeverity: number;
  defaultConfidence: number;
  observations: Record<Language, string[]>;
  guidance: Record<Language, string[]>;
}

export const agronomyKnowledge: Record<string, AgronomyConditionInfo> = {
  leaf_curl: {
    condition: 'Leaf Curl — Moderate',
    crop: 'Paddy',
    defaultSeverity: 38,
    defaultConfidence: 91,
    observations: {
      en: [
        'Visible inward upward curling on upper canopy leaves.',
        'Early chlorotic stippling along secondary veins.',
        'Root collar and lower stem tissue remain structurally intact.',
      ],
      hi: [
        'ऊपरी छत्र की पत्तियों पर अंदर और ऊपर की ओर स्पष्ट मुड़ाव।',
        'द्वितीयक शिराओं के साथ शुरुआती हल्के पीले धब्बे।',
        'तने का निचला भाग और जड़ें स्वस्थ अवस्था में हैं।',
      ],
      te: [
        'పై వరుస ఆకులపై లోపలికి పైకి ముడుచుకున్న లక్షణాలు.',
        'ద్వితీయ ఈనెల వెంబడి లేత పసుపు రంగు మచ్చలు.',
        'మొక్క కాండం మరియు వేర్లు దృఢంగా ఉన్నాయి.',
      ],
    },
    guidance: {
      en: [
        'Inspect nearby plants within a 5-meter radius for vector presence.',
        'Record this intervention and avoid excessive nitrogen application.',
        'Monitor moisture levels; do not allow the field to dry to crack point.',
        'Re-scan after 4 to 6 days to evaluate recovery trajectory.',
      ],
      hi: [
        '5 मीटर के दायरे में आस-पास के पौधों का निरीक्षण करें।',
        'इस उपाय को दर्ज करें और अधिक नाइट्रोजन डालने से बचें।',
        'खेत में नमी बनाए रखें, मिट्टी को सूखने न दें।',
        'सुधार की स्थिति देखने के लिए 4 से 6 दिनों के बाद दोबारा स्कैन करें।',
      ],
      te: [
        '5 మీటర్ల పరిధిలోని సమీప మొక్కలను పరిశీలించండి.',
        'ఈ చర్యను నమోదు చేయండి మరియు అధిక నత్రజని వాడకాన్ని నివారించండి.',
        'పొలంలో తగినంత తేమ ఉండేలా చూసుకోండి.',
        'మార్పును గమనించడానికి 4 నుండి 6 రోజుల తర్వాత మళ్ళీ స్కాన్ చేయండి.',
      ],
    },
  },
  blast: {
    condition: 'Blast Lesions — Early Stage',
    crop: 'Paddy',
    defaultSeverity: 45,
    defaultConfidence: 89,
    observations: {
      en: [
        'Spindle-shaped lesions with grayish centers and brown borders.',
        'Lesions primarily localized on middle foliage.',
        'No neck rot symptoms visible in current stage.',
      ],
      hi: [
        'भूरे किनारों और भूरे-सफेद केंद्र वाले धुरी के आकार के धब्बे।',
        'धब्बे मुख्य रूप से बीच की पत्तियों पर सीमित हैं।',
        'वर्तमान चरण में गर्दन सड़न के लक्षण नहीं हैं।',
      ],
      te: [
        'గోధుమ రంగు అంచులతో కండె ఆకారపు మచ్చలు.',
        'మచ్చలు ప్రధానంగా మధ్య వరుస ఆకులపై కేంద్రీకృతమై ఉన్నాయి.',
        'ఈ దశలో మెడ విరుపు లక్షణాలు లేవు.',
      ],
    },
    guidance: {
      en: [
        'Maintain balanced irrigation and drain standing excess water if stagnant.',
        'Record intervention in Field Passport.',
        'Isolate the boundary strip to monitor fungal spore dispersal.',
        'Re-scan in 72 hours to verify whether lesion borders are expanding.',
      ],
      hi: [
        'उचित सिंचाई बनाए रखें और स्थिर अतिरिक्त पानी की निकासी करें।',
        'फील्ड पासपोर्ट में अपनी कार्रवाई दर्ज करें।',
        'बीजाणु फैलाव की निगरानी के लिए सीमा रेखा का निरीक्षण करें।',
        'धब्बे बढ़ रहे हैं या नहीं यह देखने के लिए 72 घंटों में दोबारा स्कैन करें।',
      ],
      te: [
        'నీటి నిల్వను నివారించి తగిన తేమను మాత్రమే నిర్వహించండి.',
        'ఫీల్డ్ పాస్‌పోర్ట్‌లో తీసుకున్న చర్యను నమోదు చేయండి.',
        'ఫంగస్ వ్యాప్తిని గమనించడానికి గట్ల వెంబడి పరిశీలించండి.',
        '72 గంటల్లో మళ్ళీ స్కాన్ చేసి మచ్చల తీవ్రతను సరిచూడండి.',
      ],
    },
  },
  healthy: {
    condition: 'Optimal Canopy — Healthy Baseline',
    crop: 'Paddy',
    defaultSeverity: 4,
    defaultConfidence: 96,
    observations: {
      en: [
        'Uniform deep chlorophyll coloration across leaf blade.',
        'Clean leaf margins with no chlorosis, wilting, or lesions.',
        'Vigorous tillering and optimal solar interception.',
      ],
      hi: [
        'पत्ती की पूरी सतह पर एक समान गहरा हरा रंग।',
        'पत्तियों के किनारे साफ हैं, कोई सूखापन या धब्बे नहीं हैं।',
        'पौधे का विकास और प्रकाश अवशोषण उत्तम है।',
      ],
      te: [
        'ఆకులంతటా సమానమైన ఆరోగ్యకరమైన పచ్చదనం.',
        'ఎటువంటి మచ్చలు లేదా ముడతలు లేని పరిశుభ్రమైన ఆకులు.',
        'మొక్క ఎదుగుదల మరియు పిలకల సంఖ్య సంతృప్తికరంగా ఉంది.',
      ],
    },
    guidance: {
      en: [
        'Maintain scheduled baseline irrigation.',
        'Keep nutrient application on regular vegetative timetable.',
        'Perform next scheduled passport monitoring scan in 7 days.',
      ],
      hi: [
        'नियमित कार्यक्रम के अनुसार सिंचाई जारी रखें।',
        'सामान्य पोषण सारणी का पालन करें।',
        '7 दिनों में अगला नियमित निगरानी स्कैन करें।',
      ],
      te: [
        'సాధారణ నీటి యాజమాన్యాన్ని కొనసాగించండి.',
        'సిఫార్సు చేసిన సమతుల్య ఎరువుల పట్టికను అనుసరించండి.',
        '7 రోజుల తర్వాత తదుపరి సాధారణ పర్యవేక్షణ స్కాన్ చేయండి.',
      ],
    },
  },
};
