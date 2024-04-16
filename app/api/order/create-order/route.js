import connectToDB from "@/app/database/database"
import AuthUser from "@/app/middleware/AuthUser"
import Cart from "@/app/models/cart"
import Order from "@/app/models/order"
import { NextResponse } from "next/server"


export const dynamic = 'force-dynamic'

export async function POST(req){
    try{
        await connectToDB()
        const isAuthUser = await AuthUser(req)

        if(isAuthUser){
            const data = await req.json()
            const {user} = data;

            const saveNewOrder = await Order.create(data)

            if(saveNewOrder){
                await Cart.deleteMany({userID: user})

                return NextResponse.json({
                    success:true,
                    message: 'Los productos estan en camino!'
                })
            }else{
                return NextResponse.json({
                    success:false,
                    message: 'Fallo al crear la orden! intentelo de nuevo'
                })
                
            }
        }else{
            return NextResponse.json({
                success: false,
                message: 'No estas autorizado'
            })
        }

    }catch(error){
        console.log(`Error al crear la orden ${error.message}`)

        return NextResponse.json({
            success: false,
            message: 'Algo salio mal, Porfavo intentelo mas tarde '
        })
    }
} 