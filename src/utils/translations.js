// تكوين اللغة العربية و RTL
import { I18nManager } from 'react-native'

// تفعيل RTL للعربية
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true)
  I18nManager.forceRTL(true)
}

// دالة بسيطة لإرجاع النص باللغة العربية
export const t = (key) => {
  // يمكن توسيع هذا لاحقاً لدعم ترجمات أخرى
  // حالياً نرجع النص كما هو لأن التطبيق بالعربية بالكامل
  return key
}

// تكوين الخط العربي
export const arabicFontConfig = {
  regular: 'DGAgnadeen-Regular',
  light: 'DGAgnadeen-Light',
  bold: 'DGAgnadeen-Regular' // استخدام نفس الخط للـ bold لأن DG Agnadeen لا يحتوي على نسخة bold
}

export default {
  isRTL: true,
  language: 'ar',
  fontFamily: arabicFontConfig.regular
}