import connectToDB from "@/app/database/database"
import Product from "@/app/models/product"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(req){
    try{

        await connectToDB()
        const {searchParams} = new URL(req.url)
        const productId = searchParams.get('id')

        if(!productId){
            return NextResponse.json({
                success: false,
                status: 400,
                message: 'Id del producto requerido'
            })
        }
        const getData = await Product.find({_id: productId})

        if(getData){
            return NextResponse.json({
                success: true,
                data: getData[0],
            })
        }else{
            return NextResponse.json({
                success: false,
                message: 'Algo salio mal'
            })
        }

    }catch(error){
        console.log(`Error al obtener los productos ${error.message}`)

        return NextResponse.json({
            success: false,
            message: 'Algo salio mal, Porfavo intentelo mas tarde '
        })
    }
}
