import React, { useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { getFavourites } from "../../utils/storage";
import ItemList from "../../components/ItemList";

export default function Favourites() {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      getFavourites()
        .then((items) => setFavs(items || []))
        .finally(() => setLoading(false));
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading favourites...</Text>
      </View>
    );
  }

  if (favs.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emoji}>💙</Text>
        <Text style={styles.emptyTitle}>No favourites yet</Text>
        <Text style={styles.emptySubtitle}>
          Browse items and add them to your favourites!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Favourites 💙</Text>
      <ItemList
        data={favs}
        onItemPress={(item) => router.push(`/item/${item.id}`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    paddingHorizontal: 12,
    paddingTop: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2196F3",
    marginBottom: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6F8",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  emoji: {
    fontSize: 50,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
});
