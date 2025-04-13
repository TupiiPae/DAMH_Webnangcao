import userModel from "../models/userModel.js";

// Add to user cart
const addToCart = async (req, res) => {
   try {
      const userData = await userModel.findById(req.body.userId);

      if (!userData) {
         return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
      }

      const cartData = userData.cartData || {};

      const itemId = req.body.itemId;
      cartData[itemId] = (cartData[itemId] || 0) + 1;

      await userModel.findByIdAndUpdate(req.body.userId, { cartData });
      res.json({ success: true, message: "Thêm vào giỏ hàng" });
   } catch (error) {
      console.error("Lỗi addToCart:", error);
      res.status(500).json({ success: false, message: "Lỗi server" });
   }
};

// Remove from cart
const removeFromCart = async (req, res) => {
   try {
      const userData = await userModel.findById(req.body.userId);

      if (!userData) {
         return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
      }

      const cartData = userData.cartData || {};

      const itemId = req.body.itemId;
      if (cartData[itemId] > 0) {
         cartData[itemId] -= 1;
      }

      await userModel.findByIdAndUpdate(req.body.userId, { cartData });
      res.json({ success: true, message: "Xóa khỏi giỏ hàng" });
   } catch (error) {
      console.error("Lỗi removeFromCart:", error);
      res.status(500).json({ success: false, message: "Lỗi server" });
   }
};

// Get user cart
const getCart = async (req, res) => {
   try {
      const userData = await userModel.findById(req.body.userId);

      if (!userData) {
         return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
      }

      const cartData = userData.cartData || {};
      res.json({ success: true, cartData });
   } catch (error) {
      console.error("Lỗi getCart:", error);
      res.status(500).json({ success: false, message: "Lỗi server" });
   }
};

export { addToCart, removeFromCart, getCart };
