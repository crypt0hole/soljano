import React, { useState, useEffect } from 'react'
import { View, FlatList } from 'react-native'
import { Modal, TouchableOpacity, Text } from 'react-native'
import styles from './styles'
import SearchBar from '../../ui/SearchBar/SearchBar'
import ProductCard from '../../ui/ProductCard/ProductCard'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BackHeader, BottomTab, Spinner, TextError } from '../../components'
import { getAllProducts } from '../../firebase'
import { Ionicons } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from '../../utils/colors'

function SearchResults(props) {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterVisible, setFilterVisible] = useState(false)
  const [sortBy, setSortBy] = useState('newest') // options: newest, oldest, priceAsc, priceDesc

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProducts()
        // استبعاد المنتجات بدون فئة
        const filteredByCategory = data.filter(p => !!p.category)
        // sort by createdAt descending
        const sorted = filteredByCategory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setProducts(sorted)
        setFiltered(sorted)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    // search filter
    let data = products.filter(p => (
      search.trim() === '' || (p.name||'').toLowerCase().includes(search.trim().toLowerCase())
    ))
    // sort
    if (sortBy === 'newest') data.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))
    else if (sortBy === 'oldest') data.sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt))
    else if (sortBy === 'priceAsc') data.sort((a,b)=>(a.price||0)-(b.price||0))
    else if (sortBy === 'priceDesc') data.sort((a,b)=>(b.price||0)-(a.price||0))
    setFiltered(data)
  }, [search, products, sortBy])

  return (
    <SafeAreaView style={styles.container}>
      {/* Search & Filter header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBarWrapper}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="ابحث عن منتج..."
          />
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={()=>setFilterVisible(true)}>
          <Ionicons name="filter" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      {/* زر رجوع عائم تحت شريط البحث */}
      <View style={{
        position: 'absolute',
        top: 110,
        right: 16,
        zIndex: 100,
      }}>
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 8,
            paddingVertical: 7,
            paddingHorizontal: 18,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.10,
            shadowRadius: 3,
            borderWidth: 1,
            borderColor: '#EEE',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
      {error ? (
        <TextError text={error.message} />
      ) : loading ? (
        <Spinner />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item, idx) => item.id ? String(item.id) : String(idx)}
          numColumns={2}
          contentContainerStyle={[styles.listContainer, { flexDirection: undefined, flexWrap: undefined }]}
          renderItem={({ item }) => (
            <ProductCard {...item} styles={styles.productCard} />
          )}
          ListEmptyComponent={
            <View style={{width: '100%', alignItems: 'center', marginTop: 40}}>
              <Text style={{fontSize: 18, color: '#888'}}>لا توجد منتجات مطابقة لبحثك</Text>
            </View>
          }
        />
      )}
      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={()=>setFilterVisible(false)}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={()=>setFilterVisible(false)}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalContent}
            onPress={e => e.stopPropagation()}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#222',
              marginBottom: 8,
              textAlign: 'right',
              letterSpacing: 0.2
            }}>
              الترتيب حسب:
            </Text>
            <View style={{height: 1, backgroundColor: '#E5E7EB', marginBottom: 8}} />
            {[
              {key:'newest', label:'الأحدث أولاً'},
              {key:'oldest', label:'الأقدم أولاً'},
              {key:'priceAsc', label:'الارخص أولاً'},
              {key:'priceDesc', label:'الأغلى أولاً'}
            ].map(opt=>(
              <TouchableOpacity
                key={opt.key}
                style={[styles.modalItem, sortBy===opt.key && styles.modalItemActive]}
                onPress={()=>{setSortBy(opt.key);setFilterVisible(false)}}>
                <Text style={[styles.modalText, sortBy===opt.key && styles.modalTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      <BottomTab screen="SEARCH_RESULTS" />
    </SafeAreaView>
  )
}
export default SearchResults
