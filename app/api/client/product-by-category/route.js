import connectToDB from "@/app/database/database"
import Product from "@/app/models/product"
import { NextResponse } from "next/server"


export const dynamic = 'force-dynamic'


export async function GET(req){
    try{
        await connectToDB()
        const {searchParams} = new URL(req.url)
        const id = searchParams.get('id')
        
        const getData = await Product.find({category: id})
        if(getData){
            return NextResponse.json({
                success: true,
                data: getData,
            })
        }else{
            return NextResponse.json({
                success: false,
                status: 204,
                message: 'No se encontraron los productos'
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