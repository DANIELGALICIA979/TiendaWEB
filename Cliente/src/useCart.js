import { useCallback, useEffect, useState } from 'react'

const CART_STORAGE_KEY = 'nexus.cart.items'
const CART_CHANGE_EVENT = 'nexus:cart-change'

function readCart() {
  const storedCart = window.localStorage.getItem(CART_STORAGE_KEY)
  if (!storedCart) {
    return []
  }

  let items
  try {
    items = JSON.parse(storedCart)
  } catch {
    throw new Error('El carrito guardado está dañado. Vacíalo para comenzar de nuevo.')
  }

  if (!Array.isArray(items) || items.some(item => (
    !item
    || typeof item.id !== 'string'
    || typeof item.name !== 'string'
    || !Number.isFinite(item.price)
    || !Number.isInteger(item.quantity)
    || item.quantity < 1
  ))) {
    throw new Error('El carrito guardado tiene un formato inválido. Vacíalo para comenzar de nuevo.')
  }

  return items
}

function useCart() {
  const [items, setItems] = useState(() => {
    try {
      return readCart()
    } catch {
      return []
    }
  })
  const [error, setError] = useState('')

  useEffect(() => {
    function syncCart() {
      try {
        setItems(readCart())
        setError('')
      } catch (readError) {
        setError(readError.message)
      }
    }

    window.addEventListener('storage', syncCart)
    window.addEventListener(CART_CHANGE_EVENT, syncCart)
    return () => {
      window.removeEventListener('storage', syncCart)
      window.removeEventListener(CART_CHANGE_EVENT, syncCart)
    }
  }, [])

  const persistCart = useCallback((nextItems) => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems))
      setItems(nextItems)
      setError('')
      window.dispatchEvent(new Event(CART_CHANGE_EVENT))
      return true
    } catch (writeError) {
      setError(`No se pudo guardar el carrito: ${writeError.message}`)
      return false
    }
  }, [])

  const addItem = useCallback((item) => {
    try {
      const currentItems = readCart()
      const existingItem = currentItems.find(currentItem => currentItem.id === item.id)
      const nextItems = existingItem
        ? currentItems.map(currentItem => (
          currentItem.id === item.id
            ? { ...currentItem, quantity: currentItem.quantity + 1 }
            : currentItem
        ))
        : [...currentItems, { ...item, quantity: 1 }]

      return persistCart(nextItems)
    } catch (readError) {
      setError(readError.message)
      return false
    }
  }, [persistCart])

  const updateQuantity = useCallback((id, quantity) => {
    const nextItems = items.map(item => (
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    ))
    return persistCart(nextItems)
  }, [items, persistCart])

  const removeItem = useCallback((id) => {
    return persistCart(items.filter(item => item.id !== id))
  }, [items, persistCart])

  const clearCart = useCallback(() => persistCart([]), [persistCart])

  return { items, error, addItem, updateQuantity, removeItem, clearCart }
}

export default useCart
