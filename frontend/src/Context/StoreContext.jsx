import { createContext, useEffect, useState } from "react";
import { food_list as foodListStatic, menu_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "http://localhost:4000";
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const currency = "$";
  const deliveryCharge = 3;

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1 // Sửa dòng này
    }));

    if (token) {
      await axios.post(`${url}/api/cart/add`, { itemId }, {
        headers: { token } // Sửa dòng này
      });
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 1) - 1 // Sửa dòng này
    }));

    if (token) {
      await axios.post(`${url}/api/cart/remove`, { itemId }, {
        headers: { token } // Sửa dòng này
      });
    }
  };

  const deleteFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: 0
    }));

    if (token) {
      await axios.post(`${url}/api/cart/delete`, { itemId }, {
        headers: { token } // Sửa dòng này
      });
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      try {
        if (cartItems[item] > 0) {
          const itemInfo = food_list.find((product) => product._id === item); // Sửa dòng này
          if (itemInfo) { // Sửa dòng này
            totalAmount += itemInfo.price * cartItems[item];
          }
        }
      } catch (error) {
        console.error("Error calculating cart amount", error); // Sửa dòng này
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`); // Sửa dòng này
      setFoodList(response.data.data || []); // Sửa dòng này
    } catch (error) {
      console.error("Failed to fetch food list", error); // Sửa dòng này
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(`${url}/api/cart/get`, {}, {
        headers: { token } // Sửa dòng này
      });
      setCartItems(response.data.cartData || {}); // Sửa dòng này
    } catch (error) {
      console.error("Failed to load cart data", error); // Sửa dòng này
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token"); // Sửa dòng này
      if (storedToken) {
        setToken(storedToken); // Sửa dòng này
        await loadCartData(storedToken); // Sửa dòng này
      }
    }
    loadData();
  }, []);

  const contextValue = {
    url,
    food_list,
    menu_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    loadCartData,
    setCartItems,
    currency,
    deliveryCharge,
    deleteFromCart
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
