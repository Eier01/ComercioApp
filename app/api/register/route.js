import connectToDB from "@/app/database/database";
import User from "@/app/models/user";
import { hash } from "bcryptjs";
import Joi from "joi";
import { NextResponse } from "next/server";


const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().required(),
})

export const dynamic = 'force-dynamic'

export async function POST(req){

    await connectToDB()

    const {
        name,
        email,
        password,
        role,
    } = await req.json()

    //validar esquema
    const {err} = schema.validate({name,email,password,role})

    if(err){
        return NextResponse.json({
            success: false,
            message: 'Tipo de informacion incorrecta'
        })
    }

    try{

        const isUser = await User.findOne({email})

        if(isUser){
            return NextResponse.json({
                success:false,
                message: 'El usuario ya existe. Intente con otro email'
            })
        }else{
            const hashPassword = await hash(password, 12)

            const newUser = await User.create({
                name, email, password:hashPassword, role
            })

            if(newUser){
                return NextResponse.json({
                    success:true,
                    message: 'Cuenta creada exitosamente'
                })
            }
        }

    }catch(error){
        console.log(`Error al registrar un nuevo usuario ${error.message}`)

        return NextResponse.json({
            success: false,
            message: 'Algo salio mal, Porfavo intentelo de nuevo '
        })
    }

}   