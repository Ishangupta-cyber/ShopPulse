// app/(tabs)/_layout.js - Updated Header

import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import { getCartItemCount } from "../../utils/cartStorage"; 
import { LinearGradient } from 'expo-linear-gradient'; // 👈 NEW IMPORT

// --- Custom Header Right Component (remains the same) ---
const CartIconWithBadge = () => {
    // ... (CartIconWithBadge logic remains the same) ...
    const router = useRouter();
    const [cartCount, setCartCount] = useState(0);

    useFocusEffect(
        useCallback(() => {
            const loadCount = async () => {
                const count = await getCartItemCount();
                setCartCount(count);
            };
            loadCount();
        }, [])
    );

    return (
        <TouchableOpacity 
            style={{ marginRight: 15 }} 
            onPress={() => router.push('/cart')} 
        >
            <Ionicons name="cart-outline" size={24} color="#fff" />
            {cartCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

// --- Custom Header Component (NEW) ---
const CustomHeader = (props) => (
    <LinearGradient
        // Custom blue gradient colors (light blue to darker blue)
        colors={['#42A5F5', '#2196F3']} 
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
    >
        <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{props.options.title}</Text>
            {/* Render the headerRight content here */}
            {props.options.headerRight && props.options.headerRight()}
        </View>
    </LinearGradient>
);


export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2196F3",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#F4F6F8" },
        
        // 👈 KEY CHANGE: Set headerShown to false and use a custom header component
        headerShown: false,
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "ShopPulse Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          header: (props) => <CustomHeader {...props} />, // 👈 Use the custom component
          headerRight: () => <CartIconWithBadge />,
        }}
      />

      <Tabs.Screen
        name="favourites"
        options={{
          title: "My Favourites",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
          header: (props) => <CustomHeader {...props} />, // 👈 Use the custom component
          headerRight: () => <CartIconWithBadge />,
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Shopping Cart",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
          header: (props) => <CustomHeader {...props} />, // 👈 Use the custom component
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
    // ... (Keep existing styles for badge) ...
    badge: { /* ... */ },
    badgeText: { /* ... */ },

    // 👈 NEW HEADER STYLES
    headerGradient: {
        height: 100, // Adjust height as needed
        paddingTop: 40, // Space for status bar
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
});