import React from "react";
import { FlatList, View } from "react-native";
import ItemCard from "./ItemCard";

export default function ItemList({ data, onItemPress }) {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <ItemCard item={item} onPress={onItemPress} />}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      contentContainerStyle={{ padding: 10 }}
    />
  );
}
