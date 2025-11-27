"use client"

import React, { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function AuthLayout({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const [isSignUpMode, setIsSignUpMode] = useState(pathname.includes('signup'))
    const [isNavigating, setIsNavigating] = useState(false)

    useEffect(() => {
        setIsSignUpMode(pathname.includes('signup'))
        setIsNavigating(false)
    }, [pathname])

    const navigate = (toSignUp) => {
        if (isNavigating) return // Single check

        setIsNavigating(true)
        setIsSignUpMode(toSignUp)

        // Simple navigation after short delay
        setTimeout(() => {
            router.push(toSignUp ? '/signup' : '/login')
        }, 500)
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Dashboard-themed Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/20 to-purple-600/20 rounded-full transform translate-x-32 -translate-y-32 z-0 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/20 to-green-500/20 rounded-full transform -translate-x-24 translate-y-24 z-0 animate-pulse" />

            <div className="relative min-h-screen flex items-center justify-center">
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-3xl shadow-2xl overflow-hidden relative w-full max-w-4xl min-h-[600px]">

                    {/* Dashboard-themed sliding container */}
                    <div
                        className={`absolute inset-0 w-[200%] flex transition-transform duration-700 ease-in-out ${isSignUpMode ? '-translate-x-1/2' : 'translate-x-0'
                            }`}
                    >

                        {/* Panel 1: Hello Friend (LEFT) - Dashboard styled */}
                        <div className="w-1/2 bg-gradient-to-br from-white-500 to-blue-500 flex items-center justify-center relative overflow-hidden">
                            {/* Dashboard-style decorative elements */}
                            <div className="absolute top-8 right-8 w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm" />
                            <div className="absolute bottom-12 left-8 w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm" />
                            <div className="absolute top-1/3 right-12 w-20 h-20 bg-white/5 rounded-3xl backdrop-blur-sm" />

                            <div className="text-center text-white px-8 z-10">
                                {/* Dashboard-style logo and branding */}
                                <p className="text-xl opacity-90 leading-relaxed mb-8 max-w-md mx-auto">
                                    🚀 Create Your TriMarkity Account<br />
                                    Start generating leads, verifying data, and growing your business in minutes.
                                </p>
                                {/* Add your image below the first paragraph */}
                                <img
                                    src="/login.png"
                                    alt="TriMarkity Platform"
                                    className="mx-auto mb-6 rounded-xl max-w-xs max-h-48 object-contain hover:scale-105 transition-transform duration-300"
                                />

                                <p className="text-xxl opacity-90 leading-relaxed mb-5 max-w-md mx-auto">
                                    Your data is 100% secure with enterprise-grade encryption.</p>
                                <button
                                    onClick={() => navigate(true)}
                                    disabled={isNavigating}
                                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 disabled:opacity-50 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    SIGN UP
                                </button>
                            </div>
                        </div>

                        {/* Panel 2: Sign In Form (RIGHT) - Dashboard styled */}
                        <div className="w-1/2 flex items-center justify-center p-12 bg-gray-900/50 backdrop-blur-sm">
                            {!isSignUpMode && children}
                        </div>

                        {/* Panel 3: Sign Up Form (LEFT) - Dashboard styled */}
                        <div className="w-1/2 flex items-center justify-center p-12 bg-gray-900/50 backdrop-blur-sm">
                            {isSignUpMode && children}
                        </div>

                        {/* Panel 4: Welcome Back (RIGHT) - Dashboard styled */}
                        <div className="w-1/2 bg-gradient-to-br from-blue-500 to-white-500 flex items-center justify-center relative overflow-hidden">
                            {/* Dashboard-style decorative elements */}
                            <div className="absolute top-8 left-8 w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm" />
                            <div className="absolute bottom-12 right-8 w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm" />
                            <div className="absolute top-1/3 left-12 w-20 h-20 bg-white/5 rounded-3xl backdrop-blur-sm" />

                            <div className="text-center text-white px-8 z-10">
                                {/* Dashboard-style logo and branding */}
                                <h1 className="text-3xl font-bold mb-6 leading-tight">Welcome Back!</h1>

                                <p className="text-xxl opacity-90 leading-relaxed mb-8 max-w-md mx-auto">
                                    🚀 Turn data into deals. With TriMarkity, every login takes you one step closer to your next client.
                                </p>
                                {/* Add your image below the first paragraph */}
                                <img
                                    src="/signup.png"
                                    alt="TriMarkity Platform"
                                    className="mx-auto mb-6 rounded-xl max-w-xs max-h-48 object-contain hover:scale-105 transition-transform duration-300"
                                />

                                <p className="text-xxl opacity-90 leading-relaxed mb-5 max-w-md mx-auto">
                                    🔒 We never share your data. Your privacy is protected with enterprise-grade encryption.</p>
                                <button
                                    onClick={() => navigate(false)}
                                    disabled={isNavigating}
                                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 disabled:opacity-50 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    SIGN IN
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
