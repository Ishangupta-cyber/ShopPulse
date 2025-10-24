// app/_layout.js - Updated Header

import { Stack } from "expo-router";
// import { LinearGradient } from 'expo-linear-gradient'; // Not needed here if you use standard header

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ 
          headerShown: false, 
        }} 
      />

      {/* The item/[id] detail screen - NOW WITH SHADOWS */}
      <Stack.Screen
        name="item/[id]"
        options={{
          title: "Product Details", 
          // 👈 Apply Green/Success theme for the detail page
          headerStyle: { 
            backgroundColor: "#4CAF50", // Base color
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
          },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack>
  );
}