import connectToDB from "@/app/database/database"
import Joi from "joi"
import Product from "../../../models/product"
import { NextResponse } from "next/server"
import AuthUser from "@/app/middleware/AuthUser"

export const dynamic = 'force-dynamic'

const AddNewProductSchema = Joi.object({
    name:Joi.string().required(),
    description:Joi.string().required(),
    price:Joi.number().required(),
    category:Joi.string().required(),
    sizes:Joi.array().required(),
    deliveryInfo:Joi.string().required(),
    onSale:Joi.string().required(),  
    priceDrop:Joi.number().required(),
    imageUrl:Joi.string().required(),
})

export async function POST(req){
    try{
        await connectToDB()

        const user = 'admin'

        const isAuthUser = await AuthUser(req)

        if(isAuthUser?.role === 'admin'){
            const extractData = await req.json()

            const {
                name,
                description,
                price,
                imageUrl,
                category,
                sizes,
                deliveryInfo,
                onSale,
                priceDrop,
            } = extractData

            const {error} = AddNewProductSchema.validate({
                name,
                description,
                price,
                imageUrl,
                category,
                sizes,
                deliveryInfo,
                onSale,
                priceDrop,
            })

            if(error){
                return NextResponse.json({
                    success: false,
                    message: 'Tipos de datos incorrectos'
                })
            }

            const newProduct = await Product.create(extractData)

            if(newProduct){
                return NextResponse.json({
                    success:true,
                    message: 'Producto creado exitosamente'
                })
            }else{
                return NextResponse.json({
                    success:false,
                    message: 'Fallo al agregar el producto! intentelo de nuevo'
                })
            }

        }else{
            return NextResponse.json({
                success: false,
                message: 'No estas autorizado'
            })
        }

    }catch(error){
        console.log(`Error al registrar un nuevo producto ${error.message}`)

        return NextResponse.json({
            success: false,
            message: 'Algo salio mal, Porfavo intentelo mas tarde '
        })
    }
}