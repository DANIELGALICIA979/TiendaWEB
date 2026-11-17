export function formatoPrecio(value, currency) {
  const currencyCode = typeof currency === 'string' && currency.trim().length === 3
    ? currency.trim()
    : 'MXN'

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currencyCode,
  }).format(value)
}

export function nombreCatalogo(value) {
  if (typeof value === 'string') {
    return value
  }

  return typeof value?.name === 'string' ? value.name : ''
}

export function ofertasConDescuento(games) {
  return games
    .flatMap(game => (game.offers || []).map(offer => {
      const originalPrice = Number(offer.original_price)
      const discount = originalPrice > offer.price
        ? Math.round((originalPrice - offer.price) / originalPrice * 100)
        : 0

      return { game, offer, discount }
    }))
    .filter(item => item.discount > 0)
    .sort((first, second) => second.discount - first.discount)
}
