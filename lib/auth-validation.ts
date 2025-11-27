export interface PasswordValidation {
  length: boolean
  lowercase: boolean
  uppercase: boolean
  special: boolean
}

export interface FormValidation {
  isValid: boolean
  errors: string[]
}

export const validatePassword = (password: string): PasswordValidation => {
  return {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }
}

export const isPasswordValid = (validation: PasswordValidation): boolean => {
  return Object.values(validation).every(Boolean)
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateCompanyEmail = (email: string): boolean => {
  // Check if email is valid first
  if (!validateEmail(email)) return false

  // Check if it's not a common personal email domain
  const personalDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com"]
  const domain = email.split("@")[1]?.toLowerCase()

  return !personalDomains.includes(domain)
}

export const validateMobile = (mobile: string): boolean => {
  // Remove all non-digit characters
  const cleanMobile = mobile.replace(/\D/g, "")

  // Check if it's a valid length (10-15 digits)
  return cleanMobile.length >= 10 && cleanMobile.length <= 15
}

export const validateName = (name: string): boolean => {
  // Check if name is at least 2 characters and contains only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']{2,}$/
  return nameRegex.test(name.trim())
}

export const validateLoginForm = (username: string, password: string): FormValidation => {
  const errors: string[] = []

  if (!username.trim()) {
    errors.push("Username is required")
  }

  if (!password) {
    errors.push("Password is required")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateSignupForm = (formData: {
  firstName: string
  lastName: string
  email: string
  mobile: string
  password: string
  confirmPassword: string
}): FormValidation => {
  const errors: string[] = []

  // Validate first name
  if (!validateName(formData.firstName)) {
    errors.push("First name must be at least 2 characters and contain only letters")
  }

  // Validate last name
  if (!validateName(formData.lastName)) {
    errors.push("Last name must be at least 2 characters and contain only letters")
  }

  // Validate email
  if (!validateEmail(formData.email)) {
    errors.push("Please enter a valid email address")
  } else if (!validateCompanyEmail(formData.email)) {
    errors.push("Please use a company email address (not personal email)")
  }

  // Validate mobile
  if (!validateMobile(formData.mobile)) {
    errors.push("Please enter a valid mobile number (10-15 digits)")
  }

  // Validate password
  const passwordValidation = validatePassword(formData.password)
  if (!isPasswordValid(passwordValidation)) {
    errors.push("Password must meet all requirements (8+ characters, uppercase, lowercase, special character)")
  }

  // Validate password confirmation
  if (formData.password !== formData.confirmPassword) {
    errors.push("Passwords do not match")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateResetPasswordForm = (newPassword: string, confirmPassword: string): FormValidation => {
  const errors: string[] = []

  // Validate new password
  const passwordValidation = validatePassword(newPassword)
  if (!isPasswordValid(passwordValidation)) {
    errors.push("Password must meet all requirements (8+ characters, uppercase, lowercase, special character)")
  }

  // Validate password confirmation
  if (newPassword !== confirmPassword) {
    errors.push("Passwords do not match")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
  const validation = validatePassword(password)
  const validCount = Object.values(validation).filter(Boolean).length

  switch (validCount) {
    case 0:
    case 1:
      return { strength: 25, label: "Weak", color: "bg-red-500" }
    case 2:
      return { strength: 50, label: "Fair", color: "bg-orange-500" }
    case 3:
      return { strength: 75, label: "Good", color: "bg-yellow-500" }
    case 4:
      return { strength: 100, label: "Strong", color: "bg-green-500" }
    default:
      return { strength: 0, label: "Weak", color: "bg-red-500" }
  }
}
