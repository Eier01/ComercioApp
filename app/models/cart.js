import mongoose from 'mongoose'
import Product from './product'
import User from './user'

const CartSchema = new mongoose.Schema({
    userID:{
        type: mongoose.Schema.ObjectId,
        ref:'User'
    },
    productID:{
        type: mongoose.Schema.ObjectId,
        ref:'Products'
    },
    quantity:{
        type: Number,
        required:true,
        default: 1,
    },
},{timestamps: true})

const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema)

export default Cart