import connectToDB from "@/app/database/database"
import AuthUser from "@/app/middleware/AuthUser"
import Address from "@/app/models/address"
import Joi from "joi"
import { NextResponse } from "next/server"


export const dynamic = 'force-dynamic'

const AddNewAddress = Joi.object({
    fullName: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    postalCode: Joi.string().required(),
    userID: Joi.string().required(),
})

export async function POST(req){
    try{
        await connectToDB()
        const isAuthUser = await AuthUser(req)

        if(isAuthUser){
            const data = await req.json()

            const {
                fullName,
                address,
                city,
                country,
                postalCode,
                userID,
            } = data

        const {error} = AddNewAddress.validate({
                fullName,
                address,
                city,
                country,
                postalCode,
                userID,
        })

        if(error){
            return NextResponse.json({
                success: false,
                message: 'Tipos de datos incorrectos'
            })
        }

        const newlyAddedAddress = await Address.create(data)

        if(newlyAddedAddress){
            return NextResponse.json({
                success:true,
                message: 'Direccion agregada exitosamente'
            })
        }else{
            return NextResponse.json({
                success:false,
                message: 'Fallo al agregar la direccion! intentelo de nuevo'
            })
        }

        }else{
            return NextResponse.json({
                success: false,
                message: 'No estas autorizado'
            })
        }
    }catch(error){
        console.log(`Error al agregar la direccion ${error.message}`)

        return NextResponse.json({
            success: false,
            message: 'Algo salio mal, Porfavo intentelo mas tarde '
        })
    }
}
