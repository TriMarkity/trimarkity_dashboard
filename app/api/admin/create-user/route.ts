import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, department } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Generate random password for new user
    const tempPassword = crypto.randomBytes(8).toString('hex')
    const hashedPassword = await bcrypt.hash(tempPassword, 12)

    const client = await clientPromise
    const db = client.db("trimarkity")
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // ✅ UPDATED: Create new user with mustChangePassword flag
    const newUser = {
      full_name: name,
      first_name: name.split(' ')[0],
      last_name: name.split(' ').slice(1).join(' ') || '',
      email,
      phone: phone || '',
      department: department || '',
      hashed_password: hashedPassword,
      role: 'user',
      is_active: true,
      is_verified: false,
      mustChangePassword: true, // ✅ NEW: Force password change on first login
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin'
    }

    const result = await db.collection('users').insertOne(newUser)

    console.log('✅ New user created with mustChangePassword=true:', email)

    return NextResponse.json({ 
      success: true,
      message: "User created successfully",
      credentials: {
        userId: result.insertedId,
        email,
        tempPassword
      },
      // ✅ NEW: Include password change requirement in response
      passwordChangeRequired: true
    })

  } catch (error) {
    console.error('User creation error:', error)
    return NextResponse.json({ 
      error: "Failed to create user" 
    }, { status: 500 })
  }
}
