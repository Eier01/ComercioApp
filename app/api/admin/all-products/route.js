import connectToDB from "@/app/database/database";
import Product from "@/app/models/product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
    try {
        await connectToDB();

        const extractAllProducts = await Product.find({})

        if(extractAllProducts){
            return NextResponse.json({
                success: true,
                data: extractAllProducts
            });
        }else{
            return NextResponse.json({
                success: false,
                status: 204,
                message: 'No se encontraron productos'
            });
        }

    } catch (error) {
        console.log(`Error al obtener productos ${error.message}`);

        return NextResponse.json({
            success: false,
            message: "Algo salio mal, Porfavo intentelo mas tarde ",
        });
    }
}
