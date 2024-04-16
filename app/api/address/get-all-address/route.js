import connectToDB from "@/app/database/database"
import AuthUser from "@/app/middleware/AuthUser"
import Address from "@/app/models/address"
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
                    message: 'Porfavor incia sesion'
                })
            }

            const getAllAddresses = await Address.find({userID: id})

            if(getAllAddresses){
                return NextResponse.json({
                    success:true,
                    data: getAllAddresses
                })
            }else{
                return NextResponse.json({
                    success:false,
                    message: 'No se encontro ni una direccion',
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
        console.log(`Error al obtener direcion ${error.message}`)

        return NextResponse.json({
            success: false,
            message: 'Algo salio mal, Porfavo intentelo mas tarde '
        })
    }
}