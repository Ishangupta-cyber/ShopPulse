// app/(tabs)/cart.js
import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "expo-router";
// app/(tabs)/cart.js - CORRECTED PATH
import { getCart, removeFromCart } from "../../utils/cartStorage";

// Temporary component for displaying a cart item (you can replace this with a dedicated CartItemCard later)
const CartItem = ({ item, onRemove }) => (
    <View style={cartStyles.itemCard}>
        <View style={cartStyles.info}>
            <Text style={cartStyles.title} numberOfLines={2}>{item.title}</Text>
            <Text style={cartStyles.quantity}>Qty: {item.quantity}</Text>
            <Text style={cartStyles.price}>₹{(item.price * item.quantity).toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={cartStyles.removeButton} onPress={() => onRemove(item.id)}>
            <Text style={cartStyles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
    </View>
);

export default function CartScreen() {
    const [cartItems, setCartItems] = useState([]);

    // Load cart items every time the screen is focused (essential for dynamic updates)
    useFocusEffect(
        useCallback(() => {
            loadCart();
        }, [])
    );

    const loadCart = async () => {
        const items = await getCart();
        setCartItems(items);
    };

    const handleRemove = async (itemId) => {
        Alert.alert(
            "Confirm Remove",
            "Are you sure you want to remove this item from your cart?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        await removeFromCart(itemId);
                        loadCart(); // Reload the cart to update the UI
                    }
                }
            ]
        );
    };

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    };

    if (cartItems.length === 0) {
        return (
            <View style={cartStyles.center}>
                <Text style={cartStyles.emoji}>🛒</Text>
                <Text style={cartStyles.emptyTitle}>Your cart is empty</Text>
                <Text style={cartStyles.emptySubtitle}>
                    Add some items from the Home screen!
                </Text>
            </View>
        );
    }

    return (
        <View style={cartStyles.container}>
            <Text style={cartStyles.header}>Your Shopping Cart</Text>
            <FlatList
                data={cartItems}
                renderItem={({ item }) => <CartItem item={item} onRemove={handleRemove} />}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingHorizontal: 10 }}
            />
            <View style={cartStyles.footer}>
                <Text style={cartStyles.totalText}>Total: ₹{calculateTotal()}</Text>
                <TouchableOpacity style={cartStyles.checkoutButton}>
                    <Text style={cartStyles.checkoutButtonText}>Proceed to Checkout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const cartStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F4F6F8", paddingTop: 40 },
    header: { fontSize: 22, fontWeight: "700", color: "#2196F3", marginBottom: 10, paddingHorizontal: 10 },
    center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F4F6F8" },
    emoji: { fontSize: 50, marginBottom: 12 },
    emptyTitle: { fontSize: 20, fontWeight: "600", marginBottom: 6, color: "#333" },
    emptySubtitle: { fontSize: 15, color: "#666", textAlign: "center" },

    // Item Card Styles
    itemCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginVertical: 6,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    info: { flex: 1, marginRight: 10 },
    title: { fontSize: 16, fontWeight: '600' },
    quantity: { fontSize: 14, color: '#555', marginTop: 5 },
    price: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50', marginTop: 5 },
    removeButton: {
        backgroundColor: '#FF5252',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    removeButtonText: { color: '#fff', fontWeight: 'bold' },

    // Footer Styles
    footer: {
        padding: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#eee',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'right',
        marginBottom: 10,
    },
    checkoutButton: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});