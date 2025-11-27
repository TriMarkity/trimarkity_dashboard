"use client"

import React, { useState, useRef } from "react"
import { Eye, EyeOff, User, Mail, Lock, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import AuthLayout from "@/components/AuthLayout"
import { useAuth } from "@/lib/auth-context"
import { validateSignupForm } from "@/lib/auth-validation"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<string[]>([])
  const isSubmitting = useRef(false)
  
  const { signup, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (isSubmitting.current || isLoading) return
    isSubmitting.current = true

    const validation = validateSignupForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      isSubmitting.current = false
      return
    }

    setErrors([])

    // ✅ UPDATED: Added role: 'admin' to create admin users
    const signupPayload = {
      full_name: `${formData.firstName} ${formData.lastName}`.trim(),
      phone: formData.mobile,
      email: formData.email,
      password: formData.password,
      role: 'admin' // ✅ NEW: Set all signups as admin
    }

    try {
      console.log('🔄 Creating admin account...', signupPayload)
      
      const success = await signup(signupPayload as any)
      
      if (success) {
        console.log('✅ Admin account created successfully')
        router.push("/")
      } else {
        setErrors(["Failed to create admin account. Please try again."])
      }
    } catch (error) {
      console.error('Admin signup error:', error)
      setErrors(["Admin signup failed. Please try again."])
    } finally {
      isSubmitting.current = false
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        {/* Dashboard-themed Header with Logo */}
        <div className="text-center mb-8">
          {/* Logo and branding in horizontal layout */}
          <div className="flex items-center justify-center mb-6 space-x-3">
            <div className="w-11 h-11 rounded-xl p-1 bg-gradient-to-r from-blue-500 via animate-pulse hover:scale-110 transition-all duration-300 shadow-lg">
              <img
                src="/logo.png"
                alt="TriMarkity Logo"
                className="w-9 h-9 object-contain rounded-lg hover:brightness-110 transition-all duration-300"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold animate-pulse mb-0.5">
                <span className="text-white">Tri</span>
                <span className="text-blue-400">Mark</span>
                <span className="text-white">ity</span>
                <span className="text-xs font-normal text-gray-400 -ml-0.5 align-super">
                  <span className="text-white"> By Aar</span>
                  <span className="text-blue-400">Mark</span>
                  <span className="text-white">s</span>
                </span>
              </h1>
            </div>
          </div>

          {/* ✅ UPDATED: Changed to Admin Sign Up */}
          <h2 className="text-2xl font-bold text-white mb-0.5">Admin Sign Up</h2>
          {/* ✅ NEW: Add admin notice */}
          <p className="text-yellow-400 text-xs mb-4">
            ⚠️ Creating administrator account with full system access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dashboard-themed Error Messages */}
          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 animate-in slide-in-from-top-2 duration-300">
              {errors.map((error, index) => (
                <p key={index} className="text-red-400 text-xs flex items-center">
                  <span className="mr-1">⚠️</span>
                  {error}
                </p>
              ))}
            </div>
          )}

          {/* Dashboard-themed Name Fields Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="firstName" className="text-white text-sm font-medium">
                First Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, firstName: e.target.value })}
                  className="h-10 pl-10 bg-gray-800 border border-gray-600 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-300 transform focus:scale-[1.01]"
                  required
                  disabled={isLoading || isSubmitting.current}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="lastName" className="text-white text-sm font-medium">
                Last Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, lastName: e.target.value })}
                  className="h-10 pl-10 bg-gray-800 border border-gray-600 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-300 transform focus:scale-[1.01]"
                  required
                  disabled={isLoading || isSubmitting.current}
                />
              </div>
            </div>
          </div>

          {/* Dashboard-themed Email Field */}
          <div className="space-y-1">
            <Label htmlFor="email" className="text-white text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com" // ✅ UPDATED: Admin placeholder
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                className="h-10 pl-10 bg-gray-800 border border-gray-600 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-300 transform focus:scale-[1.01]"
                required
                disabled={isLoading || isSubmitting.current}
              />
            </div>
          </div>

          {/* Dashboard-themed Mobile Field */}
          <div className="space-y-1">
            <Label htmlFor="mobile" className="text-white text-sm font-medium">
              Mobile
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="mobile"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.mobile}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, mobile: e.target.value })}
                className="h-10 pl-10 bg-gray-800 border border-gray-600 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-300 transform focus:scale-[1.01]"
                required
                disabled={isLoading || isSubmitting.current}
              />
            </div>
          </div>

          {/* Dashboard-themed Password Fields */}
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1">
              <Label htmlFor="password" className="text-white text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create strong password"
                  value={formData.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                  className="h-10 pl-10 pr-10 bg-gray-800 border border-gray-600 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-300 transform focus:scale-[1.01]"
                  required
                  disabled={isLoading || isSubmitting.current}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                  disabled={isLoading || isSubmitting.current}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-white text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="h-10 pl-10 bg-gray-800 border border-gray-600 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-300 transform focus:scale-[1.01]"
                  required
                  disabled={isLoading || isSubmitting.current}
                />
              </div>
            </div>
          </div>

          {/* Dashboard-themed Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || isSubmitting.current}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm shadow-lg transform hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-2"
          >
            {isLoading || isSubmitting.current ? (
              <div className="flex items-center justify-center gap-x-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Admin Account...
              </div>
            ) : (
              "Create Admin Account" // ✅ UPDATED: Changed button text
            )}
          </Button>
        </form>
      </div>
    </AuthLayout>
  )
}
