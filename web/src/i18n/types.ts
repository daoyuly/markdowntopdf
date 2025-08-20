// i18n 翻译键的类型定义
export interface I18nKeys {
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    confirm: string
    save: string
    delete: string
    edit: string
    close: string
    submit: string
    back: string
    next: string
    previous: string
  }
  auth: {
    login: string
    register: string
    logout: string
    email: string
    password: string
    confirmPassword: string
    name: string
    username: string
    forgotPassword: string
    alreadyRegistered: string
    dontHaveAccount: string
    needHelp: string
    contactSupport: string
    loginFailed: string
    registrationFailed: string
    invalidCredentials: string
    passwordsDoNotMatch: string
    emailRequired: string
    passwordRequired: string
    nameRequired: string
    confirmPasswordRequired: string
    invalidEmail: string
    passwordTooShort: string
    nameTooShort: string
    enterEmail: string
    enterPassword: string
    enterName: string
    confirmYourPassword: string
  }
  editor: {
    markdownEditor: string
    preview: string
    export: string
    exportToPdf: string
    exportToHtml: string
    exportToWord: string
    save: string
    open: string
    new: string
    settings: string
    theme: string
    fontSize: string
    lineHeight: string
    autoSave: string
    wordWrap: string
    spellCheck: string
  }
  navigation: {
    home: string
    dashboard: string
    documents: string
    templates: string
    help: string
    about: string
    profile: string
    settings: string
  }
  validation: {
    required: string
    minLength: string
    maxLength: string
    email: string
    password: string
    passwordMatch: string
  }
  messages: {
    welcome: string
    documentSaved: string
    documentDeleted: string
    changesDiscarded: string
    unsavedChanges: string
    fileUploaded: string
    fileUploadFailed: string
    processing: string
    conversionComplete: string
    conversionFailed: string
  }
  languages: {
    en: string
    zh: string
    ja: string
    ko: string
  }
}

// 翻译函数的类型
export type TranslationFunction = (key: string, options?: any) => string

// 语言代码类型
export type LanguageCode = 'en' | 'zh' | 'ja' | 'ko'

// 语言信息类型
export interface LanguageInfo {
  code: LanguageCode
  name: string
  flag: string
  locale: string
}
