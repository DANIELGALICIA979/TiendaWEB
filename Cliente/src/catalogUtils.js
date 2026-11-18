export function formatoPrecio(value) {
  const formattedAmount = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

  return `${formattedAmount} MXN`
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
