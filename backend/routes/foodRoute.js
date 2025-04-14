import express from 'express';
import { addFood, listFood, removeFood, getFoodById, updateFood, updateQuantity } from '../controllers/foodController.js';
import multer from 'multer';

const foodRouter = express.Router();

// Image Storage Engine (Saving Image to uploads folder & rename it)
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// API Routes
foodRouter.get("/list", listFood); // Lấy danh sách tất cả sản phẩm
foodRouter.get("/:id", getFoodById); // Lấy thông tin sản phẩm theo ID
foodRouter.post("/add", upload.single('image'), addFood); // Thêm sản phẩm mới
foodRouter.post("/update", upload.single('image'), updateFood); // Cập nhật sản phẩm
foodRouter.post("/remove", removeFood); // Xóa sản phẩm
foodRouter.post("/update-quantity", updateQuantity);

export default foodRouter;