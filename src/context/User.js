import PropTypes from 'prop-types'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { 
  onAuthStateChange, 
  getUserProfile, 
  signOutUser,
  listenToUserProfile,
  updateUserStatusIfEmailVerified
} from '../firebase'
import uuid from 'uuid'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

const UserContext = React.createContext({})

export const UserProvider = props => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cart, setCart] = useState([]) // use initial state of cart here
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [errorOrders, setErrorOrders] = useState(null)

  // Authentication state listener
  // Only fetch user profile after successful sign up or login event
  const [initialMount, setInitialMount] = useState(true)
  useEffect(() => {
    const fetchProfileWithRetry = async (uid, retries = 3, delay = 1000) => {
      for (let i = 0; i < retries; i++) {
        try {
          const profile = await getUserProfile(uid)
          return profile
        } catch (err) {
          if (err.message === 'User profile not found' && i < retries - 1) {
            await new Promise(res => setTimeout(res, delay))
          } else {
            throw err
          }
        }
      }
    }

    const unsubscribe = onAuthStateChange(async (authUser) => {
      setLoading(true)
      if (initialMount) {
        // Skip fetching on first mount, just set flag
        setInitialMount(false)
        setLoading(false)
        return
      }
      if (authUser) {
        setUser(authUser)
        try {
          // Get user profile from Firestore with retry
          const profile = await fetchProfileWithRetry(authUser.uid)
          setUserProfile(profile)
          setError(null)
          // تحقق من تفعيل الإيميل وتحديث الحالة إذا لزم
          if (authUser.emailVerified && profile.status === 'pending') {
            await updateUserStatusIfEmailVerified();
            // أعد جلب الملف الشخصي بعد التحديث
            const updatedProfile = await fetchProfileWithRetry(authUser.uid)
            setUserProfile(updatedProfile)
          }
        } catch (err) {
          console.error('Error fetching user profile:', err)
          setError(err.message)
        }
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [initialMount])

  // Listen to user profile changes - only after profile is initially loaded
  useEffect(() => {
    if (!user) return;
    const unsubscribe = listenToUserProfile(user.uid, (profile) => {
      setUserProfile(profile)
    })
    return () => unsubscribe()
  }, [user])

  useEffect(() => {
    let isSubscribed = true
    ;(async () => {
      // Load cart from AsyncStorage
      const cart = await AsyncStorage.getItem('cartItems')
      isSubscribed && setCart(cart ? JSON.parse(cart) : [])
    })()
    return () => {
      isSubscribed = false
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await signOutUser()
      await AsyncStorage.removeItem('cartItems')
      setCart([])
      setUser(null)
      setUserProfile(null)
      setOrders([])
    } catch (error) {
      console.log('error on logout', error)
    }
  }, [])

  const fetchOrders = useCallback(async () => {
    if (!user) return
    setLoadingOrders(true)
    setErrorOrders(null)
    try {
      const ordersRef = collection(db, 'orders')
      const q = query(
        ordersRef,
        where('sellerId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      const fetched = []
      snapshot.forEach(doc => {
        fetched.push({ _id: doc.id, ...doc.data() })
      })
      setOrders(fetched)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setErrorOrders(err)
    } finally {
      setLoadingOrders(false)
    }
  }, [user])

  const fetchMoreOrdersFunc = useCallback(() => {
    // TODO: Implement pagination for orders
    console.log('Fetch more orders')
  }, [])

  const clearCart = useCallback(async () => {
    setCart([])
    await AsyncStorage.setItem('cartItems', JSON.stringify([]))
  }, [])

  const addQuantity = useCallback(async (key, quantity = 1) => {
    const cartIndex = cart.findIndex(c => c.key === key)
    cart[cartIndex].quantity += quantity
    setCart([...cart])
    await AsyncStorage.setItem('cartItems', JSON.stringify([...cart]))
  }, [cart])

  const removeQuantity = useCallback(async key => {
    const cartIndex = cart.findIndex(c => c.key === key)
    cart[cartIndex].quantity -= 1
    setCart([...cart.filter(c => c.quantity > 0)])
    await AsyncStorage.setItem(
      'cartItems',
      JSON.stringify(cart.filter(c => c.quantity > 0))
    )
  }, [cart])

  const addCartItem = useCallback(async (
    _id,
    product,
    image,
    quantity = 1,
    price,
    attributes
  ) => {
    cart.push({
      key: uuid.v4(),
      _id: _id,
      product: product,
      quantity: quantity,
      image: image,
      price: Number(price),
      selectedAttributes: attributes.map(({ attributeId, title, options }) => {
        return {
          title,
          attributeId,
          option: {
            optionId: options.optionId,
            title: options.title,
            price: options.price
          }
        }
      })
    })
    await AsyncStorage.setItem('cartItems', JSON.stringify([...cart]))
    setCart([...cart])
  }, [cart])

  const updateCart = useCallback(async cart => {
    setCart(cart)
    await AsyncStorage.setItem('cartItems', JSON.stringify(cart))
  }, [])

  const contextValue = useMemo(() => ({
    isLoggedIn: !!user && !!userProfile,
    loadingProfile: loading,
    errorProfile: error,
    profile: userProfile,
    user,
    logout,
    loading: loadingOrders,
    error: errorOrders,
    orders,
    fetchOrders,
    fetchMoreOrdersFunc,
    networkStatusOrders: 7,
    cart,
    cartCount: cart.length,
    clearCart,
    updateCart,
    addQuantity,
    removeQuantity,
    addCartItem,
    setProfile: setUserProfile
  }), [user, userProfile, loading, error, loadingOrders, errorOrders, orders, cart, logout, fetchOrders, fetchMoreOrdersFunc, clearCart, updateCart, addQuantity, removeQuantity, addCartItem, setUserProfile])

  return (
    <UserContext.Provider value={contextValue}>
      {props.children}
    </UserContext.Provider>
  )
}

UserProvider.propTypes = {
  children: PropTypes.node
}
export const UserConsumer = UserContext.Consumer
export default UserContext
