"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    special: false,
  })

  const validatePassword = (password: string) => {
    setPasswordValidation({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    })
  }

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, newPassword: password })
    validatePassword(password)
    setError("") // Clear any previous errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Check if passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Check password validation
    const isPasswordValid = Object.values(passwordValidation).every(Boolean)
    if (!isPasswordValid) {
      setError("Password does not meet requirements")
      return
    }

    if (!token) {
      setError("Invalid reset token")
      return
    }

    setIsLoading(true)

    try {
      // ✅ FIXED: Actually call the reset password API
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          password: formData.newPassword
        })
      })

      const result = await response.json()

      if (response.ok) {
        setIsSuccess(true)
      } else {
        setError(result.error || "Failed to reset password")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Check if token is valid
  useEffect(() => {
    if (!token) {
      // Redirect to forgot password if no token
      window.location.href = "/forgot-password"
    }
  }, [token])

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Password Reset Successful</CardTitle>
            <CardDescription className="text-gray-400">
              Your password has been successfully updated. You can now sign in with your new password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Continue to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Create New Password</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your new password below. Make sure it meets all requirements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-white">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="text-xs space-y-1 mt-2">
                <div className={`flex items-center gap-2 ${passwordValidation.length ? "text-green-400" : "text-gray-400"}`}>
                  <div className={`w-2 h-2 rounded-full ${passwordValidation.length ? "bg-green-400" : "bg-gray-600"}`} />
                  8+ characters
                </div>
                <div className={`flex items-center gap-2 ${passwordValidation.lowercase ? "text-green-400" : "text-gray-400"}`}>
                  <div className={`w-2 h-2 rounded-full ${passwordValidation.lowercase ? "bg-green-400" : "bg-gray-600"}`} />
                  Lowercase letter
                </div>
                <div className={`flex items-center gap-2 ${passwordValidation.uppercase ? "text-green-400" : "text-gray-400"}`}>
                  <div className={`w-2 h-2 rounded-full ${passwordValidation.uppercase ? "bg-green-400" : "bg-gray-600"}`} />
                  Uppercase letter
                </div>
                <div className={`flex items-center gap-2 ${passwordValidation.special ? "text-green-400" : "text-gray-400"}`}>
                  <div className={`w-2 h-2 rounded-full ${passwordValidation.special ? "bg-green-400" : "bg-gray-600"}`} />
                  Special character
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <p className="text-red-400 text-xs">Passwords do not match</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Updating Password..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
