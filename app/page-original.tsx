"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Settings,
  LogOut,
  Phone,
  Mail,
  UserCheck,
  Database,
  Shield,
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

export default function MarketingDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // WORKING PROFILE SETTINGS STATE (from confirmed working code)
  const [activeTab, setActiveTab] = useState("profile")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Form states for profile settings
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

    // Parse full_name into first and last name
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

    // Initialize company data from user if available
    setCompanyData({
      companyName: user.company || '',
      position: user.position || '',
      department: user.department || '',
      website: user.website || ''
    })
  }, [user, router])

  /// ✅ Helper: get auth token from localStorage
  function getAuthToken(): string | null {
    return localStorage.getItem("token") || localStorage.getItem("access_token")
  }

  // ✅ Helper: standardized PUT request
  async function putData(url: string, token: string, data: any) {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    return response
  }

  // ✅ Profile save
  const handleProfileSave = async () => {
    setProfileLoading(true)
    setProfileMessage("")

    try {
      const token = getAuthToken()
      if (!token) {
        setProfileMessage("Authentication required. Please log in again.")
        return
      }

      const response = await putData("/api/users/profile", token, profileData)

      if (response.ok) {
        const result = await response.json()
        console.log("✅ Profile save success:", result)
        setProfileMessage("Profile updated successfully!")

        // Update local user object
        const updatedUser = {
          ...user,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          mobile: profileData.mobile,
          phone: profileData.mobile,
          full_name: `${profileData.firstName} ${profileData.lastName}`,
          bio: profileData.bio,
        }
        localStorage.setItem("user", JSON.stringify(updatedUser))

        // 🔄 Instead of reload: update context/state if available
        // window.location.reload()
      } else {
        const errorText = await response.text()
        console.error("❌ Profile save error:", errorText)
        setProfileMessage("Failed to update profile. Please try again.")
      }
    } catch (error) {
      console.error("❌ Profile save network error:", error)
      setProfileMessage(`Failed to save: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setProfileLoading(false)
    }
  }

  // ✅ Company save
  const handleCompanySave = async () => {
    setCompanyLoading(true)
    setCompanyMessage("")

    try {
      const token = getAuthToken()
      if (!token) {
        setCompanyMessage("Authentication required. Please log in again.")
        return
      }

      const response = await putData("/api/users/company", token, companyData)

      if (response.ok) {
        const result = await response.json()
        console.log("✅ Company save success:", result)
        setCompanyMessage("Company information updated successfully!")
        setTimeout(() => setCompanyMessage(""), 3000)
      } else {
        const errorText = await response.text()
        console.error("❌ Company save error:", errorText)
        setCompanyMessage("Failed to update company info. Please try again.")
      }
    } catch (error) {
      console.error("❌ Company save network error:", error)
      setCompanyMessage(`Failed to save: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setCompanyLoading(false)
    }
  }

  // ✅ Security/Password save
  const handleSecuritySave = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      setSecurityMessage("New passwords do not match.")
      return
    }

    if (securityData.newPassword.length < 8) {
      setSecurityMessage("Password must be at least 8 characters long.")
      return
    }

    setSecurityLoading(true)
    setSecurityMessage("")

    try {
      const token = getAuthToken()
      if (!token) {
        setSecurityMessage("Authentication required. Please log in again.")
        return
      }

      const response = await putData("/api/users/password", token, {
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
      })

      if (response.ok) {
        const result = await response.json()
        console.log("✅ Password update success:", result)
        setSecurityMessage("Password updated successfully!")

        // Clear form
        setSecurityData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })

        setTimeout(() => setSecurityMessage(""), 3000)
      } else {
        const errorText = await response.text()
        console.error("❌ Password update error:", errorText)
        setSecurityMessage("Failed to update password. Please try again.")
      }
    } catch (error) {
      console.error("❌ Password update network error:", error)
      setSecurityMessage(`Failed to update password: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setSecurityLoading(false)
    }
  }


  if (!user) {
    return null // Show nothing while redirecting
  }

  const monthlyData = [
    { month: "Jan", leads: 3200, revenue: 180000, conversion: 24.5 },
    { month: "Feb", leads: 3800, revenue: 210000, conversion: 26.2 },
    { month: "Mar", leads: 4200, revenue: 245000, conversion: 28.1 },
    { month: "Apr", leads: 4600, revenue: 268000, conversion: 29.3 },
    { month: "May", leads: 4847, revenue: 285000, conversion: 31.2 },
  ]

  const marketData = [
    { name: "Email Platform", value: 35, color: "#3b82f6" },
    { name: "PBX System", value: 28, color: "#10b981" },
    { name: "CRM Integration", value: 22, color: "#f59e0b" },
    { name: "Database", value: 15, color: "#8b5cf6" },
  ]

  // Performance data
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
    <div className="min-h-screen bg-black text-white">
      {/* Header with Updated Logo */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Updated Logo with Animation and Bigger Size */}
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-xl p-1 bg-gradient-to-r from-blue-500 via animate-pulse hover:animate-spin hover:scale-110 transition-all duration-300 shadow-lg">
                <img
                  src="/logo.png"
                  alt="TriMarkity Logo"
                  className="w-full h-full object-contain rounded-lg hover:brightness-110 transition-all duration-300"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold animate-pulse">
                  <span className="text-white">Tri</span>
                  <span className="text-blue-400">Mark</span>
                  <span className="text-white">ity</span>
                </h1>
                <p className="text-sm text-gray-400 font-medium">Marketing Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search..."
                className="pl-10 w-64 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount >= 0 && (
                    <span className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center bg-blue-500">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-gray-900 border-gray-700">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="font-semibold text-white">Notifications</h3>
                  <p className="text-sm text-gray-400">{unreadCount} unread notifications</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-700 hover:bg-gray-800 ${notification.unread ? "bg-blue-500/10" : ""}`}
                    >
                      <div className="flex items-start space-x-3">
                        {notification.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{notification.title}</p>
                          <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-700">
                  <Button variant="ghost" size="sm" className="w-full text-blue-400 hover:text-blue-300">
                    View all notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/professional-headshot.png" alt="Profile" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-gray-400">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem onClick={() => setSettingsOpen(true)} className="text-white hover:bg-gray-700">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem onClick={logout} className="text-white hover:bg-gray-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="systems" className="data-[state=active]:bg-gray-700">
              Systems
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-gray-700">
              Performance
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-gray-700">
              Insights
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Integrated Systems - UPDATED WITH NEW URLS */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { name: "PBX System", icon: Phone, status: "Integrated", link: "http://192.168.1.3:3000" },
                { name: "Email Platform", icon: Mail, status: "Integrated", link: "https://frontend-ecz2shcsl-aditya-kukade-s-projects.vercel.app" },
                { name: "CRM Integration", icon: UserCheck, status: "Integrated", link: "http://192.168.1.3:4028/" },
                { name: "Database", icon: Database, status: "Integrated", link: "http://192.168.1.3:8001/" },
                { name: "Quality Assurance", icon: Shield, status: "Integrated", link: "https://trimarkity.app/" },
              ].map((system, index) => (
                <Card
                  key={index}
                  className="bg-gray-900/50 backdrop-blur-sm border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => window.open(system.link, "_blank")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <system.icon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white text-sm flex items-center justify-between">
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

            {/* Lead Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm border-blue-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm font-medium">Total Leads</p>
                      <p className="text-2xl font-bold text-white">4,847</p>
                      <p className="text-green-400 text-sm flex items-center mt-1">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        +15.2% from last month
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-sm border-green-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-200 text-sm font-medium">Qualified Leads</p>
                      <p className="text-2xl font-bold text-white">1,923</p>
                      <p className="text-green-400 text-sm flex items-center mt-1">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        39.7% conversion rate
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-sm border-orange-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-200 text-sm font-medium">Hot Prospects</p>
                      <p className="text-2xl font-bold text-white">567</p>
                      <p className="text-orange-400 text-sm flex items-center mt-1">
                        <Zap className="h-4 w-4 mr-1" />
                        Ready to close
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-sm border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200 text-sm font-medium">Lead Score Average</p>
                      <p className="text-2xl font-bold text-white">87.2</p>
                      <p className="text-purple-400 text-sm flex items-center mt-1">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        High quality leads
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Monthly Growth Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-gray-400" />
                      <YAxis axisLine={false} tickLine={false} className="text-gray-400" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Area type="monotone" dataKey="leads" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLeads)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Market Distribution</CardTitle>
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
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Systems Tab - NOW IMPLEMENTED */}
          <TabsContent value="systems" className="space-y-6">
            {/* System Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-sm border-green-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-200 text-sm font-medium">Systems Online</p>
                      <p className="text-2xl font-bold text-white">5/5</p>
                      <p className="text-green-400 text-sm">All systems operational</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 backdrop-blur-sm border-yellow-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-200 text-sm font-medium">Active Alerts</p>
                      <p className="text-2xl font-bold text-white">6</p>
                      <p className="text-yellow-400 text-sm">Requires attention</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm border-blue-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm font-medium">Average Uptime</p>
                      <p className="text-2xl font-bold text-white">99.4%</p>
                      <p className="text-blue-400 text-sm">Last 30 days</p>
                    </div>
                    <Server className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Individual System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {systemStatusData.map((system, index) => (
                <Card key={index} className="bg-gray-900/50 backdrop-blur-sm border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      {system.name}
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm text-green-400">Online</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Uptime</span>
                        <span className="text-white">{system.uptime}%</span>
                      </div>
                      <Progress value={system.uptime} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">System Load</span>
                        <span className="text-white">{system.load}%</span>
                      </div>
                      <Progress
                        value={system.load}
                        className="h-2"
                        style={{
                          backgroundColor: system.load > 80 ? '#dc2626' : system.load > 60 ? '#f59e0b' : '#10b981'
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Active Alerts</span>
                      <div className="flex items-center space-x-1">
                        {system.alerts > 0 && <AlertCircle className="h-4 w-4 text-yellow-400" />}
                        <span className={`text-sm ${system.alerts > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {system.alerts}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* System Health Chart */}
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">System Health Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={systemStatusData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-gray-400" />
                    <YAxis axisLine={false} tickLine={false} className="text-gray-400" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Line type="monotone" dataKey="uptime" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="load" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab - NOW IMPLEMENTED */}
          <TabsContent value="performance" className="space-y-6">
            {/* Performance KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm border-blue-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm font-medium">Conversion Rate</p>
                      <p className="text-2xl font-bold text-white">31.2%</p>
                      <p className="text-green-400 text-sm flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +3.1% vs last month
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-sm border-green-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-200 text-sm font-medium">Revenue Growth</p>
                      <p className="text-2xl font-bold text-white">$75K</p>
                      <p className="text-green-400 text-sm flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +18.5% growth
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-sm border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200 text-sm font-medium">Efficiency Score</p>
                      <p className="text-2xl font-bold text-white">89%</p>
                      <p className="text-purple-400 text-sm flex items-center mt-1">
                        <Award className="h-4 w-4 mr-1" />
                        Excellent performance
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-sm border-orange-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-200 text-sm font-medium">Response Time</p>
                      <p className="text-2xl font-bold text-white">2.3s</p>
                      <p className="text-green-400 text-sm flex items-center mt-1">
                        <TrendingDown className="h-4 w-4 mr-1" />
                        -0.7s improvement
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-gray-400" />
                      <YAxis axisLine={false} tickLine={false} className="text-gray-400" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Line type="monotone" dataKey="conversion" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Revenue Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-gray-400" />
                      <YAxis axisLine={false} tickLine={false} className="text-gray-400" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Bar dataKey="revenue" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics Table */}
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Detailed Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-gray-400">Month</th>
                        <th className="px-6 py-3 text-gray-400">Conversion Rate</th>
                        <th className="px-6 py-3 text-gray-400">Revenue</th>
                        <th className="px-6 py-3 text-gray-400">Efficiency Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceData.map((data, index) => (
                        <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                          <td className="px-6 py-4 text-white">{data.name}</td>
                          <td className="px-6 py-4 text-blue-400">{data.conversion}%</td>
                          <td className="px-6 py-4 text-green-400">${data.revenue.toLocaleString()}</td>
                          <td className="px-6 py-4 text-purple-400">{data.efficiency}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab - NOW IMPLEMENTED */}
          <TabsContent value="insights" className="space-y-6">
            {/* AI Insights Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm border-blue-500/20">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Brain className="h-6 w-6 text-blue-400 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">Lead Quality Insight</h3>
                      <p className="text-gray-300 text-sm">
                        Email platform leads show 23% higher conversion rates than PBX leads.
                        Consider increasing email campaign budget allocation.
                      </p>
                      <div className="mt-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                          High Impact
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-sm border-green-500/20">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="h-6 w-6 text-green-400 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">Optimization Opportunity</h3>
                      <p className="text-gray-300 text-sm">
                        Peak engagement hours are 10AM-12PM and 2PM-4PM.
                        Schedule campaigns during these windows for better results.
                      </p>
                      <div className="mt-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                          Actionable
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-sm border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Star className="h-6 w-6 text-purple-400 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">Quality Assurance</h3>
                      <p className="text-gray-300 text-sm">
                        Customer satisfaction scores are 94.2% this week.
                        Top performing agents should mentor new team members.
                      </p>
                      <div className="mt-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
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
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Predictive Lead Scoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { segment: "Enterprise Prospects", score: 94, trend: "up" },
                      { segment: "SMB Technology", score: 87, trend: "up" },
                      { segment: "Healthcare Sector", score: 76, trend: "stable" },
                      { segment: "Retail Chains", score: 63, trend: "down" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{item.segment}</p>
                          <p className="text-gray-400 text-sm">Lead Quality Score</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-bold">{item.score}</span>
                          <div className={`p-1 rounded-full ${item.trend === 'up' ? 'bg-green-500/20' :
                            item.trend === 'down' ? 'bg-red-500/20' : 'bg-gray-500/20'
                            }`}>
                            {item.trend === 'up' ? (
                              <TrendingUp className="h-4 w-4 text-green-400" />
                            ) : item.trend === 'down' ? (
                              <TrendingDown className="h-4 w-4 text-red-400" />
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

              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Campaign Recommendations</CardTitle>
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
                      <div key={index} className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{rec.title}</h4>
                            <p className="text-gray-400 text-sm mt-1">{rec.description}</p>
                            <p className="text-blue-400 text-sm font-medium mt-2">{rec.impact}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${rec.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                            rec.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
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
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Market Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="text-white font-semibold mb-1">Rising Demand</h3>
                    <p className="text-gray-400 text-sm">Technology sector leads increasing by 34% this quarter</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="text-white font-semibold mb-1">Communication Shift</h3>
                    <p className="text-gray-400 text-sm">Email engagement up 28%, phone calls down 12%</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="h-8 w-8 text-purple-400" />
                    </div>
                    <h3 className="text-white font-semibold mb-1">Seasonal Pattern</h3>
                    <p className="text-gray-400 text-sm">Q2 historically shows 18% conversion boost</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* UPDATED Profile Settings Dialog with Working Functionality */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Profile Settings</DialogTitle>
            <DialogDescription className="text-gray-400">
              Manage your account settings and preferences
            </DialogDescription>
          </DialogHeader>

          {/* WORKING Profile Settings Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="profile" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="company" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Building className="h-4 w-4 mr-2" />
                Company
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab - WORKING FUNCTIONALITY */}
            <TabsContent value="profile" className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-white">Mobile Number</Label>
                <Input
                  id="mobile"
                  value={profileData.mobile}
                  onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Enter your mobile number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white min-h-[80px]"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {profileMessage && (
                <div className={`p-3 rounded-lg ${profileMessage.includes('successfully')
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
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

            {/* Company Tab - WORKING FUNCTIONALITY */}
            <TabsContent value="company" className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-white">Company Name</Label>
                <Input
                  id="companyName"
                  value={companyData.companyName}
                  onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Enter your company name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-white">Position</Label>
                  <Input
                    id="position"
                    value={companyData.position}
                    onChange={(e) => setCompanyData({ ...companyData, position: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Your job title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-white">Department</Label>
                  <Input
                    id="department"
                    value={companyData.department}
                    onChange={(e) => setCompanyData({ ...companyData, department: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Your department"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-white">Company Website</Label>
                <Input
                  id="website"
                  value={companyData.website}
                  onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="https://example.com"
                />
              </div>

              {companyMessage && (
                <div className={`p-3 rounded-lg ${companyMessage.includes('successfully')
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
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

            {/* Security Tab - WORKING FUNCTIONALITY */}
            <TabsContent value="security" className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white pr-10"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-white">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white pr-10"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white pr-10"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {securityMessage && (
                <div className={`p-3 rounded-lg ${securityMessage.includes('successfully')
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
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
    </div>
  )
}
