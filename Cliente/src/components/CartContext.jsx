import { useState } from 'react'
import CartContext from './cartContext.js'

const CART_STORAGE_KEY = 'nexus-cart'

function readCart() {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (!savedCart) return { items: [], error: null }
    const items = JSON.parse(savedCart)
    if (!Array.isArray(items) || items.some(item =>
      !item?.product || item.product.id === undefined || !Number.isInteger(item.quantity) || item.quantity < 1,
    )) {
      throw new Error('El carrito guardado no es válido.')
    }
    return { items, error: null }
  } catch (error) {
    return { items: [], error: `No se pudo cargar el carrito: ${error.message}` }
  }
}

export function CartProvider({ children }) {
  const [initialCart] = useState(readCart)
  const [items, setItems] = useState(initialCart.items)
  const [error, setError] = useState(initialCart.error)

  const saveItems = nextItems => {
    setItems(nextItems)
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems))
      setError(null)
    } catch (saveError) {
      setError(`No se pudo guardar el carrito: ${saveError.message}`)
    }
  }

  const addToCart = product => {
    if (product?.id === undefined || product?.id === null) {
      setError('El producto recibido no tiene identificador.')
      return false
    }
    const existing = items.find(item => item.product.id === product.id)
    const nextItems = existing
      ? items.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...items, { product, quantity: 1 }]
    saveItems(nextItems)
    return true
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      saveItems(items.filter(item => item.product.id !== productId))
      return
    }
    saveItems(items.map(item => item.product.id === productId ? { ...item, quantity } : item))
  }

  const removeFromCart = productId => {
    saveItems(items.filter(item => item.product.id !== productId))
  }

  const clearCart = () => saveItems([])
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const value = { items, loading: false, error, itemCount, addToCart, updateQuantity, removeFromCart, clearCart }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
