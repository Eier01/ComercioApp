import connectToDB from "@/app/database/database"
import AuthUser from "@/app/middleware/AuthUser"
import { NextResponse } from "next/server"
import Order from "../../../../models/order"



export const dynamic = 'force-dynamic'

export async function PUT(req){
    try{
        await connectToDB()
        const isAuthUser = await AuthUser(req)
        const data = await req.json()

        if(isAuthUser?.role === 'admin'){
            const{
                _id,
                shippingAddress,
                orderItems,
                isPaid,
                paidAt,
                isProcessing,
            } = data

            const updateOrder = await Order.findOneAndUpdate({_id: _id},{
                shippingAddress,
                orderItems,
                isPaid,
                paidAt,
                isProcessing,
            },{new:true})

            if(updateOrder){
                return NextResponse.json({
                    success:true,
                    message: 'Estado del pedido editado exitosamente',                    
                })
            }else{
                return NextResponse.json({
                    success:false,
                    message: 'Fallo al editar el pedido! Intentalo mas tarde.',
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
        console.log(`Error al editar la orden ${error.message}`)

        return NextResponse.json({
            success: false,
            message: 'Algo salio mal, Porfavo intentelo mas tarde '
        })
    }
}