import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  setStep,
  submitShippingInfo,
  setShippingMethod,
  setPaymentMethod,
  orderPlaced,
  setPlacingOrder,
  resetCheckout,
  type CheckoutStep,
  type ShippingMethod,
  type PaymentMethod,
} from '../checkoutSlice'
import { clearCart } from '@/features/cart/cartSlice'
import type { ShippingFormData } from '@/lib/utils/validators'
import { ROUTES } from '@/lib/constants/routes'
import toast from 'react-hot-toast'

function generateOrderId(): string {
  return `LX-${Math.floor(10000 + Math.random() * 90000)}`
}

export function useCheckout() {
  const dispatch  = useAppDispatch()
  const navigate  = useNavigate()
  const checkout  = useAppSelector((s) => s.checkout)
  const cartItems = useAppSelector((s) => s.cart.items)

  /* ── Step navigation ── */

  const goToStep = useCallback(
    (step: CheckoutStep) => dispatch(setStep(step)),
    [dispatch]
  )

  /* ── Submit shipping information form ── */

  const handleShippingSubmit = useCallback(
    (data: ShippingFormData) => {
      dispatch(submitShippingInfo(data))
    },
    [dispatch]
  )

  /* ── Shipping method selection ── */

  const selectShippingMethod = useCallback(
    (method: ShippingMethod) => dispatch(setShippingMethod(method)),
    [dispatch]
  )

  /* ── Payment method selection ── */

  const selectPaymentMethod = useCallback(
    (method: PaymentMethod) => dispatch(setPaymentMethod(method)),
    [dispatch]
  )

  /* ── Place order ── */

  const placeOrder = useCallback(async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    dispatch(setPlacingOrder(true))

    try {
      // Simulate API call — replace with:
      // const res = await apiClient.post('/orders', { ...checkout, items: cartItems })
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const orderId = generateOrderId()
      dispatch(orderPlaced(orderId))
      dispatch(clearCart())

      toast.success('Order placed successfully!', { duration: 4000 })
      navigate(ROUTES.CHECKOUT_SUCCESS)
    } catch {
      toast.error('Failed to place order. Please try again.')
      dispatch(setPlacingOrder(false))
    }
  }, [dispatch, navigate, cartItems])

  /* ── Reset on unmount / cancel ── */

  const reset = useCallback(() => {
    dispatch(resetCheckout())
  }, [dispatch])

  return {
    ...checkout,
    goToStep,
    handleShippingSubmit,
    selectShippingMethod,
    selectPaymentMethod,
    placeOrder,
    reset,
  }
}