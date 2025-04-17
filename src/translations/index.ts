
// Add this type to improve type checking for translations
type TranslationDictionary = {
  [key: string]: string;
};

type AllLanguages = {
  english: TranslationDictionary;
  hindi: TranslationDictionary;
  telugu: TranslationDictionary;
  tamil: TranslationDictionary;
  kannada: TranslationDictionary;
  malayalam: TranslationDictionary;
  urdu: TranslationDictionary;
};

// Comprehensive translations
export const translations: AllLanguages = {
  english: {
    // Navigation
    home: "Home",
    marketplace: "Marketplace",
    services: "Services",
    business: "Business",
    jobs: "Jobs",
    communities: "Communities",
    messages: "Messages",
    events: "Events",
    maps: "Maps",
    settings: "Settings",
    theme: "Theme",
    search: "Search",
    profile: "Profile",
    
    // Actions
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    edit: "Edit",
    delete: "Delete",
    add: "Add",
    remove: "Remove",
    
    // Settings
    generalSettings: "General Settings",
    manageAccount: "Manage how the application looks and behaves",
    fontSize: "Font Size",
    small: "Small",
    default: "Default",
    large: "Large",
    themeColor: "Theme Color",
    language: "Language",
    selectLanguage: "Select Language",
    settingsSaved: "Settings saved successfully",
    saveSettings: "Save Settings",
    saving: "Saving...",
    preview: "Preview",
    previewText: "This is how your theme will appear",
    languageChanged: "Language changed to",
    translationNote: "Some content may not be fully translated. We are continuously improving our translations.",
    
    // Colors
    blue: "Blue",
    purple: "Purple",
    red: "Red",
    green: "Green",
    yellow: "Yellow",
    pink: "Pink",
    orange: "Orange", 
    teal: "Teal",
    
    // Home page
    findLocal: "Find Local Businesses and Services",
    browsingFrom: "You're browsing from",
    detect: "Detect",
    chooseLocation: "Choose Location",
    
    // Product related
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    addToWishlist: "Add to Wishlist",
    viewDetails: "View Details",
    price: "Price",
    discount: "Discount",
    reviews: "Reviews",
    rating: "Rating",
    
    // Authentication
    signIn: "Sign In",
    register: "Register",
    logOut: "Log Out",
    
    // Misc
    loading: "Loading...",
    error: "Error",
    success: "Success",
    backToHome: "Back to Home",
    notifications: "Notifications",
    lockedFeature: "This feature is currently under development and will be available soon.",
    subscribed: "Subscribed Businesses"
  },
  
  hindi: {
    // Navigation
    home: "होम",
    marketplace: "बाज़ार",
    services: "सेवाएं",
    business: "व्यापार",
    jobs: "नौकरियां",
    communities: "समुदाय",
    messages: "संदेश",
    events: "कार्यक्रम",
    maps: "नक्शे",
    settings: "सेटिंग्स",
    theme: "थीम",
    search: "खोज",
    profile: "प्रोफ़ाइल",
    
    // Actions
    save: "सहेजें",
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    add: "जोड़ें",
    remove: "निकालें",
    
    // Settings
    generalSettings: "सामान्य सेटिंग्स",
    manageAccount: "एप्लिकेशन की उपस्थिति और व्यवहार प्रबंधित करें",
    fontSize: "फ़ॉन्ट आकार",
    small: "छोटा",
    default: "डिफ़ॉल्ट",
    large: "बड़ा",
    themeColor: "थीम रंग",
    language: "भाषा",
    selectLanguage: "भाषा चुनें",
    settingsSaved: "सेटिंग्स सफलतापूर्वक सहेजी गईं",
    saveSettings: "सेटिंग्स सहेजें",
    saving: "सहेज रहा है...",
    preview: "पूर्वावलोकन",
    previewText: "आपकी थीम ऐसी दिखेगी",
    languageChanged: "भाषा बदली गई",
    translationNote: "कुछ सामग्री पूरी तरह से अनुवादित नहीं हो सकती है। हम लगातार अपने अनुवादों में सुधार कर रहे हैं।",
    
    // Colors
    blue: "नीला",
    purple: "बैंगनी",
    red: "लाल",
    green: "हरा",
    yellow: "पीला",
    pink: "गुलाबी",
    orange: "नारंगी", 
    teal: "हरिनीला",
    
    // Home page
    findLocal: "स्थानीय व्यवसाय और सेवाएँ खोजें",
    browsingFrom: "आप ब्राउज़ कर रहे हैं",
    detect: "पहचानें",
    chooseLocation: "स्थान चुनें",
    
    // Product related
    addToCart: "कार्ट में जोड़ें",
    buyNow: "अभी खरीदें",
    addToWishlist: "विशलिस्ट में जोड़ें",
    viewDetails: "विवरण देखें",
    price: "मूल्य",
    discount: "छूट",
    reviews: "समीक्षाएँ",
    rating: "रेटिंग",
    
    // Authentication
    signIn: "साइन इन करें",
    register: "रजिस्टर करें",
    logOut: "लॉग आउट",
    
    // Misc
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता",
    backToHome: "होम पर वापस जाएं",
    notifications: "सूचनाएं",
    lockedFeature: "यह सुविधा वर्तमान में विकास के अधीन है और जल्द ही उपलब्ध होगी।",
    subscribed: "सदस्यता वाले व्यवसाय"
  },
  
  telugu: {
    // Navigation
    home: "హోమ్",
    marketplace: "మార్కెట్‌ప్లేస్",
    services: "సేవలు",
    business: "వ్యాపారం",
    jobs: "ఉద్యోగాలు",
    communities: "సమాజాలు",
    messages: "సందేశాలు",
    events: "ఈవెంట్స్",
    maps: "మ్యాప్స్",
    settings: "సెట్టింగులు",
    theme: "థీమ్",
    search: "శోధన",
    profile: "ప్రొఫైల్",
    
    // Actions
    save: "సేవ్",
    cancel: "రద్దు",
    confirm: "నిర్ధారించు",
    edit: "సవరించు",
    delete: "తొలగించు",
    add: "జోడించు",
    remove: "తీసివేయి",
    
    // Settings
    generalSettings: "సాధారణ సెట్టింగులు",
    manageAccount: "అప్లికేషన్ రూపం మరియు ప్రవర్తనను నిర్వహించండి",
    fontSize: "ఫాంట్ పరిమాణం",
    small: "చిన్నది",
    default: "డిఫాల్ట్",
    large: "పెద్దది",
    themeColor: "థీమ్ రంగు",
    language: "భాష",
    selectLanguage: "భాషను ఎంచుకోండి",
    settingsSaved: "సెట్టింగులు విజయవంతంగా సేవ్ చేయబడ్డాయి",
    saveSettings: "సెట్టింగులను సేవ్ చేయండి",
    saving: "సేవ్ చేస్తోంది...",
    preview: "ప్రివ్యూ",
    previewText: "మీ థీమ్ ఇలా కనిపిస్తుంది",
    languageChanged: "భాష మార్చబడింది",
    translationNote: "కొంత కంటెంట్ పూర్తిగా అనువదించబడకపోవచ్చు. మేము మా అనువాదాలను నిరంతరం మెరుగుపరుస్తున్నాము.",
    
    // Colors
    blue: "నీలం",
    purple: "ఊదా",
    red: "ఎరుపు",
    green: "ఆకుపచ్చ",
    yellow: "పసుపు",
    pink: "గులాబీ",
    orange: "నారింజ",
    teal: "టీల్",
    
    // Home page
    findLocal: "స్థానిక వ్యాపారాలు మరియు సేవలను కనుగొనండి",
    browsingFrom: "మీరు బ్రౌజ్ చేస్తున్నారు",
    detect: "గుర్తించు",
    chooseLocation: "స్థానాన్ని ఎంచుకోండి",
    
    // Product related
    addToCart: "కార్ట్‌కి జోడించండి",
    buyNow: "ఇప్పుడే కొనండి",
    addToWishlist: "విష్‌లిస్ట్‌కి జోడించండి",
    viewDetails: "వివరాలను చూడండి",
    price: "ధర",
    discount: "తగ్గింపు",
    reviews: "సమీక్షలు",
    rating: "రేటింగ్",
    
    // Authentication
    signIn: "సైన్ ఇన్ చేయండి",
    register: "నమోదు చేయండి",
    logOut: "లాగ్ అవుట్",
    
    // Misc
    loading: "లోడ్ అవుతోంది...",
    error: "లోపం",
    success: "విజయం",
    backToHome: "హోమ్‌కి తిరిగి వెళ్లండి",
    notifications: "నోటిఫికేషన్లు",
    lockedFeature: "ఈ ఫీచర్ ప్రస్తుతం అభివృద్ధి చేయబడుతోంది మరియు త్వరలో అందుబాటులో ఉంటుంది.",
    subscribed: "చందా ఉన్న వ్యాపారాలు"
  },
  
  tamil: {
    // Navigation
    home: "முகப்பு",
    marketplace: "சந்தை",
    services: "சேவைகள்",
    business: "வணிகம்",
    jobs: "வேலைகள்",
    communities: "சமூகங்கள்",
    messages: "செய்திகள்",
    events: "நிகழ்வுகள்",
    maps: "வரைபடங்கள்",
    settings: "அமைப்புகள்",
    theme: "தீம்",
    search: "தேடல்",
    profile: "சுயவிவரம்",
    
    // Actions
    save: "சேமி",
    cancel: "ரத்து செய்",
    confirm: "உறுதிசெய்",
    edit: "திருத்து",
    delete: "நீக்கு",
    add: "சேர்",
    remove: "அகற்று",
    
    // Settings
    generalSettings: "பொது அமைப்புகள்",
    manageAccount: "பயன்பாட்டின் தோற்றம் மற்றும் செயல்பாடுகளை நிர்வகிக்கவும்",
    fontSize: "எழுத்து அளவு",
    small: "சிறியது",
    default: "இயல்புநிலை",
    large: "பெரியது",
    themeColor: "தீம் நிறம்",
    language: "மொழி",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    settingsSaved: "அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன",
    saveSettings: "அமைப்புகளைச் சேமிக்கவும்",
    saving: "சேமிக்கிறது...",
    preview: "முன்னோட்டம்",
    previewText: "உங்கள் தீம் இவ்வாறு தோன்றும்",
    languageChanged: "மொழி மாற்றப்பட்டது",
    translationNote: "சில உள்ளடக்கங்கள் முழுமையாக மொழிபெயர்க்கப்படாமல் இருக்கலாம். நாங்கள் தொடர்ந்து எங்கள் மொழிபெயர்ப்புகளை மேம்படுத்துகிறோம்.",
    
    // Colors
    blue: "நீலம்",
    purple: "ஊதா",
    red: "சிவப்பு",
    green: "பச்சை",
    yellow: "மஞ்சள்",
    pink: "இளஞ்சிவப்பு",
    orange: "ஆரஞ்சு",
    teal: "டீல்",
    
    // Home page
    findLocal: "உள்ளூர் வணிகங்கள் மற்றும் சேவைகளைக் கண்டறியவும்",
    browsingFrom: "நீங்கள் உலாவுகிறீர்கள்",
    detect: "கண்டறி",
    chooseLocation: "இருப்பிடத்தைத் தேர்ந்தெடுக்கவும்",
    
    // Product related
    addToCart: "கார்ட்டில் சேர்",
    buyNow: "இப்போது வாங்கு",
    addToWishlist: "விஷ்லிஸ்ட்டில் சேர்",
    viewDetails: "விவரங்களைக் காண்க",
    price: "விலை",
    discount: "தள்ளுபடி",
    reviews: "விமர்சனங்கள்",
    rating: "மதிப்பீடு",
    
    // Authentication
    signIn: "உள்நுழைக",
    register: "பதிவு செய்க",
    logOut: "வெளியேறு",
    
    // Misc
    loading: "ஏற்றுகிறது...",
    error: "பிழை",
    success: "வெற்றி",
    backToHome: "முகப்புக்குத் திரும்பு",
    notifications: "அறிவிப்புகள்",
    lockedFeature: "இந்த அம்சம் தற்போது உருவாக்கப்பட்டு வருகிறது மற்றும் விரைவில் கிடைக்கும்.",
    subscribed: "சந்தா செலுத்திய வணிகங்கள்"
  },
  
  kannada: {
    // Navigation
    home: "ಮುಖಪುಟ",
    marketplace: "ಮಾರುಕಟ್ಟೆ",
    services: "ಸೇವೆಗಳು",
    business: "ವ್ಯಾಪಾರ",
    jobs: "ಉದ್ಯೋಗಗಳು",
    communities: "ಸಮುದಾಯಗಳು",
    messages: "ಸಂದೇಶಗಳು",
    events: "ಕಾರ್ಯಕ್ರಮಗಳು",
    maps: "ನಕ್ಷೆಗಳು",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    theme: "ಥೀಮ್",
    search: "ಹುಡುಕಿ",
    profile: "ಪ್ರೊಫೈಲ್",
    
    // Actions
    save: "ಉಳಿಸಿ",
    cancel: "ರದ್ದುಮಾಡಿ",
    confirm: "ದೃಢೀಕರಿಸಿ",
    edit: "ಸಂಪಾದಿಸಿ",
    delete: "ಅಳಿಸಿ",
    add: "ಸೇರಿಸಿ",
    remove: "ತೆಗೆದುಹಾಕಿ",
    
    // Settings
    generalSettings: "ಸಾಮಾನ್ಯ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    manageAccount: "ಅಪ್ಲಿಕೇಶನ್ ಕಾಣುವ ರೀತಿ ಮತ್ತು ವರ್ತನೆಯನ್ನು ನಿರ್ವಹಿಸಿ",
    fontSize: "ಫಾಂಟ್ ಗಾತ್ರ",
    small: "ಚಿಕ್ಕದು",
    default: "ಡೀಫಾಲ್ಟ್",
    large: "ದೊಡ್ಡದು",
    themeColor: "ಥೀಮ್ ಬಣ್ಣ",
    language: "ಭಾಷೆ",
    selectLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    settingsSaved: "ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ",
    saveSettings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಉಳಿಸಿ",
    saving: "ಉಳಿಸಲಾಗುತ್ತಿದೆ...",
    preview: "ಪೂರ್ವವೀಕ್ಷಣೆ",
    previewText: "ನಿಮ್ಮ ಥೀಮ್ ಹೀಗೆ ಕಾಣುತ್ತದೆ",
    languageChanged: "ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಲಾಗಿದೆ",
    translationNote: "ಕೆಲವು ವಿಷಯಗಳು ಸಂಪೂರ್ಣವಾಗಿ ಅನುವಾದಿಸಲ್ಪಡದೇ ಇರಬಹುದು. ನಾವು ನಮ್ಮ ಅನುವಾದಗಳನ್ನು ನಿರಂತರವಾಗಿ ಸುಧಾರಿಸುತ್ತಿದ್ದೇವೆ.",
    
    // Colors
    blue: "ನೀಲಿ",
    purple: "ನೇರಳೆ",
    red: "ಕೆಂಪು",
    green: "ಹಸಿರು",
    yellow: "ಹಳದಿ",
    pink: "ಗುಲಾಬಿ",
    orange: "ಕಿತ್ತಳೆ",
    teal: "ಟೀಲ್",
    
    // Home page
    findLocal: "ಸ್ಥಳೀಯ ವ್ಯಾಪಾರಗಳು ಮತ್ತು ಸೇವೆಗಳನ್ನು ಹುಡುಕಿ",
    browsingFrom: "ನೀವು ಬ್ರೌಸ್ ಮಾಡುತ್ತಿರುವುದು",
    detect: "ಪತ್ತೆಹಚ್ಚಿ",
    chooseLocation: "ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    
    // Product related
    addToCart: "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
    buyNow: "ಈಗ ಖರೀದಿಸಿ",
    addToWishlist: "ವಿಶ್‌ಲಿಸ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
    viewDetails: "ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    price: "ಬೆಲೆ",
    discount: "ರಿಯಾಯಿತಿ",
    reviews: "ವಿಮರ್ಶೆಗಳು",
    rating: "ರೇಟಿಂಗ್",
    
    // Authentication
    signIn: "ಸೈನ್ ಇನ್ ಮಾಡಿ",
    register: "ನೋಂದಾಯಿಸಿ",
    logOut: "ಲಾಗ್ ಔಟ್",
    
    // Misc
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    error: "ದೋಷ",
    success: "ಯಶಸ್ಸು",
    backToHome: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
    notifications: "ಅಧಿಸೂಚನೆಗಳು",
    lockedFeature: "ಈ ವೈಶಿಷ್ಟ್ಯವು ಪ್ರಸ್ತುತ ಅಭಿವೃದ್ಧಿಯಲ್ಲಿದೆ ಮತ್ತು ಶೀಘ್ರದಲ್ಲೇ ಲಭ್ಯವಾಗಲಿದೆ.",
    subscribed: "ಚಂದಾದಾರಿಕೆಯುಳ್ಳ ವ್ಯಾಪಾರಗಳು"
  },
  
  malayalam: {
    // Navigation
    home: "ഹോം",
    marketplace: "മാർക്കറ്റ്പ്ലേസ്",
    services: "സേവനങ്ങൾ",
    business: "ബിസിനസ്",
    jobs: "ജോലികൾ",
    communities: "കമ്മ്യൂണിറ്റികൾ",
    messages: "സന്ദേശങ്ങൾ",
    events: "ഇവന്റുകൾ",
    maps: "മാപ്പുകൾ",
    settings: "ക്രമീകരണങ്ങൾ",
    theme: "തീം",
    search: "തിരയുക",
    profile: "പ്രൊഫൈൽ",
    
    // Actions
    save: "സംരക്ഷിക്കുക",
    cancel: "റദ്ദാക്കുക",
    confirm: "സ്ഥിരീകരിക്കുക",
    edit: "എഡിറ്റ് ചെയ്യുക",
    delete: "ഇല്ലാതാക്കുക",
    add: "ചേർക്കുക",
    remove: "നീക്കം ചെയ്യുക",
    
    // Settings
    generalSettings: "പൊതു ക്രമീകരണങ്ങൾ",
    manageAccount: "ആപ്ലിക്കേഷൻ എങ്ങനെ കാണപ്പെടുന്നുവെന്നും പ്രവർത്തിക്കുന്നുവെന്നും നിയന്ത്രിക്കുക",
    fontSize: "ഫോണ്ട് വലുപ്പം",
    small: "ചെറുത്",
    default: "സ്ഥിരം",
    large: "വലുത്",
    themeColor: "തീം നിറം",
    language: "ഭാഷ",
    selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    settingsSaved: "ക്രമീകരണങ്ങൾ വിജയകരമായി സംരക്ഷിച്ചു",
    saveSettings: "ക്രമീകരണങ്ങൾ സംരക്ഷിക്കുക",
    saving: "സംരക്ഷിക്കുന്നു...",
    preview: "പ്രിവ്യൂ",
    previewText: "നിങ്ങളുടെ തീം ഇങ്ങനെ കാണപ്പെടും",
    languageChanged: "ഭാഷ മാറ്റി",
    translationNote: "ചില ഉള്ളടക്കം പൂർണ്ണമായി വിവർത്തനം ചെയ്യപ്പെട്ടിട്ടില്ലായിരിക്കാം. ഞങ്ങൾ ഞങ്ങളുടെ വിവർത്തനങ്ങൾ തുടർച്ചയായി മെച്ചപ്പെടുത്തുന്നു.",
    
    // Colors
    blue: "നീല",
    purple: "പർപ്പിൾ",
    red: "ചുവപ്പ്",
    green: "പച്ച",
    yellow: "മഞ്ഞ",
    pink: "പിങ്ക്",
    orange: "ഓറഞ്ച്",
    teal: "ടീൽ",
    
    // Home page
    findLocal: "പ്രാദേശിക ബിസിനസുകളും സേവനങ്ങളും കണ്ടെത്തുക",
    browsingFrom: "നിങ്ങൾ ബ്രൗസ് ചെയ്യുന്നത്",
    detect: "കണ്ടെത്തുക",
    chooseLocation: "സ്ഥലം തിരഞ്ഞെടുക്കുക",
    
    // Product related
    addToCart: "കാർട്ടിലേക്ക് ചേർക്കുക",
    buyNow: "ഇപ്പോൾ വാങ്ങുക",
    addToWishlist: "വിഷ് ലിസ്റ്റിലേക്ക് ചേർക്കുക",
    viewDetails: "വിശദാംശങ്ങൾ കാണുക",
    price: "വില",
    discount: "ഡിസ്‌കൗണ്ട്",
    reviews: "അവലോകനങ്ങൾ",
    rating: "റേറ്റിംഗ്",
    
    // Authentication
    signIn: "സൈൻ ഇൻ",
    register: "രജിസ്റ്റർ",
    logOut: "ലോഗ് ഔട്ട്",
    
    // Misc
    loading: "ലോഡ് ചെയ്യുന്നു...",
    error: "പിശക്",
    success: "വിജയം",
    backToHome: "ഹോമിലേക്ക് മടങ്ങുക",
    notifications: "അറിയിപ്പുകൾ",
    lockedFeature: "ഈ സവിശേഷത നിലവിൽ വികസനത്തിലാണ്, ഉടൻ ലഭ്യമാകും.",
    subscribed: "സബ്സ്ക്രൈബ് ചെയ്ത ബിസിനസുകൾ"
  },
  
  // Added Urdu support
  urdu: {
    // Navigation
    home: "ہوم",
    marketplace: "مارکیٹ پلیس",
    services: "خدمات",
    business: "کاروبار",
    jobs: "نوکریاں",
    communities: "کمیونٹیز",
    messages: "پیغامات",
    events: "تقریبات",
    maps: "نقشے",
    settings: "ترتیبات",
    theme: "تھیم",
    search: "تلاش کریں",
    profile: "پروفائل",
    
    // Actions
    save: "محفوظ کریں",
    cancel: "منسوخ کریں",
    confirm: "تصدیق کریں",
    edit: "ترمیم کریں",
    delete: "حذف کریں",
    add: "شامل کریں",
    remove: "ہٹائیں",
    
    // Settings
    generalSettings: "عمومی ترتیبات",
    manageAccount: "ایپلیکیشن کی شکل اور طرز عمل کا انتظام کریں",
    fontSize: "فونٹ سائز",
    small: "چھوٹا",
    default: "ڈیفالٹ",
    large: "بڑا",
    themeColor: "تھیم کا رنگ",
    language: "زبان",
    selectLanguage: "زبان منتخب کریں",
    settingsSaved: "ترتیبات کامیابی سے محفوظ ہو گئیں",
    saveSettings: "ترتیبات محفوظ کریں",
    saving: "محفوظ کر رہا ہے...",
    preview: "پیش نظارہ",
    previewText: "آپ کا تھیم ایسا دکھائی دے گا",
    languageChanged: "زبان تبدیل کر دی گئی",
    translationNote: "کچھ مواد مکمل طور پر ترجمہ نہیں کیا گیا ہو سکتا ہے۔ ہم مسلسل اپنے تراجم کو بہتر بنا رہے ہیں۔",
    
    // Colors
    blue: "نیلا",
    purple: "جامنی",
    red: "سرخ",
    green: "سبز",
    yellow: "پیلا",
    pink: "گلابی",
    orange: "نارنجی",
    teal: "فیروزی",
    
    // Home page
    findLocal: "مقامی کاروبار اور خدمات تلاش کریں",
    browsingFrom: "آپ براؤز کر رہے ہیں",
    detect: "پتہ لگائیں",
    chooseLocation: "مقام کا انتخاب کریں",
    
    // Product related
    addToCart: "کارٹ میں شامل کریں",
    buyNow: "ابھی خریدیں",
    addToWishlist: "خواہش کی فہرست میں شامل کریں",
    viewDetails: "تفصیلات دیکھیں",
    price: "قیمت",
    discount: "رعایت",
    reviews: "جائزے",
    rating: "درجہ بندی",
    
    // Authentication
    signIn: "سائن ان کریں",
    register: "رجسٹر کریں",
    logOut: "لاگ آؤٹ کریں",
    
    // Misc
    loading: "لوڈ ہو رہا ہے...",
    error: "غلطی",
    success: "کامیابی",
    backToHome: "ہوم پر واپس جائیں",
    notifications: "اطلاعات",
    lockedFeature: "یہ فیچر فی الحال زیر ترقی ہے اور جلد ہی دستیاب ہوگا۔",
    subscribed: "سبسکرائب کیے گئے کاروبار"
  }
};
