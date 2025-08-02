import { NextRequest, NextResponse } from 'next/server'
import { verifyPayUPayment } from '@/lib/payu.config'

export async function POST(
  request: NextRequest,
  { params }: { params: { txnid: string } }
) {
  try {
    const { txnid } = params

    // Verify the payment with PayU
    const data = await verifyPayUPayment(txnid)

    // Redirect to frontend with payment status
    const status = data.status
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/${status}/${txnid}`

    return NextResponse.redirect(redirectUrl)
  } catch (error: any) {
    console.error('Payment verification error:', error)
    
    // Redirect to failure page
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/failure/${params.txnid}`
    return NextResponse.redirect(redirectUrl)
  }
}

export async function GET(
  request: Request,
  { params }: { params: { txnid: string } }
) {
  try {
    const { txnid } = params

    // Verify the payment with PayU
    const data = await verifyPayUPayment(txnid)

    // Return payment details
    return NextResponse.json({
      status: data.status,
      amount: data.amt,
      txnid: data.txnid,
      method: data.mode,
      error: data.error_Message,
      created_at: new Date(data.addedon).toLocaleString()
    })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { 
        error: 'Payment verification failed',
        message: error.message 
      },
      { status: 500 }
    )
  }
} 