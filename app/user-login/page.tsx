"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, EyeOff, ArrowLeft, Lock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function UserLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [error, setError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  })

  const [tempUserData, setTempUserData] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      console.log('🔍 Full login response:', result)

      if (response.ok) {
        if (result.user && result.user.role !== 'user') {
          setError("Access denied. Only users with 'user' role can login here.")
          setIsLoading(false)
          return
        }

        if (result.user && result.user.role === 'admin') {
          setError("Admin access not allowed. Please use the admin dashboard.")
          setIsLoading(false)
          return
        }

        // ✅ UPDATED: Check only the mustChangePassword flag from API response
        if (result.user && result.user.mustChangePassword === true) {
          console.log('🔒 Password change required - showing modal')

          setTempUserData({
            token: result.access_token,
            user: result.user,
            originalPassword: formData.password
          })

          setShowPasswordModal(true)
          setIsLoading(false)
          return
        }

        // ✅ ENHANCED: Updated localStorage keys for campaign system with debugging
        console.log('✅ Normal login - proceeding to CRM')
        console.log('👤 User:', result.user.full_name, 'Role:', result.user.role)

        // Store in localStorage
        localStorage.setItem('trimarkity_token', result.access_token)
        localStorage.setItem('trimarkity_user', JSON.stringify(result.user))

        // ✅ DEBUG: Verify token contents
        console.log('🔑 Token saved (first 30 chars):', result.access_token.substring(0, 30) + '...')
        console.log('👤 User data saved:', {
          name: result.user.full_name,
          email: result.user.email,
          role: result.user.role,
          id: result.user.id
        })

        // ✅ DEBUG: Decode JWT to verify enhanced payload
        const tokenParts = result.access_token.split('.')
        if (tokenParts.length === 3) {
          try {
            const base64Url = tokenParts[1]
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            }).join(''))
            const decoded = JSON.parse(jsonPayload)
            console.log('🔓 Enhanced JWT Payload:', {
              userId: decoded.userId,
              email: decoded.email,
              name: decoded.name,
              role: decoded.role,
              exp: new Date(decoded.exp * 1000).toLocaleString()
            })

            // ✅ VERIFY: Check if enhanced fields are present
            if (decoded.name && decoded.role) {
              console.log('✅ JWT ENHANCED SUCCESSFULLY! Name:', decoded.name, 'Role:', decoded.role)
            } else {
              console.log('❌ JWT missing enhanced fields. Name:', decoded.name, 'Role:', decoded.role)
            }
          } catch (e) {
            console.error('❌ Failed to decode JWT:', e)
          }
        }

        // ✅ FIXED: Enhanced redirect with verification
        console.log('🚀 Redirecting to CRM in 2 seconds...')

        // ✅ VERIFY STORAGE BEFORE REDIRECT
        console.log('🔍 Pre-redirect verification:')
        console.log('- Token stored:', localStorage.getItem('trimarkity_token') ? 'YES' : 'NO')
        console.log('- User stored:', localStorage.getItem('trimarkity_user') ? 'YES' : 'NO')

        setTimeout(() => {
          // ✅ PASS TOKEN VIA URL PARAMETER
          const token = localStorage.getItem('trimarkity_token')
          const userData = localStorage.getItem('trimarkity_user')

          if (token && userData) {
            const crmUrl = `https://crm.trimarkity.app/?token=${encodeURIComponent(token)}&userData=${encodeURIComponent(userData)}`
            console.log('🔗 Redirecting to CRM with token (first 100 chars):', crmUrl.substring(0, 100) + '...')
            window.location.href = crmUrl
          } else {
            console.error('❌ No token found for CRM redirect')
            window.location.href = "https://crm.trimarkity.app/"
          }
        }, 2000)

      } else {
        setError(result.error || "Login failed")
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError("Network error: " + error.message)
      } else {
        setError("Network error. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      return
    }

    setIsChangingPassword(true)
    setPasswordError("")

    try {
      console.log('🔄 Sending password change request...')

      // ✅ UPDATED: Fixed endpoint to correct path
      const response = await fetch('/api/users/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempUserData.token}`
        },
        body: JSON.stringify({
          currentPassword: tempUserData.originalPassword,
          newPassword: passwordData.newPassword
        }),
      })

      const result = await response.json()
      console.log('📡 Password change response:', result)

      if (response.ok) {
        console.log('✅ Password changed successfully - redirecting to CRM')

        // ✅ ENHANCED: Updated localStorage keys for campaign system
        localStorage.setItem('trimarkity_token', result.access_token || tempUserData.token)
        localStorage.setItem('trimarkity_user', JSON.stringify(result.user || tempUserData.user))

        // ✅ VERIFY STORAGE AFTER PASSWORD CHANGE
        console.log('🔍 Post-password-change verification:')
        console.log('- Token stored:', localStorage.getItem('trimarkity_token') ? 'YES' : 'NO')
        console.log('- User stored:', localStorage.getItem('trimarkity_user') ? 'YES' : 'NO')

        setShowPasswordModal(false)
        setTempUserData(null)
        setPasswordData({ newPassword: "", confirmPassword: "" })

        // ✅ FIXED: Remove extra space and add verification
        const crmUrl = "https://crm.trimarkity.app/"
        console.log('🔗 Password change redirect to:', crmUrl)
        window.location.href = crmUrl

      } else {
        setPasswordError(result.error || "Failed to change password")
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setPasswordError("Network error: " + error.message)
      } else {
        setPasswordError("Network error. Please try again.")
      }
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Main Login Card */}
      <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-xl p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500">
              <img
                src="/logo.png"
                alt="TriMarkity Logo"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </div>

          <CardTitle className="text-2xl font-bold text-white">User Login</CardTitle>
          <p className="text-gray-400">Access your CRM dashboard</p>

          <p className="text-yellow-400 text-xs mt-2">
            ⚠️ This portal is for users only. Admins cannot access this login.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-white/5 border-white/10 text-white pr-10"
                  placeholder="Enter your password"
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
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Change Modal */}
      <Dialog open={showPasswordModal} onOpenChange={(open) => !open && setPasswordError("You must change your password to continue")}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <Lock className="h-5 w-5 mr-2 text-yellow-400" />
              Password Change Required
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              You must change your password before accessing the system.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-yellow-400 mr-2" />
              <p className="text-yellow-400 text-sm">
                For security reasons, you must create a new password.
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{passwordError}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-white">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white pr-10"
                  placeholder="Enter new password (min 8 characters)"
                  required
                  disabled={isChangingPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  disabled={isChangingPassword}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Confirm new password"
                required
                disabled={isChangingPassword}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Changing Password...
                </div>
              ) : (
                "Change Password & Continue"
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              You will be redirected to CRM after changing your password.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
