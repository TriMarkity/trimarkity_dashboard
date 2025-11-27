"use client"
import { UserPlus, User } from "lucide-react"
import React, { useState, useRef } from "react"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import AuthLayout from "@/components/AuthLayout"
import { useAuth } from "@/lib/auth-context"
import { validateLoginForm } from "@/lib/auth-validation"
import { useRouter } from "next/navigation"


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<string[]>([])
  const isSubmitting = useRef(false) // Prevent double submission
  
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation() // Prevent event bubbling
    
    // Prevent double submission
    if (isSubmitting.current || isLoading) return
    
    isSubmitting.current = true
    
    const validation = validateLoginForm(formData.email, formData.password)
    if (!validation.isValid) {
      setErrors(validation.errors)
      isSubmitting.current = false
      return
    }

    setErrors([])

    try {
      // ✅ UPDATED: Custom login with admin role check
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      })

      const result = await response.json()
      console.log('📡 Login result:', result)

      if (response.ok) {
        // ✅ NEW: Check if user role is 'admin' only
        if (result.user && result.user.role !== 'admin') {
          setErrors(["Access denied. Only administrators can login here."])
          isSubmitting.current = false
          return
        }

        // ✅ NEW: Additional check to explicitly reject users
        if (result.user && result.user.role === 'user') {
          setErrors(["User access not allowed. Please use the user login portal."])
          isSubmitting.current = false
          return
        }

        console.log('✅ Admin login successful')

        // Store admin token and data using your auth context
        const success = await login(formData.email, formData.password)
        
        if (success) {
          // ✅ NEW: Check for redirect_uri parameter from Email Frontend
          const urlParams = new URLSearchParams(window.location.search);
          const redirectUri = urlParams.get('redirect_uri');
          
          if (redirectUri) {
            console.log('🔍 Found redirect URI:', redirectUri);
            
            // ✅ Get the existing token from your auth context or result
            const token = result.token || result.access_token || localStorage.getItem('authToken');
            
            if (token) {
              // Redirect back to Email Frontend with token
              const redirectUrl = `${redirectUri}?token=${encodeURIComponent(token)}`;
              console.log('🚀 Redirecting back to Email Frontend:', redirectUrl);
              window.location.href = redirectUrl;
            } else {
              console.error('❌ No token found after successful login');
              router.push("/");
            }
          } else {
            // Default behavior - go to dashboard homepage
            console.log('📍 No redirect URI - going to dashboard');
            router.push("/");
          }
        } else {
          setErrors(["Login failed after authentication. Please try again."])
        }
        
      } else {
        setErrors([result.error || "Invalid email or password. Please try again."])
      }
    } catch (error: unknown) {
      console.error('Login error:', error)
      if (error instanceof Error) {
        setErrors(["Login failed: " + error.message])
      } else {
        setErrors(["Login failed. Please try again."])
      }
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
              <h1 className="text-2xl font-bold animate-pulse mb-2">
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

          {/* ✅ UPDATED: Changed to Admin Sign In */}
          <h2 className="text-3xl font-bold text-white mb-3">Admin Sign In</h2>
          {/* ✅ NEW: Add admin notice */}
          <p className="text-yellow-400 text-sm mb-4">
            ⚠️ This portal is for administrators only. Users cannot access this login.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dashboard-themed Error Messages */}
          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
              {errors.map((error, index) => (
                <p key={index} className="text-red-400 text-sm flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              ))}
            </div>
          )}

          {/* Dashboard-themed Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com" // ✅ UPDATED: Changed placeholder
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                className="h-14 pl-12 bg-gray-800 border border-gray-600 text-white placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 transform focus:scale-[1.01]"
                required
                disabled={isLoading || isSubmitting.current}
              />
            </div>
          </div>

          {/* Dashboard-themed Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="************"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                className="h-14 pl-12 pr-12 bg-gray-800 border border-gray-600 text-white placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 transform focus:scale-[1.01]"
                required
                disabled={isLoading || isSubmitting.current}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                disabled={isLoading || isSubmitting.current}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Dashboard-themed Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || isSubmitting.current}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading || isSubmitting.current ? (
              <div className="flex items-center justify-center gap-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </div>
            ) : (
              "Admin Sign In" // ✅ UPDATED: Changed button text
            )}
          </Button>
        </form>

        {/* Dashboard-themed Links */}
        <div className="mt-8 space-y-4 text-center">
          <p className="text-sm text-gray-400">
            Forgot your password?{" "}
            <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Reset here
            </Link>
          </p>
        </div>
        <div className="mt-8 space-y-4 text-center">
          {/* User Login Button - NEW */}
          <Link href="/user-login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            <span>User Login Portal →</span> {/* ✅ UPDATED: Better link text */}
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
