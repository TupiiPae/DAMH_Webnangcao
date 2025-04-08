import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    age: { type: Number, required: true }, // Tuổi (tính bằng tháng)
    gender: { type: String, required: true }, // Giới tính
    quantity: { type: Number, required: true } // Số lượng
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);
export default foodModel;