import { scale } from './scaling'
import { fontStyles } from './fontStyles'

// eslint-disable-next-line import/prefer-default-export
export const textStyles = {
  H1: {
    fontSize: scale(35)
  },
  H2: {
    fontSize: scale(24)
  },
  H3: {
    fontSize: scale(20)
  },
  H4: {
    fontSize: scale(16)
  },
  H5: {
    fontSize: scale(14)
  },
  Normal: {
    fontSize: scale(12)
  },
  Small: {
    fontSize: scale(10)
  },
  Regular: {
    fontFamily: fontStyles.DGAgnadeenRegular
  },
  Bold: {
    fontFamily: fontStyles.DGAgnadeenRegular
  },
  Light: {
    fontFamily: fontStyles.DGAgnadeenLight
  },
  Center: {
    textAlign: 'center'
  },
  Right: {
    textAlign: 'right'
  },
  UpperCase: {
    textTransform: 'uppercase'
  },
  LineOver: {
    textDecorationLine: 'line-through'
  }
}
