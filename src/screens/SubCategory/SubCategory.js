import React, { useEffect, useState } from 'react'
import { View, FlatList, Image } from 'react-native'
import styles from './styles'
import MainBtn from '../../ui/Buttons/MainBtn'
import {
  BottomTab,
  BackHeader,
  TextDefault,
  Spinner,
  TextError
} from '../../components'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getCategoryById } from '../../firebase'
import { colors } from '../../utils'
import { useRoute, useNavigation } from '@react-navigation/native'
import SubCategoryCard from '../../ui/SubCategoryCard/SubCategoryCard'

function SubCategory(props) {
  const route = useRoute()
  const navigation = useNavigation()
  const id = route.params?.id ?? null
  const title = route.params?.title ?? null
  const [subCategories, setSubCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  if (id === null) {
    navigation.goBack()
    return null
  }
  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const category = await getCategoryById(id)
        setSubCategories(category.subCategories || [])
      } catch (err) {
        console.error(err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSubs()
  }, [id])

  function emptyView() {
    return (
      <View style={styles.subContainerImage}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require('../../assets/images/noProducts.png')}></Image>
        </View>
        <View style={styles.descriptionEmpty}>
          <TextDefault textColor={colors.fontSecondColor} bold center>
            {`There are no sub categories for ${title}`}
          </TextDefault>
        </View>
        <View style={styles.emptyButton}>
          <MainBtn
            style={{ width: '100%' }}
            onPress={() => navigation.navigate('MainLanding')}
            text="Browse Product"
          />
        </View>
      </View>
    )
  }
  function renderItem({ item }) {
    return (
      <SubCategoryCard
        category={item}
        navigation={navigation}
      />
    )
  }
  return (
    <SafeAreaView style={styles.flex}>
      <BackHeader navigation={navigation} title={title} />
      {loading ? (
        <Spinner />
      ) : error ? (
        <TextError text={error.message} />
      ) : subCategories.length === 0 ? (
        emptyView()
      ) : (
        <FlatList
          data={Array.isArray(subCategories) ? subCategories : []}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id || index.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />
      )}
      <BottomTab screen="CATEGORY" />
    </SafeAreaView>
  )
}
export default SubCategory
