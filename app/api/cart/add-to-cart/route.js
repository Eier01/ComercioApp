import connectToDB from "@/app/database/database"
import AuthUser from "@/app/middleware/AuthUser"
import Cart from "@/app/models/cart"
import Joi from "joi"
import { NextResponse } from "next/server"


export const dynamic = 'force-dynamic'

const AddToCart = Joi.object({
    userID: Joi.string().required(),
    productID: Joi.string().required(),
})

export async function POST(req){
    try{
        await connectToDB()
        const isAuthUser = await AuthUser(req)

        if(isAuthUser){
            const data = await req.json()
            const {
                userID,                
                productID,
            } = data

            const {error} = AddToCart.validate({userID,productID})

            if(error){
                return NextResponse.json({
                    success: false,
                    message: 'Tipos de datos incorrectos'
                })
            } 

            const isCurrentCartItemAlreadyExists = await Cart.find({
                userID:userID,
                productID:productID,
            })

            if(isCurrentCartItemAlreadyExists?.length > 0){
                return NextResponse.json({
                    success: false,
                    message: 'Este producto ya esta agregado en el carrito! Agrega un producto diferente'
                })
            }

            const savedProductToCart = await Cart.create(data)

            if(savedProductToCart){
                return NextResponse.json({
                    success:true,
                    message: 'Producto agregado al carrito'
                })
            }else{
                return NextResponse.json({
                    success:false,
                    message: 'Fallo al agregar el producto al carrito! intentelo de nuevo'
                })
            }

        }else{
            return NextResponse.json({
                success: false,
                message: 'No estas autorizado'
            })
        }

    }catch(error){
        console.log(`Error al agregar al carrito ${error.message}`)

        return NextResponse.json({
            success: false,
            message: 'Algo salio mal, Porfavo intentelo mas tarde '
        })
    }
}