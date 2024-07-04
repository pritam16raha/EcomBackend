import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productModelSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: Array, required: true }
}, {timestamps: true})

export default mongoose.model('Product', productModelSchema, 'Products');