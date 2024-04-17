import AuthUser from '@/app/middleware/AuthUser'
import { NextResponse } from 'next/server'


const stripe = require('stripe')('sk_test_51P3KdLE2opcTCxpBBfqsbTVDJhnLKJFihzIyurMlosEEuJ7FEXDByXFFp905uec8KcDTAGfO3XvnD2WSq7JmGRtn00cuKPq1rz') 
export const dynamic = 'force-dynamic'

export async function POST(req){
    try{
        const isAuthUser = await AuthUser(req)

        if(isAuthUser){
            const res = await req.json()

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: res,
                mode: 'payment',
                success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?status=success`,
                cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?status=cancel`,
            })

            return NextResponse.json({
                success: true,
                id: session.id,
            })

        }else{
            return NextResponse.json({
                success: false,
                message: 'No estas autorizado, inicia cesion primero',
            })
        }        
    }catch(error){
        console.log(`Error: ${error.message}`)

        return NextResponse.json({
            status:500,
            success: false,
            message: 'Algo salio mal, Porfavo intentelo de nuevo '
        })
    }
}