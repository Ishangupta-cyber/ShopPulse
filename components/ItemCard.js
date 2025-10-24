import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { addFavourite, removeFavourite, getFavourites } from "../utils/storage";

export default function ItemCard({ item, onPress }) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    checkFavourite();
  }, []);

  const checkFavourite = async () => {
    const favs = await getFavourites();
    setIsFav(favs.some((fav) => fav.id === item.id));
  };

  const toggleFavourite = async () => {
    if (isFav) {
      await removeFavourite(item.id);
      setIsFav(false);
    } else {
      await addFavourite(item);
      setIsFav(true);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.price}>₹{item.price}</Text>

      <TouchableOpacity style={styles.favBtn} onPress={toggleFavourite}>
        <Text style={styles.favText}>{isFav ? "💔" : "❤️"}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: "relative",
  },
  image: { width: "100%", height: 100, borderRadius: 8 },
  title: { fontSize: 14, fontWeight: "bold", marginVertical: 5, color: "#333" },
  price: { fontSize: 12, color: "green" },
  favBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 20,
    elevation: 2,
  },
  favText: { fontSize: 16 },
});
