import { alignment, fontStyles, colors, scale } from '../../utils'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  input_view: {
    backgroundColor: colors.white,
    borderRadius: scale(10),
    height: scale(45),
    justifyContent: 'center',
    borderWidth: scale(1.5),
    marginVertical: scale(5)
  },
  input: {
    fontFamily: fontStyles.DGAgnadeenRegular,
    fontSize: scale(14),
    textAlign: 'right', // محاذاة النص لليمين للغة العربية
    ...alignment.PLsmall,
    paddingHorizontal: scale(15)
  }
})
export default styles
