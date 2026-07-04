const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'

export const getBoxImageUrl = (box) => {
  return box.images?.[0]?.url ?? FALLBACK_IMAGE
}

export const getItemImageUrl = (item) => {
  return item.images?.[0]?.url ?? item.image ?? FALLBACK_IMAGE
}

export const formatPrice = (value) =>
  '$ ' + (value ? value.toLocaleString('es-AR') : '0')

export const getIconForCategory = (description = '', name = '') => {
  const s = `${description} ${name}`.toLowerCase()
  if (s.includes('gastron') || s.includes('culinari') || s.includes('comida') || s.includes('restaur')) return '🍽️'
  if (s.includes('aventura') || s.includes('trekk') || s.includes('outdoor') || s.includes('deport')) return '🧭'
  if (s.includes('entreteni') || s.includes('teatro') || s.includes('cine') || s.includes('espect')) return '🎭'
  if (s.includes('estad') || s.includes('hotel') || s.includes('alojam') || s.includes('hospedaj')) return '🏨'
  if (s.includes('relax') || s.includes('spa') || s.includes('bienestar') || s.includes('masaje')) return '💆'
  if (s.includes('viaje') || s.includes('tour') || s.includes('turismo')) return '✈️'
  if (s.includes('música') || s.includes('musica') || s.includes('concierto') || s.includes('recital')) return '🎵'
  if (s.includes('arte') || s.includes('museo') || s.includes('cultura') || s.includes('exposic')) return '🎨'
  if (s.includes('vino') || s.includes('bodega') || s.includes('cerveza')) return '🍷'
  if (s.includes('natura') || s.includes('eco') || s.includes('campo') || s.includes('parque')) return '🌿'
  if (s.includes('famil') || s.includes('niño') || s.includes('kids')) return '👨‍👩‍👧'
  if (s.includes('romántic') || s.includes('romantic') || s.includes('pareja')) return '❤️'
  return '✨'
}