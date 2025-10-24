// utils/storage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

// Use a unique key with a project prefix for safety
const FAVOURITES_KEY = "@ShopPulse_Favourites"; 

/**
 * Retrieves the current list of favorite items.
 * @returns {Array} The array of favorite items.
 */
export const getFavourites = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVOURITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error retrieving favourites:", e);
    return [];
  }
};

/**
 * Adds a new item to the favorites list.
 * @param {Object} item - The product object to add.
 */
export const addFavourite = async (item) => {
  try {
    const currentFavs = await getFavourites();
    if (!currentFavs.some(fav => fav.id === item.id)) {
      const newFavs = [...currentFavs, item];
      await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(newFavs));
    }
  } catch (e) {
    console.error("Error adding favourite:", e);
  }
};

/**
 * Removes an item from the favorites list by its ID.
 * @param {number} itemId - The ID of the item to remove.
 */
export const removeFavourite = async (itemId) => {
  try {
    const currentFavs = await getFavourites();
    const newFavs = currentFavs.filter(fav => fav.id !== itemId);
    await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(newFavs));
  } catch (e) {
    console.error("Error removing favourite:", e);
  }
};