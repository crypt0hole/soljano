import { Dimensions, StyleSheet, I18nManager } from 'react-native'
import { colors, alignment, verticalScale, scale } from '../../utils'
const { height, width } = Dimensions.get('window')

const isRTL = I18nManager.isRTL

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  safeAreaStyle: {
    backgroundColor: colors.headerbackground
  },
  formMainContainer: {
    flex: 1,
    backgroundColor: colors.themeBackground
  },
  formContainer: {
    marginTop: height * 0.1,
    width: '90%',
    backgroundColor: colors.container,
    borderRadius: scale(8),
    position: 'relative',
    ...alignment.PBlarge,
    alignSelf: 'center',
  },
  profileImageContainer: {
    width: verticalScale(80),
    height: verticalScale(80),
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: colors.container,
    borderRadius: verticalScale(40),
    top: verticalScale(-40),
    borderWidth: verticalScale(3),
    borderColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: verticalScale(40)
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    // عكس right و left حسب الاتجاه
    [isRTL ? 'left' : 'right']: 0,
    width: scale(26),
    height: scale(26),
    borderRadius: scale(13),
    backgroundColor: colors.buttonbackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white'
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(50)
  },
  formContentContainer: {
    width: '100%',
    marginTop: scale(50),
    ...alignment.MBmedium
  },
  twoItemsContainer: {
    width: '100%',
    height: scale(80),
    flexDirection: isRTL ? 'row-reverse' : 'row', // عكس الاتجاه هنا
    alignItems: 'center',
    justifyContent: 'space-evenly',
    ...alignment.MBxSmall
  },
  halfContainer: {
    width: '45%',
    height: '80%'
  },
  labelContainer: {
    width: '100%',
    height: '40%'
  },
  inputContainer: {
    width: '100%',
    height: '60%',
    borderRadius: scale(3),
    justifyContent: 'center',
    backgroundColor: colors.themeBackground,
    ...alignment.PxSmall,
    flexDirection: isRTL ? 'row-reverse' : 'row', // عكس الاتجاه هنا أيضاً
    alignItems: 'center'
  },
  arrowIcon: {
    // عكس marginLeft إلى marginRight في حالة RTL
    [isRTL ? 'marginRight' : 'marginLeft']: scale(10)
  },
  inputText: {
    textAlign: 'right',  // عادة نصوص RTL محاذاة لليمين
    ...alignment.PxSmall
  },
  disableInput: {
    textAlign: 'right',
    color: colors.fontThirdColor,
    ...alignment.PxSmall
  },
  oneItemContainer: {
    width: '100%',
    height: scale(80),
    flexDirection: isRTL ? 'row-reverse' : 'row', // عكس الاتجاه
    justifyContent: 'center'
  },
  fullContainer: {
    width: '95%',
    height: '80%'
  },
  addContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  error: {
    borderColor: colors.errorColor
  },
  editButton: {
    padding: scale(5)
  },
  disabledNote: {
    // عكس marginLeft إلى marginRight
    [isRTL ? 'marginRight' : 'marginLeft']: scale(5)
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: colors.container,
    borderRadius: scale(10),
    overflow: 'hidden'
  },
  modalHeader: {
    width: '100%',
    padding: scale(15),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightHorizontalLine
  },
  modalContent: {
    padding: scale(15)
  },
  inputField: {
    marginBottom: scale(15)
  },
  modalInput: {
    backgroundColor: colors.themeBackground,
    borderRadius: scale(5),
    padding: scale(10),
    marginTop: scale(5),
    textAlign: 'right'
  },
  modalButtons: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: scale(10),
    // gap: scale(8), // أزل هذه الخاصية إذا كانت تسبب مشاكل
  },
  modalButton: {
    width: '100%',
    padding: scale(10),
    borderRadius: scale(5),
    alignItems: 'center',
    // أزل marginBottom الافتراضي هنا
  },
  cancelButton: {
    backgroundColor: colors.fontThirdColor
  },
  confirmButton: {
    backgroundColor: colors.buttonbackground
  },
  // أنماط النافذة المنبثقة لاختيار الدولة
  countryModalContainer: {
    width: width * 0.8,
    backgroundColor: colors.container,
    borderRadius: scale(10),
    overflow: 'hidden'
  },
  countryModalHeader: {
    width: '100%',
    padding: scale(15),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightHorizontalLine
  },
  countryListContainer: {
    padding: scale(10)
  },
  countryItem: {
    padding: scale(15),
    borderBottomWidth: 1,
    borderBottomColor: colors.lightHorizontalLine,
    alignItems: 'center'
  },
  selectedCountry: {
    backgroundColor: colors.fontMainColor
  },
  dropdown: {
    height: scale(50),
    borderColor: colors.fontPlaceholder,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    // عكس marginRight إلى marginLeft في حالة RTL
    [isRTL ? 'marginLeft' : 'marginRight']: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    // عكس left إلى right
    [isRTL ? 'right' : 'left']: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
})

export default styles
