import mongoose from 'mongoose'


const configOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

const connectToDB = async() =>{
    const connectionUrl = 'mongodb+srv://ediermenesefd:impercop022@cluster0.4qlttfv.mongodb.net/ecommerce'

    mongoose.connect(connectionUrl,configOption).then(() =>(
        console.log('Conexion con la base de datos exitosa')
    )).catch((err) => console.log(`Error en la conexio con la base de datos ${err.message}`))
}

export default connectToDB