import { textStyles, alignment } from '../../utils'
import { StyleSheet, Dimensions } from 'react-native'
import { fontStyles } from '../../utils/fontStyles'
const { height } = Dimensions.get('window')

const styles = StyleSheet.create({
  text: {
    ...textStyles.H5,
    ...alignment.PTxSmall,
    fontFamily: fontStyles.DGAgnadeenRegular,
    fontSize: 17,
    textAlign: 'center',
  },
  position: {
    marginTop: height * 0.08
  }
})
export default styles
