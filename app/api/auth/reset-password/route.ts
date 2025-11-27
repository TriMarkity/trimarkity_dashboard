import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ 
        error: "Token and password are required" 
      }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ 
        error: "Password must be at least 8 characters" 
      }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("trimarkity")
    
    // Find user with valid reset token
    const user = await db.collection('users').findOne({
      reset_token: token,
      reset_token_expires: { $gt: new Date() }
    })

    if (!user) {
      return NextResponse.json({ 
        error: "Invalid or expired reset token" 
      }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update password and remove reset token
    const updateResult = await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          hashed_password: hashedPassword,
          updated_at: new Date()
        },
        $unset: {
          reset_token: 1,
          reset_token_expires: 1
        }
      }
    )

    if (updateResult.modifiedCount > 0) {
      return NextResponse.json({ 
        message: "Password reset successful" 
      })
    } else {
      return NextResponse.json({ 
        error: "Failed to update password" 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ 
      error: "Server error: " + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}
