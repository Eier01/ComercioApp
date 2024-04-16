import connectToDB from "@/app/database/database"
import AuthUser from "@/app/middleware/AuthUser"
import { NextResponse } from "next/server"
import Cart from "../../../models/cart"

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
                    message: 'Porfavor incia sesion'
                })
            }

            const extractAllCartItems = await Cart.find({userID: id}).populate('productID')

            if(extractAllCartItems){
                return NextResponse.json({
                    success:true,
                    data: extractAllCartItems
                })
            }else{
                return NextResponse.json({
                    success:false,
                    message: 'No hay articulos en el carrito',
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
        console.log(`Error al obtener productos ${error.message}`)

        return NextResponse.json({
            success: false,
            message: 'Algo salio mal, Porfavo intentelo mas tarde '
        })
    }
}
