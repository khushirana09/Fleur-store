import { z } from 'zod'

/* ─── Reusable field schemas ────────────────────────────── */

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Enter a valid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')

export const phoneSchema = z
  .string()
  .min(10, 'Enter a valid 10-digit phone number')
  .max(13)
  .regex(/^[+]?[\d\s-]+$/, 'Enter a valid phone number')

export const pinCodeSchema = z
  .string()
  .length(6, 'PIN code must be exactly 6 digits')
  .regex(/^\d+$/, 'PIN code must contain only digits')

/* ─── Form schemas ──────────────────────────────────────── */

export const loginSchema = z.object({
  email:    emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z
  .object({
    firstName:       z.string().min(2, 'First name must be at least 2 characters'),
    lastName:        z.string().min(2, 'Last name must be at least 2 characters'),
    email:           emailSchema,
    password:        passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const shippingSchema = z.object({
  firstName: z.string().min(2, 'Required'),
  lastName:  z.string().min(2, 'Required'),
  email:     emailSchema,
  phone:     phoneSchema,
  street:    z.string().min(5, 'Enter your full street address'),
  city:      z.string().min(2, 'Enter your city'),
  state:     z.string().min(2, 'Select a state'),
  pinCode:   pinCodeSchema,
})

export const profileSchema = z.object({
  firstName: z.string().min(2, 'Required'),
  lastName:  z.string().min(2, 'Required'),
  email:     emailSchema,
  phone:     phoneSchema.optional().or(z.literal('')),
})

/* ─── Inferred types ────────────────────────────────────── */

export type LoginFormData    = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ShippingFormData = z.infer<typeof shippingSchema>
export type ProfileFormData  = z.infer<typeof profileSchema>