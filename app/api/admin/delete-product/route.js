import connectToDB from "@/app/database/database";
import AuthUser from "@/app/middleware/AuthUser";
import Product from "@/app/models/product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req) {
    try {
        await connectToDB();

        const isAuthUser = await AuthUser(req);

        if (isAuthUser?.role === "admin") {
            const { searchParams } = new URL(req.url);
            const id = searchParams.get("id");

            if (!id) {
                return NextResponse.json({
                    success: false,
                    message: "El id del producto es requerido",
                });
            }

            const deletesProduct = await Product.findByIdAndDelete(id);

            if (deletesProduct) {
                return NextResponse.json({
                    success: true,
                    message: "Producto eliminado exitosamente",
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Fallo al eliminar el producto",
                });
            }
        } else {
            return NextResponse.json({
                success: false,
                message: "No estas autorizado",
            });
        }
    } catch (error) {
        console.log(`Error al eliminar el producto ${error.message}`);

        return NextResponse.json({
            success: false,
            message: "Algo salio mal, Porfavo intentelo de nuevo ",
        });
    }
}
