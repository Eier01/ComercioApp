import connectToDB from "@/app/database/database"
import AuthUser from "@/app/middleware/AuthUser"
import Order from "@/app/models/order"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(req){
    try{
        await connectToDB()
        const isAuthUser = await AuthUser(req)

        if(isAuthUser?.role === 'admin'){
            const getAllOrders = await Order.find({}).populate('orderItems.product').populate('user')

            if(getAllOrders){
                return NextResponse.json({
                    success:true,
                    data: getAllOrders
                })
            }else{
                return NextResponse.json({
                    success:false,
                    message: 'Fallo al obtener los pedidos! Intentalo mas tarde.',
                    status: 204,
                })
            }

        }else{
            return NextResponse.json({
                success: false,
                message: 'No estas autorizado'
            })
        }

    }catch(error){
        console.log(`Error al obtener las ordenes ${error.message}`)

        return NextResponse.json({
            success: false,
            message: 'Algo salio mal, Porfavo intentelo mas tarde '
        })
    }
}
