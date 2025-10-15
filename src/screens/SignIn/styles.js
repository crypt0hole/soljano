import { Dimensions, StyleSheet, Platform } from 'react-native'
import { alignment, colors, scale, verticalScale } from '../../utils'
const { height, width } = Dimensions.get('window')

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  safeAreaStyle: {
    backgroundColor: colors.headerbackground
  },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: verticalScale(20)
  },
  body: {
    width: '95%',
    alignSelf: 'center'
  },
  bodyHeader: {
    height: '8%',
    width: '90%',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
    justifyContent: 'center', // center icon and text
  },
  headerText: {
    ...alignment.PLsmall,
    fontWeight: '600'
  },
  bodyContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: scale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
    paddingVertical: verticalScale(20)
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(0),
  },
  logo: {
    width: width * 1,
    height: height * 0.25,
    marginBottom: verticalScale(0),
  },
  bodyContainerBackground: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: scale(20),
  },
  bcTexts: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: verticalScale(0),
    marginBottom: verticalScale(0),
    marginTop: verticalScale(20), // add top margin for spacing
  },
  bcMain: {
    width: '85%',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  forgotPasswordText: {
    textAlign: 'center',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10)
  },
  registerBtnContainer: {
    marginTop: verticalScale(15),
    marginBottom: verticalScale(10)
  },
  bcInputs: {
    width: '90%'
  },
  ftUnderline: {
    textDecorationLine: 'underline'
  },
  LoginBtn: {
    backgroundColor: colors.buttonBackground,
    height: scale(45),
    borderRadius: scale(10)
  },
  main_brown_btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  appleBtn: {},
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
