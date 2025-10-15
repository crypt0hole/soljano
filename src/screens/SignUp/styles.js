import { Dimensions, StyleSheet } from 'react-native'
import { verticalScale, scale } from '../../utils/scaling'
import { colors } from '../../utils/colors'
import { fontStyles } from '../../utils/fontStyles'

const { height, width } = Dimensions.get('window')
const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  safeAreaStyle: {
    backgroundColor: colors.headerbackground
  },
  container: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  body: {
    height: height * 0.9, // تقليل الارتفاع من 0.95 إلى 0.9
    width: '95%',
    alignSelf: 'center',
    marginTop: scale(-15) // إضافة هامش سالب من الأعلى
  },

  // Header
  header: {
    justifyContent: 'space-evenly',
    height: '12%', // تقليل الارتفاع من 15% إلى 12%
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center', // center the header text
  },

  // main
  main: {
    backgroundColor: colors.white,
    // height: '85%', // remove fixed height
    width: '90%',
    alignSelf: 'center',
    borderRadius: scale(15),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
    paddingBottom: verticalScale(20), // add inner bottom padding
    minHeight: 300, // ensure some minimum height
  },
  bodyContainerBackground: {
    alignItems: 'center',
    width: '100%',
    height: '83%',
    borderRadius: scale(15),
  },

  mainTop: {
    // height: '15%', // remove fixed height
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(20), // add top margin for spacing
  },
  mainMid: {
    // height: '60%', // remove fixed height
    width: '85%',
    justifyContent: 'center'
  },
  mainBot: {
    // height: '25%', // remove fixed height
    width: '85%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  botBtnContainer: {
    width: '100%'
  },
  mixedLine: {
    flexDirection: 'row',
    marginTop: scale(6), // add small space above the bottom text
  },
  ftTextUnderline: {
    textDecorationLine: 'underline'
  },
  
  // Nuevos estilos
  legalNameText: {
    marginTop: scale(3),
    fontSize: scale(11)
  },
simpleDropdown: {
  height: scale(40),
  borderRadius: scale(8),
  paddingHorizontal: scale(12),
  borderWidth: 1,
  borderColor: colors.backgroudGray,
  backgroundColor: colors.white,
  marginVertical: scale(5),
  flexDirection: 'row', // تأكد من اتجاه المكونات
  justifyContent: 'space-between',
  alignItems: 'center',
},

  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(15),
    paddingVertical: scale(8),
    borderBottomWidth: 1,
    borderBottomColor: colors.lightHorizontalLine,
  },
  countryItemText: {
    flex: 1,
    flexDirection: 'row-reverse',
    fontSize: scale(14),
    color: colors.fontMainColor,
    textAlign: 'left',
    marginLeft: scale(8),
    fontFamily: fontStyles.DGAgnadeenRegular,
  },
  flagText: {
    fontSize: scale(16),
    marginRight: scale(8),
    textAlign: 'right',
    },
  codeText: {
    fontSize: scale(12),
    color: colors.fontThirdColor,
    fontFamily: fontStyles.DGAgnadeenRegular,
  },
  phoneInputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  phonePrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.backgroudGray,
    borderRadius: scale(8),
    height: scale(45),
    paddingHorizontal: scale(8),
    marginRight: scale(5),
    borderTopLeftRadius: scale(8),
    borderBottomLeftRadius: scale(8),
    paddingHorizontal: scale(10),
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.backgroudGray,
    borderTopRightRadius: scale(8),
    borderBottomRightRadius: scale(8),
    height: scale(45),
    paddingHorizontal: scale(10),
  },
  // phoneInputWithPrefix no longer needed
  placeholderStyle: {
    fontSize: scale(14),
    color: colors.fontPlaceholder,
    textAlign: 'right',
    fontFamily: fontStyles.DGAgnadeenRegular,
  },
  selectedTextStyle: {
    fontSize: scale(14),
    color: colors.fontMainColor,
    textAlign: 'left',
    fontFamily: fontStyles.DGAgnadeenRegular,
  },
  countryError: {
    borderColor: colors.errorColor
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width: '80%',
    backgroundColor: colors.white,
    borderRadius: scale(15),
    padding: scale(20),
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    marginBottom: scale(20)
  },
  countryItem: {
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.lightHorizontalLine,
    width: '100%',
    alignItems: 'center'
  },
  closeButton: {
    marginTop: scale(20),
    backgroundColor: colors.brownColor,
    paddingVertical: scale(10),
    paddingHorizontal: scale(30),
    borderRadius: scale(10),
    alignItems: 'center'
  },
  generalErrorBox: {
    backgroundColor: '#fdecea',
    borderRadius: scale(10),
    padding: scale(10),
    marginTop: scale(12),
    marginBottom: scale(8),
    borderWidth: 1,
    borderColor: colors.errorColor,
    alignSelf: 'stretch',
    alignItems: 'center',
  }
})

export default styles
