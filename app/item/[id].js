// app/item/[id].js

import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView, // 👈 Added ScrollView for better UX
} from "react-native";
import { addFavourite, removeFavourite, getFavourites } from "../../utils/storage";
import { addToCart } from "../../utils/cartStorage"; // 👈 NEW IMPORT for Cart

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
        checkFavourite(data.id);
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
        setLoading(false);
        Alert.alert("Error", "Could not load product details.");
      });
  }, [id]);

  const checkFavourite = async (productId) => {
    const favs = await getFavourites();
    setIsFav(favs.some((item) => item.id === productId));
  };

  const toggleFavourite = async () => {
    if (!product) return;

    if (isFav) {
      await removeFavourite(product.id);
      setIsFav(false);
      Alert.alert("Removed from favourites 💔");
    } else {
      await addFavourite(product);
      setIsFav(true);
      Alert.alert("Added to favourites ❤️");
    }
  };

  // 👈 NEW FUNCTION: Handle adding item to cart
  const handleAddToCart = () => {
    if (product) {
        addToCart(product);
        Alert.alert("Added to Cart 🛒", `${product.title} has been added.`);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#2196F3" style={styles.center} />;
  }

  // Handle case where product might not be found
  if (!product || product.id === undefined) {
    return (
        <View style={styles.center}>
            <Text style={styles.title}>Product Not Found</Text>
        </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={{ uri: product.image }} style={styles.image} />
        
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>₹{product.price}</Text>
        <Text style={styles.desc}>{product.description}</Text>

        {/* 👈 BUTTON ROW: Updated to include two buttons */}
        <View style={styles.buttonRow}>
            {/* Favourites Button */}
            <TouchableOpacity style={styles.favBtn} onPress={toggleFavourite}>
                <Text style={styles.favText}>
                    {isFav ? "💔 Remove" : "❤️ Favourites"}
                </Text>
            </TouchableOpacity>

            {/* NEW: Add to Cart Button */}
            <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
                <Text style={styles.cartText}>
                    🛒 Add to Cart
                </Text>
            </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: "#F4F6F8" },
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee'
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, color: "#333" },
  price: { fontSize: 28, fontWeight: "900", color: "#2196F3", marginBottom: 15 },
  desc: { fontSize: 16, color: "#555", lineHeight: 24, marginBottom: 30 },
  
  // New Styles for Button Row
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto', // Pushes buttons to the bottom
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  favBtn: {
    flex: 1,
    backgroundColor: "#FF5252", // Red for removing/managing favorites
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginRight: 10,
  },
  favText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  
  // New Cart Button Styles
  cartBtn: {
    flex: 1.5,
    backgroundColor: "#4CAF50", // Green for positive action (Add to Cart)
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  cartText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});