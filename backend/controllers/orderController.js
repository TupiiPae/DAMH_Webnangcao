import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js"; // Thêm import
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Config variables
const currency = "usd";
const deliveryCharge = 3;
const frontend_URL = 'http://localhost:5173';

// Placing User Order for Frontend using Stripe
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        // Kiểm tra số lượng trước khi đặt
        for (const item of items) {
            const food = await foodModel.findById(item._id);
            if (!food) {
                return res.json({ success: false, message: `Không tìm thấy sản phẩm ${item._id}` });
            }
            if (food.quantity < item.quantity) {
                return res.json({ success: false, message: `Số lượng không đủ cho ${food.name}` });
            }
        }

        // Tạo đơn hàng
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            payment: false // Chờ xác nhận thanh toán từ Stripe
        });
        await newOrder.save();

        // Cập nhật số lượng
        for (const item of items) {
            await foodModel.findByIdAndUpdate(item._id, {
                $inc: { quantity: -item.quantity }
            });
        }

        // Tạo line items cho Stripe
        const line_items = items.map((item) => ({
            price_data: {
                currency,
                product_data: { name: item.name },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));
        line_items.push({
            price_data: {
                currency,
                product_data: { name: "Delivery Charge" },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        });

        // Tạo session Stripe
        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment'
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("Error placing order:", error.message);
        res.json({ success: false, message: error.message || "Lỗi khi đặt hàng" });
    }
};

// Placing User Order for Frontend using COD
const placeOrderCod = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        // Kiểm tra số lượng trước khi đặt
        for (const item of items) {
            const food = await foodModel.findById(item._id);
            if (!food) {
                return res.json({ success: false, message: `Không tìm thấy sản phẩm ${item._id}` });
            }
            if (food.quantity < item.quantity) {
                return res.json({ success: false, message: `Số lượng không đủ cho ${food.name}` });
            }
        }

        // Tạo đơn hàng
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            payment: true // COD không cần chờ xác nhận
        });
        await newOrder.save();

        // Cập nhật số lượng
        for (const item of items) {
            await foodModel.findByIdAndUpdate(item._id, {
                $inc: { quantity: -item.quantity }
            });
        }

        // Xóa giỏ hàng
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Đặt hàng thành công" });
    } catch (error) {
        console.error("Error placing COD order:", error.message);
        res.json({ success: false, message: error.message || "Lỗi khi đặt hàng" });
    }
};

// Verify Order Payment
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Đã thanh toán" });
        } else {
            // Khôi phục số lượng nếu thanh toán thất bại
            const order = await orderModel.findById(orderId);
            if (order) {
                for (const item of order.items) {
                    await foodModel.findByIdAndUpdate(item._id, {
                        $inc: { quantity: item.quantity }
                    });
                }
            }
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Chưa thanh toán" });
        }
    } catch (error) {
        console.error("Error verifying order:", error.message);
        res.json({ success: false, message: "Không thể xác minh" });
    }
};

// Listing Orders for Admin Panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Error listing orders:", error.message);
        res.json({ success: false, message: "Lỗi khi lấy danh sách đơn hàng" });
    }
};

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching user orders:", error.message);
        res.json({ success: false, message: "Lỗi khi lấy đơn hàng" });
    }
};

// Update Order Status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Cập nhật trạng thái thành công" });
    } catch (error) {
        console.error("Error updating status:", error.message);
        res.json({ success: false, message: "Lỗi khi cập nhật trạng thái" });
    }
};

export { placeOrder, placeOrderCod, verifyOrder, listOrders, userOrders, updateStatus };