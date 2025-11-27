import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import jwt from 'jsonwebtoken'

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    console.log('🔍 Auth header received:', !!authHeader)
    
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('🔍 Token extracted length:', token?.length)
    
    if (!token || token === 'null' || token === 'undefined') {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const tokenParts = token.split('.')
    if (tokenParts.length !== 3) {
      console.log('❌ Invalid token format, parts:', tokenParts.length)
      return NextResponse.json({ error: 'Malformed token' }, { status: 401 })
    }

    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!)
      console.log('✅ Token verified for user:', decoded.email)
    } catch (jwtError: unknown) {
      const errorMessage = jwtError instanceof Error ? jwtError.message : 'JWT verification failed'
      console.log('❌ JWT verification failed:', errorMessage)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const client = await clientPromise
    const db = client.db("trimarkity")

    const result = await db.collection('users').updateOne(
      { email: decoded.email },
      {
        $set: {
          first_name: body.firstName,
          last_name: body.lastName,
          full_name: `${body.firstName} ${body.lastName}`,
          email: body.email,
          mobile: body.mobile,
          bio: body.bio,
          updated_at: new Date()
        }
      }
    )

    console.log('✅ Database updated, matched:', result.matchedCount)

    return NextResponse.json({
      message: "Profile updated successfully",
      user: body
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Profile update failed'
    console.error('Profile update error:', errorMessage)
    return NextResponse.json({ error: "Profile update failed" }, { status: 500 })
  }
}
