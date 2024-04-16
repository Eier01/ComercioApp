import connectToDB from "@/app/database/database";
import User from "@/app/models/user";
import { compare } from "bcryptjs";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";


const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

export const dynamic = 'force-dynamic'

export async function POST(req){
    await connectToDB()

    const {
        email,
        password,
    } = await req.json()

    const {error} = schema.validate({email,password})

    if(error){
        console.log(error)
        return NextResponse.json({
            success: false,
            message: 'Tipo de informacion incorrecta'
        })
    }

    try{

        const checkUser = await User.findOne({email})
        if(!checkUser){
            return NextResponse.json({
                success: false,
                message: `No existe una cuenta con este email: ${email}`
            })
        }

        const checkPassword = await compare(password, checkUser.password)
        if(!checkPassword){
            return NextResponse.json({
                success: false,
                message: `Contraseña incorrecta`
            })
        }

        const token = jwt.sign({
            id: checkUser._id,
            email: checkUser?.email,
            role: checkUser?.role,
        }, 'default_secret_key', {expiresIn: '2h'})

        const finalData = {
            token,
            user: {
                id: checkUser._id,
                email: checkUser.email,
                name: checkUser.name,
                role: checkUser.role,
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Inicio de sesion exitoso',
            finalData
        })

    }catch(error){
        console.log(`Error al registrar un nuevo usuario ${error.message}`)
        
        return NextResponse.json({
            success: false,
            message: 'Algo salio mal, Porfavo intentelo mas tarde '
        })
    }
}