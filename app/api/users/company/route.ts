import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    return NextResponse.json({
      message: "Company information updated successfully",
      company: {
        ...body,
        updated_at: new Date().toISOString()
      }
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Company update failed"
    console.error('Company API error:', errorMessage)
    return NextResponse.json({ error: "Company update failed" }, { status: 500 })
  }
}
