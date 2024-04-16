import connectToDB from "@/app/database/database"
import AuthUser from "@/app/middleware/AuthUser"
import { NextResponse } from "next/server"
import Cart from "../../../models/cart"


export const dynamic = 'force-dynamic'

export async function DELETE(req){
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

            const deleteCartItem = await Cart.findByIdAndDelete(id)

            if(deleteCartItem){
                return NextResponse.json({
                    success:true,
                    message: 'Articulo elimicado del carrito exitosamente',
                })
            }else{
                return NextResponse.json({
                    success:false,
                    message: 'Error al elimicar el articulo ',
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
        console.log(`Error al eliminar producto del carrito ${error.message}`)

        return NextResponse.json({
            success: false,
            message: 'Algo salio mal, Porfavo intentelo mas tarde '
        })
    }
}