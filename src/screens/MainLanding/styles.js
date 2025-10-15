import { Dimensions, StyleSheet } from 'react-native'
import {
  alignment,
  fontStyles,
  colors,
  scale,
  verticalScale
} from '../../utils'
const { height, width } = Dimensions.get('window')

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  safeAreaStyle: {
    backgroundColor: colors.headerbackground
  },
  leftIconPadding: {
    // بدل PLsmall => PRsmall ، PRlarge => PLlarge
    ...alignment.PRsmall,
    ...alignment.PLlarge
  },
  scrollViewStyle: {
    marginTop: verticalScale(20),
    backgroundColor: colors.themeBackground
  },
  grayBackground: {
    backgroundColor: '#FFFFFF'
  },
  caroselContainer: {
    width: '100%',
    height: height * 0.3,
    position: 'relative',
    borderRadius: scale(12),
    overflow: 'hidden'
  },
  caroselStyle: {
    width,
    height: height * 0.3
  },
  menuDrawerContainer: {
    position: 'absolute',
    top: '10%',
    right: '2%', // بدل left => right
  },
  imgResponsive: {
    flex: 1,
    width: undefined,
    height: undefined
  },
  headingText: {
    fontFamily: fontStyles.PoppinsRegular,
    fontSize: scale(16),
    textAlign: 'right'  // اجعل النص محاذي لليمين في RTL
  },
  itemCardContainer: {
    width: scale(180),
    height: scale(230),
    borderRadius: scale(5),
    borderColor: colors.whiteColor,
    borderWidth: scale(2),
    ...alignment.MTsmall,
    ...alignment.MLlarge  // بدل MRlarge => MLlarge
  },
  categoryContainer: {
    width: '95%',
    alignSelf: 'center',
    flexDirection: 'row-reverse',  // بدل row => row-reverse
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: colors.whiteColor,
    paddingVertical: scale(20),
    marginTop: scale(15),
    marginBottom: scale(10),
    borderRadius: scale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleSpacer: {
    marginHorizontal: scale(20),
    marginTop: scale(25),
    marginBottom: scale(15)
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: scale(8),
    marginVertical: scale(8),
    borderRadius: scale(12),
    paddingVertical: scale(12),
    borderWidth: 1,
    borderColor: '#F5F5F5'
  },
  sectionHeader: {
    flexDirection: 'row-reverse', // بدل row => row-reverse
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(8),
    marginBottom: scale(8)
  },
  sectionTitle: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#7D5A50',
    fontFamily: fontStyles.PoppinsRegular,
    textAlign: 'right'  // محاذاة النص لليمين
  },
  seeAllButton: {
    backgroundColor: colors.fontBlue,
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(15)
  },
  seeAllText: {
    color: colors.whiteColor,
    fontSize: scale(12),
    fontWeight: '600'
  },
  productListContainer: {
    paddingHorizontal: scale(4)
  },
  smallProductCard: {
    width: scale(140),
    height: scale(180),
    marginHorizontal: scale(4)
  },
  featuredContainer: {
    marginHorizontal: scale(15),
    marginBottom: scale(20),
    borderRadius: scale(12),
    paddingVertical: scale(15),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4.65,
    elevation: 6,
  },
  featuredHeader: {
    flexDirection: 'row-reverse', // بدل row => row-reverse
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(15),
    marginBottom: scale(10)
  },
  featuredTitle: {
    fontSize: scale(20),
    fontWeight: 'bold',
    color: colors.whiteColor,
    textAlign: 'right'  // محاذاة لليمين
  },
  featuredSeeAll: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(15),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  featuredSeeAllText: {
    color: colors.whiteColor,
    fontSize: scale(12),
    fontWeight: '600'
  },
  productCard: {
    marginRight: '5%', // بدل marginLeft => marginRight
    width: '42%',
    height: scale(235),
    marginTop: scale(10),
    marginBottom: scale(20)
  },
  spacer: {
    ...alignment.MBsmall,
    marginHorizontal: scale(8)
  },
  scrollContent: {
    paddingBottom: scale(100) // Extra space for bottom tab
  }
})

export default styles
