import connectToDB from "@/app/database/database"
import AuthUser from "@/app/middleware/AuthUser"
import Order from "@/app/models/order"
import { NextResponse } from "next/server"


export const dynamic = 'force-dynamic'

export async function GET(req){
    try{

        await connectToDB()
        const isAuthUser = await AuthUser(req)

        if(isAuthUser){
            const {searchParams} = new URL(req.url)
            const id = searchParams.get('id')

            if(!id){
                return NextResponse.json({
                    success: false,
                    message: 'El id del pedido es requerido'
                })
            }

            const extractOrdenDetails = await Order.findById(id).populate('orderItems.product')

            if(extractOrdenDetails){
                return NextResponse.json({
                    success:true,
                    data: extractOrdenDetails
                })
            }else{
                return NextResponse.json({
                    success:false,
                    message: 'No hay pedidos',
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
        console.log(`Error al obtener pedidos ${error.message}`)

        return NextResponse.json({
            success: false,
            message: 'Algo salio mal, Porfavo intentelo mas tarde '
        })
    }
}
