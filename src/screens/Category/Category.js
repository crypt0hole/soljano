import React, { useState, useEffect } from 'react'
import { View, FlatList } from 'react-native'
import styles from './styles'
import CategoryCard from '../../ui/CategoryCard/CategoryCard'
import { BottomTab, BackHeader, TextError, Spinner } from '../../components'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getAllCategories } from '../../firebase'

function Category(props) {
  const [categoriesData, setCategoriesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await getAllCategories()
        setCategoriesData(cats)
      } catch (err) {
        console.error(err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCats()
  }, [])

  return (
    <SafeAreaView style={[styles.flex, styles.safeAreaStyle]}>
      <View style={[styles.grayBackground, styles.flex]}>
        <BackHeader
          title="Categories"
          backPressed={() => props.navigation.goBack()}
        />
        {error ? (
          <TextError text={error.message} />
        ) : loading ? (
          <Spinner />
        ) : (
          <FlatList
            style={styles.flex}
            contentContainerStyle={styles.categoryContainer}
            data={Array.isArray(categoriesData) ? categoriesData : []}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            renderItem={({ item, index }) => (
              <CategoryCard
                style={styles.spacer}
                key={item.id || index}
                cardLabel={item.title || item.name}
                id={item.id}
              />
            )}
          />
        )}
        <BottomTab screen="HOME" />
      </View>
    </SafeAreaView>
  )
}
export default Category
