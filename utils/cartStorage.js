// utils/cartStorage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_KEY = "@ShopPulse_Cart";

/**
 * Retrieves the current cart array from AsyncStorage.
 * @returns {Array} The cart array or an empty array if none exists.
 */
export const getCart = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CART_KEY);
    // Cart items include a 'quantity' property
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to fetch cart.", e);
    return [];
  }
};

/**
 * Adds an item to the cart or increments its quantity if it already exists.
 * @param {Object} item - The product object to add.
 */
export const addToCart = async (item) => {
  try {
    const currentCart = await getCart();
    const itemIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);

    if (itemIndex > -1) {
      // Item already in cart, increment quantity
      currentCart[itemIndex].quantity += 1;
    } else {
      // New item, add with quantity 1
      currentCart.push({ ...item, quantity: 1 });
    }

    const jsonValue = JSON.stringify(currentCart);
    await AsyncStorage.setItem(CART_KEY, jsonValue);

  } catch (e) {
    console.error("Failed to add item to cart.", e);
  }
};

/**
 * Removes an item completely from the cart by its ID.
 */
export const removeFromCart = async (itemId) => {
  try {
    const currentCart = await getCart();
    const newCart = currentCart.filter(item => item.id !== itemId);
    const jsonValue = JSON.stringify(newCart);
    await AsyncStorage.setItem(CART_KEY, jsonValue);
  } catch (e) {
    console.error("Failed to remove item from cart.", e);
  }
};

/**
 * Calculates the total number of items (sum of all quantities) in the cart.
 * This is used for the cart badge/count.
 */
export const getCartItemCount = async () => {
    const cart = await getCart();
    // Sums the quantity of all items in the cart
    return cart.reduce((total, item) => total + item.quantity, 0);
};