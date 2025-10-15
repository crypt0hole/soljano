import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

const ConfigurationContext = React.createContext({})

export const ConfigurationProvider = props => {
  const [configuration, setConfiguration] = useState({
    currency: 'USD',
    currencySymbol: '$',
    deliveryCharges: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchConfiguration = async () => {
      try {
        const configDoc = await getDoc(doc(db, 'configuration', 'app'))
        if (configDoc.exists()) {
          setConfiguration(configDoc.data())
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching configuration:', err)
        setError(err)
        setLoading(false)
      }
    }

    fetchConfiguration()
  }, [])

  return (
    <ConfigurationContext.Provider value={{ ...configuration, loading, error }}>
      {props.children}
    </ConfigurationContext.Provider>
  )
}

ConfigurationProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export const ConfigurationConsumer = ConfigurationContext.Consumer
export default ConfigurationContext
