import { StyleSheet } from 'react-native'
import { alignment, colors } from '../../utils'

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    overflow: 'hidden'
  },
  topCardContainer: {
    width: '100%',
    height: '65%'
  },
  imgResponsive: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  botCardContainer: {
    width: '100%',
    height: '35%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 6,
    justifyContent: 'space-between'
  },
  botSubCardContainer: {
    width: '100%',
    alignItems: 'flex-end'
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8B7355',
    textAlign: 'right'
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C4A484',
    marginTop: 2,
    textAlign: 'right'
  },
})
export default styles
