import connectToDB from "@/app/database/database";
import AuthUser from "@/app/middleware/AuthUser";
import Product from "@/app/models/product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(req) {
    try {
        await connectToDB();
        const isAuthUser = await AuthUser(req);

        if (isAuthUser?.role === "admin") {
            const extractData = await req.json();

            const {
                _id,
                name,
                price,
                description,
                category,
                sizes,
                deliveryInfo,
                onSale,
                priceDrop,
                imageUrl,
            } = extractData;

            const updatedProduct = await Product.findOneAndUpdate(
                {
                    _id: _id,
                },
                {
                    name,
                    price,
                    description,
                    category,
                    sizes,
                    deliveryInfo,
                    onSale,
                    priceDrop,
                    imageUrl,
                },
                { new: true }
            );

            if (updatedProduct) {
                return NextResponse.json({
                    success: true,
                    message: "Producto editado exitosamente",
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Error al editar producto",
                });
            }
        } else {
            return NextResponse.json({
                success: false,
                message: 'No estas autorizado'
            })
        }
    } catch (error) {
        console.log(`Error al editar el producto ${error.message}`);

        return NextResponse.json({
            success: false,
            message: "Algo salio mal, Porfavo intentelo de nuevo ",
        });
    }
}
