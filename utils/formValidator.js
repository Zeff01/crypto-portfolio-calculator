import { z } from 'zod'

export const firstNameSchema = z.string().min(1)
export const lastNameSchema = z.string().min(1)
export const usernameSchema = z.string().min(3)
export const emailSchema = z.string().email()
export const passwordSchema = z.string().min(6)