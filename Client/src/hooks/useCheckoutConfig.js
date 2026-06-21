import { useState, useEffect } from 'react'
import api from '../api/axiosConfig'

/*
  Expected backend shape — GET /api/config/checkout-options:
  {
    "shipping": {
      "label": "Envío",
      "price": 9.99,
      "free": false,
      "freeThreshold": 50   // null = no threshold; subtotal >= threshold → free
    },
    "extras": [
      {
        "id": "gift_wrapping",
        "label": "Envoltura de regalos",
        "description": "Caja premium con moño y tarjeta personalizada",
        "price": 15.00,
        "optional": true,
        "defaultSelected": false
      }
    ]
  }
*/

const DEFAULTS = {
  shipping: {
    label: 'Envío',
    price: 0,
    free: true,
    freeThreshold: null,
  },
  extras: [
    {
      id: 'gift_wrapping',
      label: 'Envoltura de regalos',
      description: 'Presentación premium con moño y tarjeta personalizada',
      price: 15,
      optional: true,
      defaultSelected: false,
    },
  ],
}

export function useCheckoutConfig() {
  const [config, setConfig] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    api
      .get('/api/config/checkout-options')
      .then((res) => { if (!cancelled) setConfig(res.data) })
      .catch(() => { /* keep defaults */ })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { config, loading }
}
