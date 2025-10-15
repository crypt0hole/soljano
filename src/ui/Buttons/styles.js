import { verticalScale, scale, colors, fontStyles } from '../../utils'

const mainBtnStyles = {
  backgroundColor: {
    backgroundColor: colors.brownColor,
    height: scale(50),
    borderRadius: scale(10),
    // flat style without shadows
    marginVertical: scale(5)
  },
  main_brown_btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  btn_text: {
    color: colors.secondaryWhiteColor,
    fontFamily: fontStyles.DGAgnadeenRegular,
    fontSize: verticalScale(16),
    textAlign: 'center',
    fontWeight: '600'
  }
}

const alternateBtn = {
  backgroundColor: {
    backgroundColor: colors.secondaryWhiteColor,
    height: scale(50),
    borderRadius: scale(10),
    borderWidth: scale(1.5),
    borderColor: colors.brownColor,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  main_alt_btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  btn_text: {
    color: colors.brownColor,
    fontFamily: fontStyles.DGAgnadeenRegular,
    fontSize: verticalScale(16),
    fontWeight: '500',
    textAlign: 'center'
  }
}

const blueBtn = {
  backgroundColor: {
    backgroundColor: colors.buttonBackground,
    height: verticalScale(46),
    borderRadius: verticalScale(3)
  },
  main_blue_btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  btn_text: {
    color: colors.secondaryWhiteColor,
    fontFamily: fontStyles.DGAgnadeenRegular,
    fontSize: verticalScale(16),
    textAlign: 'center'
  }
}
const styles = {
  container: {
    backgroundColor: colors.brownColor,
    height: scale(40),
    borderRadius: scale(4),
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: colors.textBlueColor,
    fontFamily: fontStyles.DGAgnadeenRegular,
    fontSize: scale(16),
    textAlign: 'center'
  }
}

const alternateBlueBtn = {
  backgroundColor: {
    height: verticalScale(46),
    borderRadius: verticalScale(3),
    borderWidth: verticalScale(2),
    borderColor: colors.textBlueColor
  },
  main_blue_btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  btn_text: {
    color: colors.textBlueColor,
    fontFamily: fontStyles.DGAgnadeenRegular,
    fontSize: verticalScale(16),
    textAlign: 'center'
  }
}
export { alternateBtn, mainBtnStyles, blueBtn, alternateBlueBtn, styles }
