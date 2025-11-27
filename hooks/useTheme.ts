import { useState, useEffect, useCallback } from 'react'

export function useTheme() {
  // Set default to false (light mode)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check localStorage on mount
    const stored = localStorage.getItem('theme')
    if (stored === 'dark') {
      setIsDark(true)
    } else {
      // Default to light mode and save it
      setIsDark(false)
      localStorage.setItem('theme', 'light')
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const newTheme = !prev
      localStorage.setItem('theme', newTheme ? 'dark' : 'light')
      return newTheme
    })
  }, [])

  return { 
    isDark, 
    toggleTheme 
  }
}
