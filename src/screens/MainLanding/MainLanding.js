import React, { useState, useEffect } from 'react'
import { View, FlatList, ImageBackground, ScrollView, RefreshControl, TouchableOpacity, Dimensions } from 'react-native'
import { FlatList as RNFlatList } from 'react-native';
import styles from './styles'
import CategoryCard from '../../ui/CategoryCard/CategoryCard'
import { BottomTab, TextDefault, TextError, Spinner } from '../../components'
import { verticalScale, scale, colors } from '../../utils'
import ProductCard from '../../ui/ProductCard/ProductCard'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { getAllCategories, getAllProducts } from '../../firebase'
import SideSwipe from 'react-native-sideswipe'

const { width } = Dimensions.get('window')

const caroselImage = [
  require('../../assets/images/MainLanding/banner-1.jpg'),
  require('../../assets/images/MainLanding/banner-2.png'),
  require('../../assets/images/MainLanding/banner-3.png'),
  require('../../assets/images/MainLanding/banner-4.jpg')
]

const midBannerImages = [
  require('../../assets/images/MainLanding/recommend_1.jpg'),
  require('../../assets/images/MainLanding/recommend_3.jpg')
]

const bottomBannerImages = [
  require('../../assets/images/MainLanding/recommend_4.webp'),
  require('../../assets/images/MainLanding/recommend_5.webp')
]

function MainLanding(props) {
  const navigation = useNavigation()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [midBannerIndex, setMidBannerIndex] = useState(0)
  const [bottomBannerIndex, setBottomBannerIndex] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [categoriesData, productsData] = await Promise.all([
          getAllCategories(),
          getAllProducts()
        ])
        // استبعاد المنتجات بدون فئة
        const filteredProducts = Array.isArray(productsData) ? productsData.filter(p => !!p.category) : []
        setCategories(categoriesData)
        setProducts(filteredProducts)
        setError(null)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setCarouselIndex(prevIndex => (prevIndex + 1) % caroselImage.length)
    }, 5000) // 5 ثواني
    return () => clearTimeout(timer)
  }, [carouselIndex])

  useEffect(() => {
    const timer = setTimeout(() => {
      setMidBannerIndex(prevIndex => (prevIndex + 1) % midBannerImages.length)
    }, 5000) // 5 ثواني
    return () => clearTimeout(timer)
  }, [midBannerIndex])

  useEffect(() => {
    const timer = setTimeout(() => {
      setBottomBannerIndex(prevIndex => (prevIndex + 1) % bottomBannerImages.length)
    }, 5000) // 5 ثواني
    return () => clearTimeout(timer)
  }, [bottomBannerIndex])

  const refetch = async () => {
    try {
      setLoading(true)
      const [categoriesData, productsData] = await Promise.all([
        getAllCategories(),
        getAllProducts()
      ])
      // استبعاد المنتجات بدون فئة
      const filteredProducts = Array.isArray(productsData) ? productsData.filter(p => !!p.category) : []
      setCategories(categoriesData)
      setProducts(filteredProducts)
      setError(null)
    } catch (err) {
      console.error('Error refetching data:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const Featured = Array.isArray(products)
    ? products.filter(item => item && item.featured)
    : []

  const uniqueCategories =
    categories.length === 0 && Array.isArray(products) && products.length > 0
      ? [...new Set(products.map(item => item.category))].map((categoryName, index) => ({
          id: index.toString(),
          _id: index.toString(),
          name: categoryName,
          title: categoryName
        }))
      : categories

  const getProductsByCategory = (categoryName) => {
    return Array.isArray(products)
      ? products.filter(item => item && item.category === categoryName)
      : []
  }

  const renderCategorySection = (category) => {
    const categoryProducts = getProductsByCategory(category.title || category.name);
    if (!Array.isArray(categoryProducts) || categoryProducts.length === 0) {
      return null;
    }
    return (
      <View key={category._id || category.id} style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <TextDefault style={styles.sectionTitle}>
            {category.title || category.name}
          </TextDefault>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() =>
              navigation.navigate('ProductListing', {
                title: category.title || category.name,
                products: categoryProducts
              })
            }>
            <TextDefault style={styles.seeAllText}>{'عرض الكل'}</TextDefault>
          </TouchableOpacity>
        </View>
        <View style={[styles.productListContainer, { flexDirection: 'row-reverse' }]}> 
          {Array.isArray(categoryProducts) && categoryProducts.slice(0, 5).map((item, index) => (
            <ProductCard key={index} {...item} styles={styles.smallProductCard} />
          ))}
        </View>
      </View>
    );
  }

  function renderCarosel() {
    return (
      <View style={styles.caroselContainer}>
        <SideSwipe
          index={carouselIndex}
          data={caroselImage}
          style={{ width: '100%' }}
          itemWidth={width}
          threshold={80}
          onIndexChange={setCarouselIndex}
          renderItem={({ item }) => (
            <ImageBackground source={item} style={styles.caroselStyle} resizeMode="cover" />
          )}
        />
      </View>
    );
  }

  function renderHeader() {
    const firstCategory = uniqueCategories[0]
    const restCategories = uniqueCategories.slice(1)
    const beforeFourth = restCategories.slice(0, 3)
    const afterFourth = restCategories.slice(3)

    return (
      <>
        {renderCarosel()}
        {Array.isArray(Featured) && Featured.length > 0 && (
          <View style={styles.featuredContainer}>
            <View style={styles.featuredHeader}>
              <TextDefault style={styles.featuredTitle}>{'المنتجات المميزة'}</TextDefault>
              <TouchableOpacity
                style={styles.featuredSeeAll}
                onPress={() =>
                  navigation.navigate('ProductListing', {
                    title: 'المميزة',
                    products: Featured
                  })
                }>
                <TextDefault style={styles.featuredSeeAllText}>{'عرض الكل'}</TextDefault>
              </TouchableOpacity>
            </View>
            <View style={styles.productListContainer}>
              {Array.isArray(Featured) && Featured.slice(0, 5).map((item, index) => (
                <ProductCard key={index} {...item} />
              ))}
            </View>
          </View>
        )}
        {firstCategory && renderCategorySection(firstCategory)}

        <View style={{ height: verticalScale(150), marginVertical: verticalScale(10), flexDirection: 'row' }}>
          <SideSwipe
            index={midBannerIndex}
            data={midBannerImages}
            style={{ width: '100%' }}
            itemWidth={width}
            threshold={80}
            onIndexChange={setMidBannerIndex}
            renderItem={({ item }) => (
              <ImageBackground
                source={item}
                style={{
                  width: width,
                  height: verticalScale(150),
                  borderRadius: 12,
                  overflow: 'hidden'
                }}
                resizeMode="cover"
              />
            )}
          />
        </View>

        {beforeFourth.map(category => renderCategorySection(category))}

        {afterFourth.length > 0 && (
          <View style={{ height: verticalScale(150), marginVertical: verticalScale(10), flexDirection: 'row' }}>
            <SideSwipe
              index={bottomBannerIndex}
              data={bottomBannerImages}
              style={{ width: '100%' }}
              itemWidth={width}
              threshold={80}
              onIndexChange={setBottomBannerIndex}
              renderItem={({ item }) => (
                <ImageBackground
                  source={item}
                  style={{
                    width: width,
                    height: verticalScale(150),
                    borderRadius: 12,
                    overflow: 'hidden'
                  }}
                  resizeMode="cover"
                />
              )}
            />
          </View>
        )}

        {afterFourth.map(category => renderCategorySection(category))}
      </>
    )
  }

  return (
    <SafeAreaView style={[styles.flex, styles.safeAreaStyle]}>
      <View style={[styles.grayBackground, styles.flex]}>
        {error ? (
          <TextError text={error.message} />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
          >
            {renderHeader()}
          </ScrollView>
        )}
        <BottomTab screen="HOME" />
      </View>
    </SafeAreaView>
  )
}

export default MainLanding
