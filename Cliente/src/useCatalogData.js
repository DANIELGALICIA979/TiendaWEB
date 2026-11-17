import { useEffect, useState } from 'react'
import { obtenerCatalogo } from '../services/api.js'

function useCatalogData() {
  const [catalog, setCatalog] = useState({
    status: 'loading',
    games: [],
    categories: [],
    platforms: [],
  })
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let active = true

    obtenerCatalogo()
      .then(data => {
        if (active) {
          setCatalog({ status: 'ready', ...data })
        }
      })
      .catch(error => {
        if (active) {
          setCatalog({
            status: 'error',
            message: error.message,
            games: [],
            categories: [],
            platforms: [],
          })
        }
      })

    return () => {
      active = false
    }
  }, [reloadCount])

  return {
    catalog,
    retry: () => setReloadCount(count => count + 1),
  }
}

export default useCatalogData
