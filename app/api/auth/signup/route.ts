import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.email || !body.password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("trimarkity")
    
    const existingUser = await db.collection('users').findOne({ email: body.email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(body.password, 12)

    const newUser = {
      email: body.email,
      hashed_password: hashedPassword,
      full_name: body.full_name || "New User",
      first_name: body.full_name?.split(' ')[0] || "User",
      last_name: body.full_name?.split(' ').slice(1).join(' ') || "",
      phone: body.phone,
      role: "admin",
      is_active: true,
      is_verified: false,
      created_at: new Date(),
      updated_at: new Date()
    }

    const result = await db.collection('users').insertOne(newUser)

    const token = jwt.sign(
      { 
        userId: result.insertedId,
        email: body.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
      },
      process.env.JWT_SECRET!
    )
    
    return NextResponse.json({
      access_token: token,
      token_type: "bearer", 
      expires_in: 604800,
      user: {
        id: result.insertedId,
        email: body.email,
        full_name: newUser.full_name,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        phone: newUser.phone,
        role: newUser.role,
        is_active: newUser.is_active,
        is_verified: newUser.is_verified
      }
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Signup failed'
    console.error('Signup API error:', errorMessage)
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
