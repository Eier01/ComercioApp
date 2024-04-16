import connectToDB from "@/app/database/database"
import AuthUser from "@/app/middleware/AuthUser"
import Address from "@/app/models/address"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function DELETE(req){
    try{
        await connectToDB()
        const isAuthUser = await AuthUser(req)

        if(isAuthUser){
            const {searchParams} = new URL(req.url)
            const id = searchParams.get('id')

            const deletedAddress = await Address.findByIdAndDelete(id)

            if(deletedAddress){
                return NextResponse.json({
                    success:true,
                    message: 'Direccion elimicada exitosamente',
                })
            }else{
                return NextResponse.json({
                    success:false,
                    message: 'Error al elimicar la direccion',
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
        console.log(`Error al eliminar la direccion ${error.message}`)

        return NextResponse.json({
            success: false,
            message: 'Algo salio mal, Porfavo intentelo mas tarde '
        })
    }
}