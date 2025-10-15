// تحسينات خاصة بالخط العربي
import { StyleSheet } from 'react-native'
import { fontStyles, scale } from './index'

export const arabicTextStyles = StyleSheet.create({
  arabicText: {
    fontFamily: fontStyles.DGAgnadeenRegular,
    textAlign: 'right',
    writingDirection: 'rtl'
  },
  arabicTextBold: {
    fontFamily: fontStyles.DGAgnadeenRegular,
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: 'bold'
  },
  arabicTextLight: {
    fontFamily: fontStyles.DGAgnadeenLight,
    textAlign: 'right',
    writingDirection: 'rtl'
  },
  buttonText: {
    fontFamily: fontStyles.DGAgnadeenRegular,
    textAlign: 'center',
    fontSize: scale(16)
  },
  headerText: {
    fontFamily: fontStyles.DGAgnadeenRegular,
    textAlign: 'right',
    fontSize: scale(18),
    fontWeight: 'bold'
  }
})

export default arabicTextStyles
