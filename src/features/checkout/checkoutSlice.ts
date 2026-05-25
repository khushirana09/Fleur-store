import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ShippingFormData } from '@/lib/utils/validators'

export type CheckoutStep = 'information' | 'shipping' | 'payment' | 'review'

export type ShippingMethod = 'standard' | 'express' | 'same-day'
export type PaymentMethod  = 'card' | 'upi' | 'netbanking' | 'cod'

export const SHIPPING_OPTIONS: Record<
  ShippingMethod,
  { label: string; description: string; price: number; days: string }
> = {
  standard: {
    label:       'Standard Delivery',
    description: '5–7 business days',
    price:       0,
    days:        '5–7',
  },
  express: {
    label:       'Express Delivery',
    description: '2–3 business days',
    price:       299,
    days:        '2–3',
  },
  'same-day': {
    label:       'Same Day Delivery',
    description: 'Order before 2 PM',
    price:       799,
    days:        '1',
  },
}

interface CheckoutState {
  step:           CheckoutStep
  shippingData:   ShippingFormData | null
  shippingMethod: ShippingMethod
  paymentMethod:  PaymentMethod
  orderId:        string | null
  isPlacingOrder: boolean
}

const initialState: CheckoutState = {
  step:           'information',
  shippingData:   null,
  shippingMethod: 'standard',
  paymentMethod:  'card',
  orderId:        null,
  isPlacingOrder: false,
}

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<CheckoutStep>) {
      state.step = action.payload
    },

    /** Save shipping form data and advance to next step */
    submitShippingInfo(state, action: PayloadAction<ShippingFormData>) {
      state.shippingData = action.payload
      state.step         = 'shipping'
    },

    setShippingMethod(state, action: PayloadAction<ShippingMethod>) {
      state.shippingMethod = action.payload
    },

    setPaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.paymentMethod = action.payload
    },

    /** Called when order API returns success */
    orderPlaced(state, action: PayloadAction<string>) {
      state.orderId        = action.payload
      state.step           = 'review'
      state.isPlacingOrder = false
    },

    setPlacingOrder(state, action: PayloadAction<boolean>) {
      state.isPlacingOrder = action.payload
    },

    /** Full reset — after order success or navigating away */
    resetCheckout() {
      return initialState
    },
  },
})

export const {
  setStep,
  submitShippingInfo,
  setShippingMethod,
  setPaymentMethod,
  orderPlaced,
  setPlacingOrder,
  resetCheckout,
} = checkoutSlice.actions

export default checkoutSlice.reducer