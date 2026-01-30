"use client"
import { UserPlus, Sun, Moon } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Settings,
  LogOut,
  Phone,
  Mail,
  UserCheck,
  Database,
  Shield,
  BrainCircuit,
  Users,
  Activity,
  BarChart3,
  Target,
  Zap,
  CheckCircle,
  ArrowUpRight,
  Bell,
  TrendingUp,
  User,
  Camera,
  Upload,
  Building,
  Eye,
  EyeOff,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  Monitor,
  AlertCircle,
  Clock,
  Calendar,
  TrendingDown,
  Award,
  Lightbulb,
  Brain,
  MessageSquare,
  Star
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Legend,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line
} from "recharts"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from '@/hooks/useTheme'

export default function MarketingDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()

  const handleCRMIntegrationClick = () => {
    console.log('🔗 Opening CRM with authentication...')

    // Get current user authentication data
    const accessToken = localStorage.getItem('access_token')
    const token = localStorage.getItem('token')
    const authToken = accessToken || token

    // Create user data object for CRM
    const userData = {
      id: user?.id || (user as any)?.userId || user?.email,
      email: user?.email,
      full_name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.full_name,
      firstName: user?.firstName,
      lastName: user?.lastName,
      role: user?.role || 'user'
    }

    if (authToken && userData.email) {
      try {
        // ✅ PASS AUTHENTICATION TO CRM
        const crmUrl = `https://crm.trimarkity.app/?token=${encodeURIComponent(authToken)}&userData=${encodeURIComponent(JSON.stringify(userData))}&source=main_dashboard&timestamp=${Date.now()}`

        window.open(crmUrl, '_blank')
      } catch (error) {
        // Fallback - open CRM without params
        window.open('https://crm.trimarkity.app/', '_blank')
      }
    } else {
      // Guest mode
      window.open('https://crm.trimarkity.app/', '_blank')
    }
  }

  // Email App Integration Function
  const openEmailApp = () => {
    console.log('🚀 Opening email app from Trimarkity Dashboard...')

    const accessToken = localStorage.getItem('access_token')
    const token = localStorage.getItem('token')
    const authToken = accessToken || token

    if (!authToken) {
      alert('Please log in first to access the Email app')
      console.error('❌ No authentication token found')
      return
    }

    console.log('✅ Found authentication token:', authToken.substring(0, 20) + '...')

    const tokenParts = authToken.split('.')
    if (tokenParts.length !== 3) {
      alert('Invalid authentication token. Please log in again.')
      console.error('❌ Invalid JWT token format')
      return
    }

    try {
      const payload = JSON.parse(atob(tokenParts[1]))
      console.log('📋 Token payload:', payload)
      console.log('User ID:', payload.userId)
      console.log('Email:', payload.email)
      console.log('Expires:', new Date(payload.exp * 1000))
    } catch (e) {
      console.warn('⚠️ Could not decode token payload:', e)
    }

    const emailAppUrl = `https://emp.trimarkity.app/?token=${encodeURIComponent(authToken)}`
    console.log('🔄 Redirecting to:', emailAppUrl)

    window.location.href = emailAppUrl
  }

  // State variables for user creation
  interface CreatedCredentials {
    email: string;
    tempPassword: string;
    userId?: string;
  }

  const [showCreateUser, setShowCreateUser] = useState(false)
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    department: ''
  })
  const [createdCredentials, setCreatedCredentials] = useState<CreatedCredentials | null>(null)
  const [createUserLoading, setCreateUserLoading] = useState(false)

  // Profile settings state
  const [activeTab, setActiveTab] = useState("profile")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    bio: ''
  })

  const [companyData, setCompanyData] = useState({
    companyName: '',
    position: '',
    department: '',
    website: ''
  })

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Loading and message states
  const [profileLoading, setProfileLoading] = useState(false)
  const [companyLoading, setCompanyLoading] = useState(false)
  const [securityLoading, setSecurityLoading] = useState(false)

  const [profileMessage, setProfileMessage] = useState('')
  const [companyMessage, setCompanyMessage] = useState('')
  const [securityMessage, setSecurityMessage] = useState('')

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New lead from Email Platform",
      message: "High-value prospect from enterprise segment",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "PBX System Alert",
      message: "Call volume increased by 15% today",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "CRM Integration Update",
      message: "Successfully synced 247 new contacts",
      time: "3 hours ago",
      unread: false,
    },
    {
      id: 4,
      title: "Quality Assurance Report",
      message: "Weekly quality score: 94.2%",
      time: "1 day ago",
      unread: false,
    },
  ])

  const unreadCount = notifications.filter((n) => n.unread).length

  // Initialize profile data when user loads
  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    let firstName = ''
    let lastName = ''

    if (user.full_name) {
      const nameParts = user.full_name.split(' ')
      firstName = nameParts[0] || ''
      lastName = nameParts.slice(1).join(' ') || ''
    }

    setProfileData({
      firstName: user.firstName || user.first_name || firstName,
      lastName: user.lastName || user.last_name || lastName,
      email: user.email || '',
      mobile: user.mobile || user.phone || '',
      bio: user.bio || ''
    })

    setCompanyData({
      companyName: user.company || '',
      position: user.position || '',
      department: user.department || '',
      website: user.website || ''
    })
  }, [user, router])

  // Profile save function
  const handleProfileSave = async () => {
    setProfileLoading(true)
    setProfileMessage('')

    try {
      const token = localStorage.getItem('token')
      const accessToken = localStorage.getItem('access_token')
      const authToken = token || accessToken

      if (!authToken) {
        setProfileMessage('Authentication required. Please log in again.')
        return
      }

      const tokenParts = authToken.split('.')
      if (tokenParts.length !== 3) {
        setProfileMessage('Invalid token format. Please log in again.')
        return
      }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(profileData)
      })

      if (response.ok) {
        const result = await response.json()
        setProfileMessage('Profile updated successfully!')

        const updatedUser = {
          ...user,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          mobile: profileData.mobile,
          phone: profileData.mobile,
          full_name: `${profileData.firstName} ${profileData.lastName}`,
          bio: profileData.bio
        }

        localStorage.setItem('user', JSON.stringify(updatedUser))
        setTimeout(() => window.location.reload(), 1000)

      } else {
        const errorText = await response.text()
        setProfileMessage(`Failed to save: HTTP ${response.status}: ${errorText}`)
      }
    } catch (error) {
      setProfileMessage(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setProfileLoading(false)
    }
  }

  // Company save function
  const handleCompanySave = async () => {
    setCompanyLoading(true)
    setCompanyMessage('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setCompanyMessage('Authentication required. Please log in again.')
        return
      }

      const response = await fetch('/api/users/company', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(companyData)
      })

      if (response.ok) {
        const result = await response.json()
        setCompanyMessage('Company information updated successfully!')
        setTimeout(() => setCompanyMessage(''), 3000)
      } else {
        const errorText = await response.text()
        setCompanyMessage(`Failed to save: HTTP ${response.status}: ${errorText}`)
      }
    } catch (error) {
      setCompanyMessage(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setCompanyLoading(false)
    }
  }

  // User creation function
  const handleCreateUser = async () => {
    if (!newUserData.name || !newUserData.email) {
      alert('Please fill in all required fields')
      return
    }

    setCreateUserLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUserData)
      })

      const result = await response.json()

      if (response.ok) {
        setCreatedCredentials(result.credentials)
        setNewUserData({ name: '', email: '', phone: '', department: '' })
      } else {
        alert(result.error || 'Failed to create user')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert('Network error: ' + error.message)
      } else {
        alert('Network error: Unknown error occurred')
      }
    } finally {
      setCreateUserLoading(false)
    }
  }

  // Security/Password update function
  const handleSecuritySave = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      setSecurityMessage('New passwords do not match.')
      return
    }

    if (securityData.newPassword.length < 8) {
      setSecurityMessage('Password must be at least 8 characters long.')
      return
    }

    setSecurityLoading(true)
    setSecurityMessage('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setSecurityMessage('Authentication required. Please log in again.')
        return
      }

      const response = await fetch('/api/users/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: securityData.currentPassword,
          newPassword: securityData.newPassword
        })
      })

      if (response.ok) {
        const result = await response.json()
        setSecurityMessage('Password updated successfully!')

        setSecurityData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })

        setTimeout(() => setSecurityMessage(''), 3000)
      } else {
        const errorText = await response.text()
        setSecurityMessage(`Failed to update password: HTTP ${response.status}: ${errorText}`)
      }
    } catch (error) {
      setSecurityMessage(`Failed to update password: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSecurityLoading(false)
    }
  }

  if (!user) {
    return null
  }

  const monthlyData = [
    { month: "Jan", leads: 3200, revenue: 180000, conversion: 24.5 },
    { month: "Feb", leads: 3800, revenue: 210000, conversion: 26.2 },
    { month: "Mar", leads: 4200, revenue: 245000, conversion: 28.1 },
    { month: "Apr", leads: 4600, revenue: 268000, conversion: 29.3 },
    { month: "May", leads: 4847, revenue: 285000, conversion: 31.2 },
  ]

  // Updated with blue color palette
  const marketData = [
    { name: "Email Platform", value: 35, color: "#097BA8" },
    { name: "PBX System", value: 28, color: "#4C9CC9" },
    { name: "CRM Integration", value: 22, color: "#6BC4F2" },
    { name: "Database", value: 15, color: "#52ABD8" },
  ]

  const performanceData = [
    { name: "Jan", conversion: 18.2, revenue: 45000, efficiency: 73 },
    { name: "Feb", conversion: 22.1, revenue: 52000, efficiency: 78 },
    { name: "Mar", conversion: 25.8, revenue: 61000, efficiency: 82 },
    { name: "Apr", conversion: 28.3, revenue: 68000, efficiency: 85 },
    { name: "May", conversion: 31.2, revenue: 75000, efficiency: 89 },
  ]

  const systemStatusData = [
    { name: "PBX System", uptime: 99.8, load: 67, alerts: 2 },
    { name: "Email Platform", uptime: 99.9, load: 43, alerts: 0 },
    { name: "CRM Integration", uptime: 98.7, load: 78, alerts: 1 },
    { name: "Database", uptime: 99.5, load: 56, alerts: 0 },
    { name: "Quality Assurance", uptime: 99.2, load: 34, alerts: 3 },
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-white text-blue-900'}`}>

      {/* Original Header Design */}
      <header className={`${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-white/95 border-gray-200'} backdrop-blur-sm border-b p-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">

            {/* Left Section - Logo */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              <div className="w-14 h-14 rounded-xl p-1 bg-gradient-to-r from-blue-400 via animate-pulse transition-all duration-300 shadow-lg">
                <img
                  src="/logo.png"
                  alt="TriMarkity Logo"
                  className="w-full h-full object-contain rounded-lg hover:animate-spin hover:scale-110 hover:brightness-110 transition-all duration-300"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold animate-pulse">
                  <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>Tri</span>
                  <span className="text-blue-400">Mark</span>
                  <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>ity</span>
                  <span className={`text-xs font-normal ${isDark ? 'text-gray-400' : 'text-gray-600'} -ml-0.5 align-super`}>
                    <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}> By Aar</span>
                    <span className="text-blue-400">Mark</span>
                    <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>s</span>
                  </span>
                </h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Marketing Dashboard</p>
              </div>
            </div>

            {/* Right Section - Buttons */}
            <div className="flex items-center space-x-3 flex-shrink-0">

              {/* Theme Toggle Button */}
              <Button
                onClick={toggleTheme}
                variant="ghost"
                size="sm"
                className={`p-2 rounded-lg transition-all duration-300 ${isDark
                  ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10'
                  : 'text-blue-600 hover:text-blue-700 hover:bg-blue-500/10'
                  }`}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {/* Create User Button */}
              <Button
                onClick={() => setShowCreateUser(true)}
                variant="ghost"
                size="sm"
                className="text-green-400 hover:text-green-300 hover:bg-green-500/10 px-3 py-1 rounded-lg transition-colors"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Create User
              </Button>

              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center bg-blue-500">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={`w-80 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{unreadCount} unread notifications</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b ${isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'} ${notification.unread ? "bg-blue-500/10" : ""
                          }`}
                      >
                        <div className="flex items-start space-x-3">
                          {notification.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>{notification.title}</p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{notification.message}</p>
                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-2`}>{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <Button variant="ghost" size="sm" className="w-full text-blue-400 hover:text-blue-300">
                      View all notifications
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/professional-headshot.png" alt="Profile" />
                      <AvatarFallback className={`${isDark
                        ? 'bg-gradient-to-r from-gray-900 to-blue-500 text-white'
                        : 'bg-gradient-to-r from--500 to-blue-500 text-black'
                        } `}>
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`w-56 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`} align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className={`text-sm font-medium leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className={`text-xs leading-none ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className={`${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <DropdownMenuItem onClick={() => setSettingsOpen(true)} className={`${isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className={`${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <DropdownMenuItem onClick={logout} className={`${isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </div>
        </div>
      </header>

      {/* Integrated Systems with Blue Shades */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6">
        {[
          { name: "Lead Intelligence", icon: Shield, status: "Integrated", link: "https://leadintelligence.trimarkity.app/" },
          { name: "Cloud Telephony", icon: Phone, status: "Integrated", link: "https://ctp.trimarkity.app/" },
          {
            name: "Email Marketing",
            icon: Mail,
            status: "Integrated",
            action: openEmailApp,
            isEmailApp: true
          },
          {
            name: "CRM",
            icon: UserCheck,
            status: "Integrated",
            action: handleCRMIntegrationClick,
            isCRMApp: true
          },
          
          { name: "AI TrueMarkIQ", icon: BrainCircuit, status: "Integrated", link: "https://truemarkiq.trimarkity.app" },
        ].map((system, index) => (
          <Card
            key={index}
            className={`backdrop-blur-sm border-2 transition-all cursor-pointer hover:shadow-lg hover:scale-105`}
            style={{
              backgroundColor: isDark ? '#097BA840' : '#097BA815',
              borderColor: '#097BA8'
            }}
            // ✅ BEFORE (BROKEN): Had two onClick handlers
            onClick={() => {
              if (system.isEmailApp || system.isCRMApp) {
                system.action?.();
              } else {
                window.open(system.link, "_blank");
              }
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <system.icon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} text-sm flex items-center justify-between`}>
                    {system.name}
                    <ArrowUpRight className="h-3 w-3 text-blue-400" />
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-400">{system.status}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <main className="p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className={`grid w-full grid-cols-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <TabsTrigger value="overview" className={`${isDark ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-white' : 'data-[state=active]:bg-white data-[state=active]:text-gray-900'}`}>
              Overview
            </TabsTrigger>
            <TabsTrigger value="systems" className={`${isDark ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-white' : 'data-[state=active]:bg-white data-[state=active]:text-gray-900'}`}>
              Systems
            </TabsTrigger>
            <TabsTrigger value="performance" className={`${isDark ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-white' : 'data-[state=active]:bg-white data-[state=active]:text-gray-900'}`}>
              Performance
            </TabsTrigger>
            <TabsTrigger value="insights" className={`${isDark ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-white' : 'data-[state=active]:bg-white data-[state=active]:text-gray-900'}`}>
              Insights
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Lead Metrics - All Blue Shades */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card
                className="backdrop-blur-sm border-2 hover:shadow-lg transition-all"
                style={{
                  backgroundColor: isDark ? '#097BA840' : '#097BA815',
                  borderColor: '#097BA8'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${isDark ? 'text-gray-400' : 'text-blue-700'} text-sm font-medium`}>Total Leads</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-gray-200' : 'text-blue-900'}`}>4,847</p>
                      <p className="text-emerald-500 text-sm flex items-center mt-1">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        +15.2% from last month
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card
                className="backdrop-blur-sm border-2 hover:shadow-lg transition-all"
                style={{
                  backgroundColor: isDark ? '#4C9CC940' : '#4C9CC915',
                  borderColor: '#4C9CC9'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${isDark ? 'text-gray-400' : 'text-blue-700'} text-sm font-medium`}>Qualified Leads</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-gray-200' : 'text-blue-900'}`}>3,652</p>
                      <p className="text-emerald-500 text-sm flex items-center mt-1">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        75.36% conversion rate
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card
                className="backdrop-blur-sm border-2 hover:shadow-lg transition-all"
                style={{
                  backgroundColor: isDark ? '#6BC4F240' : '#6BC4F215',
                  borderColor: '#6BC4F2'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${isDark ? 'text-gray-400' : 'text-blue-700'} text-sm font-medium`}>Hot Prospects</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-gray-200' : 'text-blue-900'}`}>567</p>
                      <p className="text-amber-500 text-sm flex items-center mt-1">
                        <Zap className="h-4 w-4 mr-1" />
                        Ready to close
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card
                className="backdrop-blur-sm border-2 hover:shadow-lg transition-all"
                style={{
                  backgroundColor: isDark ? '#52ABD840' : '#52ABD815',
                  borderColor: '#52ABD8'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${isDark ? 'text-gray-400' : 'text-blue-700'} text-sm font-medium`}>Lead Score Average</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-gray-200' : 'text-blue-900'}`}>87.2</p>
                      <p className="text-violet-500 text-sm flex items-center mt-1">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        High quality leads
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts with Blue Theme */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className={`${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-blue-200'} backdrop-blur-sm border-2`}>
                <CardHeader>
                  <CardTitle className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Monthly Growth Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#097BA8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#097BA8" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} className={`${isDark ? 'text-gray-400' : 'text-blue-600'}`} />
                      <YAxis axisLine={false} tickLine={false} className={`${isDark ? 'text-gray-400' : 'text-blue-600'}`} />
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#BFDBFE"} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? "#1f2937" : "#ffffff",
                          border: isDark ? "1px solid #374151" : "1px solid #BFDBFE",
                          borderRadius: "8px",
                          color: isDark ? "#fff" : "#1e40af",
                        }}
                      />
                      <Area type="monotone" dataKey="leads" stroke="#097BA8" fillOpacity={1} fill="url(#colorLeads)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className={`${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-blue-200'} backdrop-blur-sm border-2`}>
                <CardHeader>
                  <CardTitle className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Market Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={marketData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      >
                        {marketData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? "#1f2937" : "#ffffff",
                          border: isDark ? "1px solid #374151" : "1px solid #BFDBFE",
                          borderRadius: "8px",
                          color: isDark ? "#fff" : "#1e40af",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Systems Tab with Blue Shades */}
          <TabsContent value="systems" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card
                className="backdrop-blur-sm border-2 hover:shadow-lg transition-all"
                style={{
                  backgroundColor: isDark ? '#097BA840' : '#097BA815',
                  borderColor: '#097BA8'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${isDark ? 'text-gray-400' : 'text-blue-700'} text-sm font-medium`}>Systems Online</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-gray-200' : 'text-blue-900'}`}>5/5</p>
                      <p className="text-emerald-400 text-sm">All systems operational</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>

              <Card
                className="backdrop-blur-sm border-2 hover:shadow-lg transition-all"
                style={{
                  backgroundColor: isDark ? '#4C9CC940' : '#4C9CC915',
                  borderColor: '#4C9CC9'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${isDark ? 'text-gray-400' : 'text-blue-700'} text-sm font-medium`}>Active Alerts</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-gray-200' : 'text-blue-900'}`}>6</p>
                      <p className="text-amber-400 text-sm">Requires attention</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>

              <Card
                className="backdrop-blur-sm border-2 hover:shadow-lg transition-all"
                style={{
                  backgroundColor: isDark ? '#6BC4F240' : '#6BC4F215',
                  borderColor: '#6BC4F2'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${isDark ? 'text-gray-400' : 'text-blue-700'} text-sm font-medium`}>Average Uptime</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-gray-200' : 'text-blue-900'}`}>99.4%</p>
                      <p className="text-blue-500 text-sm">Last 30 days</p>
                    </div>
                    <Server className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {systemStatusData.map((system, index) => (
                <Card key={index} className={`${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-blue-200'} backdrop-blur-sm border-2`}>
                  <CardHeader>
                    <CardTitle className={`${isDark ? 'text-white' : 'text-blue-900'} flex items-center justify-between`}>
                      {system.name}
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-sm text-emerald-500">Online</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={`${isDark ? 'text-gray-400' : 'text-blue-600'}`}>Uptime</span>
                        <span className={`${isDark ? 'text-white' : 'text-blue-900'}`}>{system.uptime}%</span>
                      </div>
                      <Progress value={system.uptime} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={`${isDark ? 'text-gray-400' : 'text-blue-600'}`}>System Load</span>
                        <span className={`${isDark ? 'text-white' : 'text-blue-900'}`}>{system.load}%</span>
                      </div>
                      <Progress value={system.load} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-blue-600'}`}>Active Alerts</span>
                      <div className="flex items-center space-x-1">
                        {system.alerts > 0 && <AlertCircle className="h-4 w-4 text-amber-500" />}
                        <span className={`text-sm ${system.alerts > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {system.alerts}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Performance Tab - All Blue Shades */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card
                className="backdrop-blur-sm border-2 hover:shadow-lg transition-all"
                style={{
                  backgroundColor: isDark ? '#097BA840' : '#097BA815',
                  borderColor: '#097BA8'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${isDark ? 'text-gray-400' : 'text-blue-700'} text-sm font-medium`}>Conversion Rate</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-gray-200' : 'text-blue-900'}`}>31.2%</p>
                      <p className="text-emerald-500 text-sm flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +3.1% vs last month
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card
                className="backdrop-blur-sm border-2 hover:shadow-lg transition-all"
                style={{
                  backgroundColor: isDark ? '#4C9CC940' : '#4C9CC915',
                  borderColor: '#4C9CC9'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${isDark ? 'text-gray-400' : 'text-blue-700'} text-sm font-medium`}>Revenue Growth</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-gray-200' : 'text-blue-900'}`}>$75K</p>
                      <p className="text-emerald-500 text-sm flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +18.5% growth
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card
                className="backdrop-blur-sm border-2 hover:shadow-lg transition-all"
                style={{
                  backgroundColor: isDark ? '#6BC4F240' : '#6BC4F215',
                  borderColor: '#6BC4F2'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${isDark ? 'text-gray-400' : 'text-blue-700'} text-sm font-medium`}>Efficiency Score</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-gray-200' : 'text-blue-900'}`}>89%</p>
                      <p className="text-violet-500 text-sm flex items-center mt-1">
                        <Award className="h-4 w-4 mr-1" />
                        Excellent performance
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card
                className="backdrop-blur-sm border-2 hover:shadow-lg transition-all"
                style={{
                  backgroundColor: isDark ? '#52ABD840' : '#52ABD815',
                  borderColor: '#52ABD8'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${isDark ? 'text-gray-400' : 'text-blue-700'} text-sm font-medium`}>Response Time</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-gray-200' : 'text-blue-900'}`}>2.3s</p>
                      <p className="text-emerald-500 text-sm flex items-center mt-1">
                        <TrendingDown className="h-4 w-4 mr-1" />
                        -0.7s improvement
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 gap-6">
              <Card className={`${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-blue-200'} backdrop-blur-sm border-2`}>
                <CardHeader>
                  <CardTitle className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} className={`${isDark ? 'text-gray-400' : 'text-blue-600'}`} />
                      <YAxis axisLine={false} tickLine={false} className={`${isDark ? 'text-gray-400' : 'text-blue-600'}`} />
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#BFDBFE"} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? "#1f2937" : "#ffffff",
                          border: isDark ? "1px solid #374151" : "1px solid #BFDBFE",
                          borderRadius: "8px",
                          color: isDark ? "#fff" : "#1e40af",
                        }}
                      />
                      <Line type="monotone" dataKey="conversion" stroke="#097BA8" strokeWidth={2} />
                      <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Email Platform Metrics Table */}
              <Card className={`${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-blue-200'} backdrop-blur-sm border-2`}>
                <CardHeader>
                  <CardTitle className={`${isDark ? 'text-white' : 'text-blue-900'} flex items-center`}>
                    <Mail className="h-5 w-5 mr-2 text-blue-600" />
                    Email Platform Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className={`text-xs uppercase ${isDark ? 'bg-gray-800' : 'bg-blue-50'}`}>
                        <tr>
                          <th className={`px-4 py-3 ${isDark ? 'text-gray-400' : 'text-blue-600'}`}>Month</th>
                          <th className={`px-4 py-3 ${isDark ? 'text-gray-400' : 'text-blue-600'}`}>Open Rate</th>
                          <th className={`px-4 py-3 ${isDark ? 'text-gray-400' : 'text-blue-600'}`}>Click Rate</th>
                          <th className={`px-4 py-3 ${isDark ? 'text-gray-400' : 'text-blue-600'}`}>Conversions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { month: "Jan", openRate: 24.5, clickRate: 8.2, conversions: 142 },
                          { month: "Feb", openRate: 26.8, clickRate: 9.1, conversions: 158 },
                          { month: "Mar", openRate: 28.3, clickRate: 9.8, conversions: 172 },
                          { month: "Apr", openRate: 30.1, clickRate: 10.5, conversions: 186 },
                          { month: "May", openRate: 32.4, clickRate: 11.2, conversions: 203 },
                        ].map((data, index) => (
                          <tr key={index} className={`border-b ${isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-blue-100 hover:bg-blue-50'}`}>
                            <td className={`px-4 py-4 ${isDark ? 'text-white' : 'text-blue-900'} font-medium`}>{data.month}</td>
                            <td className="px-4 py-4 text-blue-600">{data.openRate}%</td>
                            <td className="px-4 py-4 text-emerald-600">{data.clickRate}%</td>
                            <td className="px-4 py-4 text-violet-600">{data.conversions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Email Summary Stats */}
                  <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-blue-200'}`}>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-blue-600'}`}>Avg Open Rate</p>
                        <p className="text-lg font-bold text-blue-600">28.4%</p>
                      </div>
                      <div>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-blue-600'}`}>Avg Click Rate</p>
                        <p className="text-lg font-bold text-emerald-600">9.8%</p>
                      </div>
                      <div>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-blue-600'}`}>Total Conversions</p>
                        <p className="text-lg font-bold text-violet-600">861</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tele/Phone Platform Metrics Table */}
              <Card className={`${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-blue-200'} backdrop-blur-sm border-2`}>
                <CardHeader>
                  <CardTitle className={`${isDark ? 'text-white' : 'text-blue-900'} flex items-center`}>
                    <Phone className="h-5 w-5 mr-2 text-emerald-600" />
                    Tele Platform Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className={`text-xs uppercase ${isDark ? 'bg-gray-800' : 'bg-blue-50'}`}>
                        <tr>
                          <th className={`px-4 py-3 ${isDark ? 'text-gray-400' : 'text-blue-600'}`}>Month</th>
                          <th className={`px-4 py-3 ${isDark ? 'text-gray-400' : 'text-blue-600'}`}>Connect Rate</th>
                          <th className={`px-4 py-3 ${isDark ? 'text-gray-400' : 'text-blue-600'}`}>Talk Time</th>
                          <th className={`px-4 py-3 ${isDark ? 'text-gray-400' : 'text-blue-600'}`}>Conversions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { month: "Jan", connectRate: 42.1, talkTime: "3:42", conversions: 89 },
                          { month: "Feb", connectRate: 44.8, talkTime: "4:15", conversions: 97 },
                          { month: "Mar", connectRate: 46.3, talkTime: "4:28", conversions: 108 },
                          { month: "Apr", connectRate: 48.7, talkTime: "4:51", conversions: 118 },
                          { month: "May", connectRate: 51.2, talkTime: "5:12", conversions: 127 },
                        ].map((data, index) => (
                          <tr key={index} className={`border-b ${isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-blue-100 hover:bg-blue-50'}`}>
                            <td className={`px-4 py-4 ${isDark ? 'text-white' : 'text-blue-900'} font-medium`}>{data.month}</td>
                            <td className="px-4 py-4 text-blue-600">{data.connectRate}%</td>
                            <td className="px-4 py-4 text-emerald-600">{data.talkTime}</td>
                            <td className="px-4 py-4 text-violet-600">{data.conversions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Tele Summary Stats */}
                  <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-blue-200'}`}>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-blue-600'}`}>Avg Connect Rate</p>
                        <p className="text-lg font-bold text-blue-600">46.6%</p>
                      </div>
                      <div>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-blue-600'}`}>Avg Talk Time</p>
                        <p className="text-lg font-bold text-emerald-600">4:34</p>
                      </div>
                      <div>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-blue-600'}`}>Total Conversions</p>
                        <p className="text-lg font-bold text-violet-600">539</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab - All Blue Shades */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card
                className="backdrop-blur-sm border-2 hover:shadow-lg transition-all"
                style={{
                  backgroundColor: isDark ? '#097BA840' : '#097BA815',
                  borderColor: '#097BA8'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Brain className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-blue-900'} mb-2`}>Lead Quality Insight</h3>
                      <p className={`${isDark ? 'text-gray-400' : 'text-blue-700'} text-sm`}>
                        Email platform leads show 23% higher conversion rates than PBX leads.
                        Consider increasing email campaign budget allocation.
                      </p>
                      <div className="mt-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          High Impact
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="backdrop-blur-sm border-2 hover:shadow-lg transition-all"
                style={{
                  backgroundColor: isDark ? '#4C9CC940' : '#4C9CC915',
                  borderColor: '#4C9CC9'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-blue-900'} mb-2`}>Optimization Opportunity</h3>
                      <p className={`${isDark ? 'text-gray-400' : 'text-blue-700'} text-sm`}>
                        Peak engagement hours are 10AM-12PM and 2PM-4PM.
                        Schedule campaigns during these windows for better results.
                      </p>
                      <div className="mt-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          Actionable
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="backdrop-blur-sm border-2 hover:shadow-lg transition-all"
                style={{
                  backgroundColor: isDark ? '#6BC4F240' : '#6BC4F215',
                  borderColor: '#6BC4F2'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Star className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-blue-900'} mb-2`}>Quality Assurance</h3>
                      <p className={`${isDark ? 'text-gray-400' : 'text-blue-700'} text-sm`}>
                        Customer satisfaction scores are 94.2% this week.
                        Top performing agents should mentor new team members.
                      </p>
                      <div className="mt-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          Excellence
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Predictive Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className={`${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-blue-200'} backdrop-blur-sm border-2`}>
                <CardHeader>
                  <CardTitle className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Predictive Lead Scoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { segment: "Enterprise Prospects", score: 94, trend: "up" },
                      { segment: "SMB Technology", score: 87, trend: "up" },
                      { segment: "Healthcare Sector", score: 76, trend: "stable" },
                      { segment: "Retail Chains", score: 63, trend: "down" },
                    ].map((item, index) => (
                      <div key={index} className={`flex items-center justify-between p-3 ${isDark ? 'bg-gray-800/50' : 'bg-blue-50'} rounded-lg`}>
                        <div>
                          <p className={`${isDark ? 'text-white' : 'text-blue-900'} font-medium`}>{item.segment}</p>
                          <p className={`${isDark ? 'text-gray-400' : 'text-blue-600'} text-sm`}>Lead Quality Score</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`${isDark ? 'text-white' : 'text-blue-900'} font-bold`}>{item.score}</span>
                          <div className={`p-1 rounded-full ${item.trend === 'up' ? (isDark ? 'bg-green-500/20' : 'bg-green-100') :
                            item.trend === 'down' ? (isDark ? 'bg-red-500/20' : 'bg-red-100') : (isDark ? 'bg-gray-500/20' : 'bg-gray-100')
                            }`}>
                            {item.trend === 'up' ? (
                              <TrendingUp className="h-4 w-4 text-emerald-600" />
                            ) : item.trend === 'down' ? (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            ) : (
                              <div className="h-4 w-4 bg-gray-400 rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className={`${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-blue-200'} backdrop-blur-sm border-2`}>
                <CardHeader>
                  <CardTitle className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Campaign Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Increase Email Budget",
                        description: "23% higher ROI potential identified",
                        priority: "High",
                        impact: "+$12K revenue"
                      },
                      {
                        title: "Optimize Call Schedule",
                        description: "Target 10AM-12PM peak hours",
                        priority: "Medium",
                        impact: "+15% contact rate"
                      },
                      {
                        title: "A/B Test Subject Lines",
                        description: "Current open rate below benchmark",
                        priority: "Medium",
                        impact: "+8% engagement"
                      },
                      {
                        title: "Retarget Lost Leads",
                        description: "1,247 prospects ready for re-engagement",
                        priority: "Low",
                        impact: "+5% conversions"
                      }
                    ].map((rec, index) => (
                      <div key={index} className={`p-4 ${isDark ? 'bg-gray-800/50' : 'bg-blue-50'} rounded-lg border-l-4 border-blue-600`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`${isDark ? 'text-white' : 'text-blue-900'} font-medium`}>{rec.title}</h4>
                            <p className={`${isDark ? 'text-gray-400' : 'text-blue-600'} text-sm mt-1`}>{rec.description}</p>
                            <p className="text-blue-600 text-sm font-medium mt-2">{rec.impact}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${rec.priority === 'High' ? (isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700') :
                            rec.priority === 'Medium' ? (isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-amber-100 text-amber-700') :
                              (isDark ? 'bg-green-500/20 text-green-400' : 'bg-emerald-100 text-emerald-700')
                            }`}>
                            {rec.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trend Analysis */}
            <Card className={`${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-blue-200'} backdrop-blur-sm border-2`}>
              <CardHeader>
                <CardTitle className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Market Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className={`w-16 h-16 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className={`${isDark ? 'text-white' : 'text-blue-900'} font-semibold mb-1`}>Rising Demand</h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-blue-600'} text-sm`}>Technology sector leads increasing by 34% this quarter</p>
                  </div>

                  <div className="text-center">
                    <div className={`w-16 h-16 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <MessageSquare className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className={`${isDark ? 'text-white' : 'text-blue-900'} font-semibold mb-1`}>Communication Shift</h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-blue-600'} text-sm`}>Email engagement up 28%, phone calls down 12%</p>
                  </div>

                  <div className="text-center">
                    <div className={`w-16 h-16 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className={`${isDark ? 'text-white' : 'text-blue-900'} font-semibold mb-1`}>Seasonal Pattern</h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-blue-600'} text-sm`}>Q2 historically shows 18% conversion boost</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Profile Settings Dialog with Blue Theme */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className={`max-w-4xl max-h-[80vh] overflow-y-auto ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-blue-200'}`}>
          <DialogHeader>
            <DialogTitle className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Profile Settings</DialogTitle>
            <DialogDescription className={`${isDark ? 'text-gray-400' : 'text-blue-600'}`}>
              Manage your account settings and preferences
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full grid-cols-3 ${isDark ? 'bg-gray-800' : 'bg-blue-100'}`}>
              <TabsTrigger value="profile" className={`${isDark ? 'data-[state=active]:bg-blue-600 data-[state=active]:text-white' : 'data-[state=active]:bg-white data-[state=active]:text-blue-900'}`}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="company" className={`${isDark ? 'data-[state=active]:bg-blue-600 data-[state=active]:text-white' : 'data-[state=active]:bg-white data-[state=active]:text-blue-900'}`}>
                <Building className="h-4 w-4 mr-2" />
                Company
              </TabsTrigger>
              <TabsTrigger value="security" className={`${isDark ? 'data-[state=active]:bg-blue-600 data-[state=active]:text-white' : 'data-[state=active]:bg-white data-[state=active]:text-blue-900'}`}>
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className={`${isDark ? 'text-white' : 'text-blue-900'}`}>First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-blue-300 text-blue-900'}`}
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-blue-300 text-blue-900'}`}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-blue-300 text-blue-900'}`}
                  placeholder="Enter your email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile" className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Mobile Number</Label>
                <Input
                  id="mobile"
                  value={profileData.mobile}
                  onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                  className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-blue-300 text-blue-900'}`}
                  placeholder="Enter your mobile number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-blue-300 text-blue-900'} min-h-[80px]`}
                  placeholder="Tell us about yourself..."
                />
              </div>

              {profileMessage && (
                <div className={`p-3 rounded-lg ${profileMessage.includes('successfully')
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'
                  : 'bg-red-500/10 border border-red-500/20 text-red-600'
                  }`}>
                  {profileMessage}
                </div>
              )}

              <Button
                onClick={handleProfileSave}
                disabled={profileLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </TabsContent>

            <TabsContent value="company" className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Company Name</Label>
                <Input
                  id="companyName"
                  value={companyData.companyName}
                  onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                  className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-blue-300 text-blue-900'}`}
                  placeholder="Enter your company name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="position" className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Position</Label>
                  <Input
                    id="position"
                    value={companyData.position}
                    onChange={(e) => setCompanyData({ ...companyData, position: e.target.value })}
                    className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-blue-300 text-blue-900'}`}
                    placeholder="Your job title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Department</Label>
                  <Input
                    id="department"
                    value={companyData.department}
                    onChange={(e) => setCompanyData({ ...companyData, department: e.target.value })}
                    className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-blue-300 text-blue-900'}`}
                    placeholder="Your department"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Company Website</Label>
                <Input
                  id="website"
                  value={companyData.website}
                  onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                  className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-blue-300 text-blue-900'}`}
                  placeholder="https://example.com"
                />
              </div>

              {companyMessage && (
                <div className={`p-3 rounded-lg ${companyMessage.includes('successfully')
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'
                  : 'bg-red-500/10 border border-red-500/20 text-red-600'
                  }`}>
                  {companyMessage}
                </div>
              )}

              <Button
                onClick={handleCompanySave}
                disabled={companyLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {companyLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                    className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-blue-300 text-blue-900'} pr-10`}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className={`absolute right-3 top-3 ${isDark ? 'text-gray-400 hover:text-white' : 'text-blue-600 hover:text-blue-900'}`}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className={`${isDark ? 'text-white' : 'text-blue-900'}`}>New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                    className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-blue-300 text-blue-900'} pr-10`}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={`absolute right-3 top-3 ${isDark ? 'text-gray-400 hover:text-white' : 'text-blue-600 hover:text-blue-900'}`}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                    className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-blue-300 text-blue-900'} pr-10`}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-3 ${isDark ? 'text-gray-400 hover:text-white' : 'text-blue-600 hover:text-blue-900'}`}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {securityMessage && (
                <div className={`p-3 rounded-lg ${securityMessage.includes('successfully')
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'
                  : 'bg-red-500/10 border border-red-500/20 text-red-600'
                  }`}>
                  {securityMessage}
                </div>
              )}

              <Button
                onClick={handleSecuritySave}
                disabled={securityLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {securityLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Create User Modal with Blue Theme */}
      <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
        <DialogContent className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-blue-200'} max-w-md`}>
          <DialogHeader>
            <DialogTitle className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Create New User</DialogTitle>
            <DialogDescription className={`${isDark ? 'text-gray-400' : 'text-blue-600'}`}>
              Create login credentials for a new user
            </DialogDescription>
          </DialogHeader>

          {!createdCredentials ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Full Name *</Label>
                <Input
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-blue-300 text-blue-900'}`}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Email *</Label>
                <Input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-blue-300 text-blue-900'}`}
                  placeholder="john@company.com"
                />
              </div>

              <div className="space-y-2">
                <Label className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Phone</Label>
                <Input
                  value={newUserData.phone}
                  onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                  className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-blue-300 text-blue-900'}`}
                  placeholder="+1234567890"
                />
              </div>

              <div className="space-y-2">
                <Label className={`${isDark ? 'text-white' : 'text-blue-900'}`}>Department</Label>
                <Input
                  value={newUserData.department}
                  onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })}
                  className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-blue-300 text-blue-900'}`}
                  placeholder="Sales"
                />
              </div>

              <Button
                onClick={handleCreateUser}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={createUserLoading}
              >
                {createUserLoading ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                <h3 className="text-emerald-600 font-semibold mb-2">User Created Successfully!</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={`${isDark ? 'text-gray-400' : 'text-blue-600'}`}>Email:</span>
                    <span className={`${isDark ? 'text-white' : 'text-blue-900'}`}>{createdCredentials.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${isDark ? 'text-gray-400' : 'text-blue-600'}`}>Password:</span>
                    <span className={`${isDark ? 'text-white' : 'text-blue-900'} font-mono ${isDark ? 'bg-gray-800' : 'bg-blue-100'} px-2 py-1 rounded`}>
                      {createdCredentials.tempPassword}
                    </span>
                  </div>
                </div>
                <p className="text-amber-600 text-xs mt-3">
                  ⚠️ Share these credentials securely with the user.
                </p>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(`Email: ${createdCredentials.email}\nPassword: ${createdCredentials.tempPassword}`)
                    alert('Credentials copied to clipboard!')
                  }}
                  variant="outline"
                  className={`flex-1 ${isDark ? 'border-gray-600 text-white hover:bg-gray-800' : 'border-blue-300 text-blue-900 hover:bg-blue-50'}`}
                >
                  Copy Credentials
                </Button>
                <Button
                  onClick={() => {
                    setCreatedCredentials(null)
                    setShowCreateUser(false)
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
