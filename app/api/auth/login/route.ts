import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    console.log('🔄 Login attempt for:', email)

    const client = await clientPromise
    const db = client.db("trimarkity")

    const user = await db.collection('users').findOne({ email })
    console.log('🔍 User found:', !!user)

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, user.hashed_password)
    console.log('🔍 Password valid:', isValidPassword)

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // ✅ ENHANCED JWT TOKEN with admin relationship for multi-tenant filtering
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.full_name,
        role: user.role || 'user',
        admin_id: user.created_by || (user.role === 'admin' ? user._id : null), // ✅ NEW: For campaign filtering
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
      },
      process.env.JWT_SECRET!
    )

    // ✅ DEBUG: Log the enhanced JWT payload (remove in production)
    console.log('✅ Enhanced JWT created with:', {
      userId: user._id,
      name: user.full_name,
      role: user.role || 'user',
      admin_id: user.created_by || (user.role === 'admin' ? user._id : null)
    });

    console.log('✅ JWT token generated with name:', user.full_name, 'role:', user.role || 'user')

    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { last_login: new Date() } }
    )

    return NextResponse.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role || 'user',
        is_active: user.is_active,
        is_verified: user.is_verified,
        mustChangePassword: user.mustChangePassword || false
      }
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed'
    console.error('❌ Login API error:', errorMessage)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
