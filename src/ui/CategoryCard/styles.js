import { StyleSheet, Dimensions, I18nManager } from 'react-native'
import { colors, scale, alignment } from '../../utils'
const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    width: width * 0.4,
    height: scale(50),
    backgroundColor: colors.whiteColor,
    borderRadius: scale(5),
    ...alignment.MTxSmall,
    ...(I18nManager.isRTL ? alignment.MLxSmall : alignment.MRxSmall)
  },
  textViewContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(I18nManager.isRTL ? alignment.PLxSmall : alignment.PRxSmall),
    ...(I18nManager.isRTL ? alignment.PRxSmall : alignment.PLxSmall)
  }
})
export default styles
