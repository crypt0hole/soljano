import { colors, alignment, textStyles, scale } from '../../utils'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderRadius: scale(10),
    height: scale(45), // Slightly increased height
    paddingHorizontal: alignment.Psmall.padding,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  button: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: alignment.PLxSmall.paddingLeft,
  },
  textfield: {
    ...textStyles.Regular,
    ...textStyles.H5,
    flex: 1,
    color: colors.fontDark,
  }
})
export default styles
