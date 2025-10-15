import { StyleSheet } from 'react-native';
import { colors as COLORS } from '../../utils/colors';
import { moderateScale } from '../../utils/scaling';
import { alignment, textStyles, fontStyles } from '../../utils';

const SIZES = {
  padding: alignment.Plarge.padding,
  bottomTabHeight: alignment.MBlarge.marginBottom,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.themeBackground,
  },
  // Search Header
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: moderateScale(4), // Further reduced vertical padding
    backgroundColor: COLORS.headerbackground,
  },
  searchBarWrapper: {
    flex: 1,
    marginRight: SIZES.padding,
  },
  filterBtn: {
    padding: moderateScale(10),
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  // List
  listContainer: {
    paddingHorizontal: SIZES.padding / 2,
    paddingBottom: 55, // ارتفاع القائمة السفلية فقط
  },
  productCard: {
    width: '48%', // Adjust width for two columns with a small gap
    margin: '1%', // Add margin for spacing
    height: moderateScale(240), // Set a fixed height for the card
  },

  // Loading/Error
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },

  // Filter Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: moderateScale(16),
    borderTopRightRadius: moderateScale(16),
    paddingTop: SIZES.padding * 0.8,
    paddingBottom: SIZES.padding * 1.2,
    paddingHorizontal: SIZES.padding * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  modalItem: {
    paddingVertical: moderateScale(10),
    paddingHorizontal: SIZES.padding * 0.7,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    borderRadius: 8,
    marginVertical: 2,
  },
  modalText: {
    ...textStyles.Center,
    ...fontStyles.Normal,
    color: COLORS.fontDark,
    fontSize: 15,
  },
  modalTextActive: {
    color: COLORS.primary,
    ...fontStyles.Bold,
    fontSize: 16,
  },
  modalItemActive: {
    backgroundColor: '#E6F0FD',
    borderColor: COLORS.primary,
    borderWidth: 1.2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default styles;