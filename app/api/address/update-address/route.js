import connectToDB from "@/app/database/database";
import AuthUser from "@/app/middleware/AuthUser";
import Address from "@/app/models/address";
import { NextResponse } from "next/server";


export const dynamic = "force-dynamic";

export async function PUT(req){
    try{
        await connectToDB();
        const isAuthUser = await AuthUser(req);

        if(isAuthUser){
            const data = await req.json()
            const {
                _id,
                fullName,
                address,
                city,
                country,
                postalCode,
            } = data

            const updateAddress = await Address.findOneAndUpdate({
                _id:_id
            },{fullName,address,city,country,postalCode},
            {new:true})

            if (updateAddress) {
                return NextResponse.json({
                    success: true,
                    message: "Direccion editada exitosamente",
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Error al editar Direccion",
                });
            }

        }else {
            return NextResponse.json({
                success: false,
                message: 'No estas autorizado'
            })
        }
    }catch (error) {
        console.log(`Error al editar la Direccion ${error.message}`);

        return NextResponse.json({
            success: false,
            message: "Algo salio mal, Porfavo intentelo de nuevo ",
        });
    }
}