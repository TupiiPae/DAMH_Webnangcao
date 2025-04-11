import foodModel from "../models/foodModel.js";
import fs from 'fs';
import path from 'path'; // Thêm path để xử lý đường dẫn file an toàn

// All food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        if (!foods || foods.length === 0) {
            return res.json({ success: false, message: "Không có thú cưng nào trong danh sách" });
        }
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error("Error fetching food list:", error.message);
        res.json({ success: false, message: error.message || "Lỗi khi lấy danh sách thú cưng" });
    }
};

// Get food by ID
const getFoodById = async (req, res) => {
    try {
        const { id } = req.params;
        // Kiểm tra ID hợp lệ
        if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.json({ success: false, message: "ID sản phẩm không hợp lệ" });
        }

        console.log("Fetching food with ID:", id); // Log để debug
        const food = await foodModel.findById(id);
        if (!food) {
            return res.json({ success: false, message: "Không tìm thấy sản phẩm" });
        }
        res.json({ success: true, data: food });
    } catch (error) {
        console.error("Error fetching food by ID:", error.message);
        res.json({ success: false, message: error.message || "Lỗi khi lấy thông tin sản phẩm" });
    }
};

// Add food
const addFood = async (req, res) => {
    try {
        // Kiểm tra xem có file hình ảnh không
        if (!req.file) {
            return res.json({ success: false, message: "Vui lòng tải lên hình ảnh" });
        }

        const image_filename = req.file.filename;

        // Kiểm tra dữ liệu đầu vào
        const { name, description, price, category, age, gender, quantity } = req.body;
        if (!name || !description || !price || !category || !age || !gender || !quantity) {
            return res.json({ success: false, message: "Vui lòng điền đầy đủ thông tin" });
        }

        const food = new foodModel({
            name,
            description,
            price: Number(price), // Đảm bảo price là số
            category,
            age: Number(age), // Đảm bảo age là số
            gender,
            quantity: Number(quantity), // Đảm bảo quantity là số
            image: image_filename,
        });

        await food.save();
        res.json({ success: true, message: "Thêm thú cưng thành công" });
    } catch (error) {
        console.error("Error adding food:", error.message);
        res.json({ success: false, message: error.message || "Lỗi khi thêm thú cưng" });
    }
};

// Update food
const updateFood = async (req, res) => {
    try {
        const { id } = req.body;
        // Kiểm tra ID hợp lệ
        if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.json({ success: false, message: "ID sản phẩm không hợp lệ" });
        }

        const food = await foodModel.findById(id);
        if (!food) {
            return res.json({ success: false, message: "Không tìm thấy sản phẩm" });
        }

        // Nếu có hình ảnh mới, xóa hình ảnh cũ và cập nhật
        if (req.file) {
            const oldImagePath = path.join('uploads', food.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error("Error deleting old image:", err.message);
                });
            }
            food.image = req.file.filename;
        }

        // Cập nhật các trường khác
        const { name, description, price, category, age, gender, quantity } = req.body;
        if (!name || !description || !price || !category || !age || !gender || !quantity) {
            return res.json({ success: false, message: "Vui lòng điền đầy đủ thông tin" });
        }

        food.name = name;
        food.description = description;
        food.price = Number(price);
        food.category = category;
        food.age = Number(age);
        food.gender = gender;
        food.quantity = Number(quantity);

        await food.save();
        res.json({ success: true, message: "Cập nhật thú cưng thành công" });
    } catch (error) {
        console.error("Error updating food:", error.message);
        res.json({ success: false, message: error.message || "Lỗi khi cập nhật thú cưng" });
    }
};

// Delete food
const removeFood = async (req, res) => {
    try {
        const { id } = req.body;
        // Kiểm tra ID hợp lệ
        if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.json({ success: false, message: "ID sản phẩm không hợp lệ" });
        }

        const food = await foodModel.findById(id);
        if (!food) {
            return res.json({ success: false, message: "Không tìm thấy sản phẩm" });
        }

        // Xóa hình ảnh
        const imagePath = path.join('uploads', food.image);
        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Error deleting image:", err.message);
            });
        }

        await foodModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Xóa thú cưng thành công" });
    } catch (error) {
        console.error("Error removing food:", error.message);
        res.json({ success: false, message: error.message || "Lỗi khi xóa thú cưng" });
    }
};

export { listFood, getFoodById, addFood, updateFood, removeFood };