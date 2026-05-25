import { useQuery } from '@tanstack/react-query'
import type { Order } from '@/types/order.types'

/* ─── Mock orders — Fleur Indian fashion products ─────── */

const MOCK_ORDERS: Order[] = [
  {
    id:     'FL-48291',
    userId: 'usr_001',
    items: [
      {
        productId: '1',
        name:      'Gulabi Anarkali Kurta Set',
        brand:     'Rang by Fleur',
        emoji:     '👘',
        price:     1899,
        size:      'M',
        quantity:  1,
      },
      {
        productId: '5',
        name:      'Embroidered Organza Dupatta',
        brand:     'Rang by Fleur',
        emoji:     '🧣',
        price:     649,
        size:      'Free Size',
        quantity:  2,
      },
    ],
    shippingAddress: {
      firstName: 'Priya',
      lastName:  'Sharma',
      street:    '14 Linking Road, Bandra West',
      city:      'Mumbai',
      state:     'Maharashtra',
      pinCode:   '400050',
      phone:     '+91 98765 43210',
    },
    subtotal:          3197,
    discount:          0,
    shipping:          0,
    tax:               575,
    total:             3772,
    status:            'delivered',
    paymentMethod:     'upi',
    createdAt:         '2025-04-12T10:30:00Z',
    updatedAt:         '2025-04-15T14:00:00Z',
    estimatedDelivery: '2025-04-17T00:00:00Z',
  },
  {
    id:     'FL-47103',
    userId: 'usr_001',
    items: [
      {
        productId: '2',
        name:      'Floral Wrap Midi Dress',
        brand:     'Bloom Studio',
        emoji:     '👗',
        price:     1299,
        size:      'S',
        quantity:  1,
      },
    ],
    shippingAddress: {
      firstName: 'Priya',
      lastName:  'Sharma',
      street:    '14 Linking Road, Bandra West',
      city:      'Mumbai',
      state:     'Maharashtra',
      pinCode:   '400050',
      phone:     '+91 98765 43210',
    },
    subtotal:          1299,
    discount:          130,
    shipping:          0,
    tax:               214,
    total:             1383,
    status:            'shipped',
    paymentMethod:     'card',
    createdAt:         '2025-03-28T08:00:00Z',
    updatedAt:         '2025-03-30T12:00:00Z',
    estimatedDelivery: '2025-04-02T00:00:00Z',
  },
  {
    id:     'FL-45882',
    userId: 'usr_001',
    items: [
      {
        productId: '3',
        name:      'Chanderi Silk Saree',
        brand:     'Zari & Co.',
        emoji:     '🥻',
        price:     3499,
        size:      'Free Size',
        quantity:  1,
      },
      {
        productId: '8',
        name:      'Pearl Drop Earrings',
        brand:     'Zari & Co.',
        emoji:     '💍',
        price:     449,
        size:      'Free Size',
        quantity:  1,
      },
    ],
    shippingAddress: {
      firstName: 'Priya',
      lastName:  'Sharma',
      street:    '14 Linking Road, Bandra West',
      city:      'Mumbai',
      state:     'Maharashtra',
      pinCode:   '400050',
      phone:     '+91 98765 43210',
    },
    subtotal:          3948,
    discount:          395,
    shipping:          0,
    tax:               642,
    total:             4195,
    status:            'delivered',
    paymentMethod:     'upi',
    createdAt:         '2025-02-15T09:00:00Z',
    updatedAt:         '2025-02-18T16:00:00Z',
    estimatedDelivery: '2025-02-20T00:00:00Z',
  },
  {
    id:     'FL-44201',
    userId: 'usr_001',
    items: [
      {
        productId: '6',
        name:      'Lehenga Choli — Bridal Edit',
        brand:     'Zari & Co.',
        emoji:     '🥻',
        price:     8999,
        size:      'M',
        quantity:  1,
      },
    ],
    shippingAddress: {
      firstName: 'Priya',
      lastName:  'Sharma',
      street:    '14 Linking Road, Bandra West',
      city:      'Mumbai',
      state:     'Maharashtra',
      pinCode:   '400050',
      phone:     '+91 98765 43210',
    },
    subtotal:          8999,
    discount:          0,
    shipping:          0,
    tax:               1620,
    total:             10619,
    status:            'delivered',
    paymentMethod:     'cod',
    createdAt:         '2025-01-03T11:00:00Z',
    updatedAt:         '2025-01-08T10:00:00Z',
    estimatedDelivery: '2025-01-08T00:00:00Z',
  },
]

/* ─── Hooks ─────────────────────────────────────────────── */

async function fetchOrders(): Promise<Order[]> {
  await new Promise((r) => setTimeout(r, 600))
  return MOCK_ORDERS
}

export function useOrders() {
  return useQuery({
    queryKey:  ['orders'],
    queryFn:   fetchOrders,
    staleTime: 5 * 60 * 1000,
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400))
      const order = MOCK_ORDERS.find((o) => o.id === id)
      if (!order) throw new Error('Order not found')
      return order
    },
    enabled: !!id,
  })
}