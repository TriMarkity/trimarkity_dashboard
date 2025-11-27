import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!)
    } catch (jwtError: unknown) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    
    if (!body.currentPassword || !body.newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (body.newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("trimarkity")
    
    // ✅ UPDATED: Use decoded.email consistently with login API
    const user = await db.collection('users').findOne({ email: decoded.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isCurrentPasswordValid = await bcrypt.compare(body.currentPassword, user.hashed_password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    const hashedNewPassword = await bcrypt.hash(body.newPassword, 12)

    // ✅ Clear the mustChangePassword flag and update password
    await db.collection('users').updateOne(
      { email: decoded.email },
      { 
        $set: { 
          hashed_password: hashedNewPassword,
          mustChangePassword: false, // ✅ Clears the one-time password change flag
          password_changed_at: new Date(),
          updated_at: new Date()
        } 
      }
    )

    console.log('✅ Password updated for user:', decoded.email)
    
    // ✅ UPDATED: Generate new token with same structure as login API
    const newToken = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
      },
      process.env.JWT_SECRET!
    )
    
    return NextResponse.json({
      message: "Password updated successfully",
      access_token: newToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        is_active: user.is_active,
        is_verified: user.is_verified,
        mustChangePassword: false // ✅ Return updated flag - prevents future prompts
      }
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Password update failed"
    console.error('Password API error:', errorMessage)
    return NextResponse.json({ error: "Password update failed" }, { status: 500 })
  }
}

// ✅ OPTIONAL: POST method for first-time password setup (without current password)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!)
    } catch (jwtError: unknown) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    
    if (!body.newPassword) {
      return NextResponse.json({ error: "New password is required" }, { status: 400 })
    }

    if (body.newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("trimarkity")
    
    const user = await db.collection('users').findOne({ email: decoded.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // ✅ Only allow if user must change password
    if (!user.mustChangePassword) {
      return NextResponse.json({ error: 'Password change not required' }, { status: 400 })
    }

    const hashedNewPassword = await bcrypt.hash(body.newPassword, 12)

    await db.collection('users').updateOne(
      { email: decoded.email },
      { 
        $set: { 
          hashed_password: hashedNewPassword,
          mustChangePassword: false,
          password_changed_at: new Date(),
          updated_at: new Date()
        } 
      }
    )

    console.log('✅ First-time password setup for user:', decoded.email)
    
    const newToken = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
      },
      process.env.JWT_SECRET!
    )
    
    return NextResponse.json({
      message: "Password setup completed successfully",
      access_token: newToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        is_active: user.is_active,
        is_verified: user.is_verified,
        mustChangePassword: false
      }
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Password setup failed"
    console.error('Password setup API error:', errorMessage)
    return NextResponse.json({ error: "Password setup failed" }, { status: 500 })
  }
}
