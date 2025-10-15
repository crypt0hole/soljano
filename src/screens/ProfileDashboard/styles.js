import { Dimensions, Platform, StatusBar, StyleSheet } from 'react-native'
import { alignment, colors, scale } from '../../utils'
import { verticalScale } from '../../utils/scaling'
const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  safeAreaStyle: {
    backgroundColor: colors.headerbackground
  },
  mainContainer: {
    marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
  },
  headerContainer: {
    width: '90%',
    height: scale(50),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(15),
    paddingHorizontal: scale(5)
  },
  headerIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  headerTextContainer: {
    justifyContent: 'center',
    flex: 1,
    ...alignment.MLxSmall
  },
  scrollView: {
    flex: 1,
    width: '100%'
  },
  profileContainer: {
    width: '92%',
    alignSelf: 'center',
    borderRadius: scale(15),
    overflow: 'hidden',
    marginBottom: scale(20),
    backgroundColor: 'transparent'
  },
  imgBackground: {
    width: '100%',
    paddingBottom: scale(25),
    minHeight: height * 0.7
  },
  backgroundImage: {
    borderRadius: scale(15)
  },
  profileTopSection: {
    width: '100%',
    height: scale(60),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingTop: scale(10)
  },
  iconButton: {
    width: scale(45),
    height: scale(45),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(22.5),
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  profileImageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: scale(20),
    marginTop: scale(10)
  },
  profileImage: {
    width: verticalScale(120),
    height: verticalScale(120),
    borderRadius: verticalScale(60),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: verticalScale(3),
    borderColor: colors.brownColor,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden'
  },
  userPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: verticalScale(60)
  },
  nameContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: scale(25),
    paddingHorizontal: scale(20)
  },
  userName: {
    fontSize: scale(20),
    fontWeight: '700',
    color: colors.fontMainColor
  },
  userDataContainer: {
    width: '92%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: scale(15),
    padding: scale(20),
    marginBottom: scale(15)
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.lightHorizontalLine,
    marginBottom: scale(3)
  },
  labelContainer: {
    width: '38%'
  },
  dataLabel: {
    textAlign: 'right',
    fontWeight: '600',
    fontSize: scale(14),
    color: colors.fontMainColor,
    lineHeight: scale(20)
  },
  dataValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '62%',
    justifyContent: 'flex-end'
  },
  dataValue: {
    textAlign: 'right',
    flex: 1,
    paddingRight: scale(8),
    fontSize: scale(13),
    color: colors.fontSecondColor,
    lineHeight: scale(18)
  },
  fieldIcon: {
    marginLeft: scale(8),
    opacity: 0.8
  },
  warningValue: {
    fontWeight: '600',
    fontSize: scale(13),
    color: colors.errorColor
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(10),
    paddingHorizontal: scale(12),
    backgroundColor: 'rgba(255, 82, 82, 0.08)',
    borderRadius: scale(8),
    marginBottom: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.2)'
  },
  warningIcon: {
    marginLeft: scale(10)
  },
  warningText: {
    flex: 1,
    lineHeight: scale(18),
    fontSize: scale(12),
    color: colors.errorColor
  },
  editButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: scale(25),
    paddingHorizontal: scale(20)
  },
  editButton: {
    width: '85%',
    marginBottom: scale(12),
    height: scale(50),
    borderRadius: scale(12),
    backgroundColor: colors.brownColor
  },
  logoutButton: {
    width: '85%',
    backgroundColor: colors.errorColor,
    height: scale(50),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(8)
  },
  socialSectionContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: scale(20),
    paddingHorizontal: scale(20)
  },
  socialSectionTitle: {
    marginBottom: scale(15),
    fontWeight: '700',
    fontSize: scale(16),
    color: colors.fontMainColor
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginTop: scale(5),
    marginBottom: scale(15)
  },
  socialButton: {
    backgroundColor: '#25D366', // WhatsApp color
    width: '48%',
    height: scale(45),
    borderRadius: scale(12),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  instagramButton: {
    backgroundColor: '#E1306C', // Instagram color
    width: '48%',
    height: scale(45),
    borderRadius: scale(12),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  socialButtonText: {
    marginRight: scale(8),
    fontWeight: '600',
    fontSize: scale(13),
    color: '#FFFFFF'
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(30),
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  },
  loginButton: {
    width: '75%',
    height: scale(50),
    marginTop: scale(25),
    borderRadius: scale(12),
    backgroundColor: colors.brownColor
  },
  statusBadge: {
    minWidth: scale(60),
    alignSelf: 'flex-end',
    paddingVertical: scale(4),
    paddingHorizontal: scale(12),
    borderRadius: scale(20),
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: scale(8),
    marginRight: scale(2),
    marginVertical: scale(2)
  },

  // Interaction improvements
  pressableButton: {
    opacity: 0.8
  },
  
  // Small screen optimizations
  ...(height < 700 && {
    profileImage: {
      width: verticalScale(100),
      height: verticalScale(100),
      borderRadius: verticalScale(50),
      borderWidth: verticalScale(2)
    },
    userPhoto: {
      borderRadius: verticalScale(50)
    },
    nameContainer: {
      marginBottom: scale(20)
    },
    editButtonContainer: {
      marginTop: scale(20)
    },
    imgBackground: {
      minHeight: height * 0.6
    }
  }),

  // Large screen optimizations
  ...(width > 400 && {
    profileContainer: {
      width: '90%'
    },
    userDataContainer: {
      width: '90%'
    },
    socialButtonsContainer: {
      width: '80%'
    }
  })
})

export default styles