import mongoose from 'mongoose'
import User from './user'

const NewAddressSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    fullName: String,
    address: String,
    city: String,
    country: String,
    postalCode: String,
})

const Address = mongoose.models.Address || mongoose.model('Address', NewAddressSchema)

export default Address