import { getPasswordStrength } from "@/lib/auth-validation"

interface PasswordStrengthIndicatorProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const { strength, label, color } = getPasswordStrength(password)

  if (!password) return null

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">Password Strength</span>
        <span
          className={`font-medium ${
            strength === 100
              ? "text-green-400"
              : strength >= 75
                ? "text-yellow-400"
                : strength >= 50
                  ? "text-orange-400"
                  : "text-red-400"
          }`}
        >
          {label}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all duration-300 ${color}`} style={{ width: `${strength}%` }} />
      </div>
    </div>
  )
}
