// app/(tabs)/index.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList, // This is the main scroller now
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView, // Still needed for horizontal category/trending rows
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
// Assuming you have this hook defined in 'hooks/useDebounce'
// import useDebounce from "../../hooks/useDebounce"; 

const { width } = Dimensions.get("window");

// --- Helper Hook (Assuming it's not globally available, you can define it here) ---
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};


// 1. **ListHeaderComponent**: Contains all content that appears above the main product grid.
const ListHeader = ({ products, search, handleCategoryFilter, handleSearch }) => {
    return (
        <View>
            {/* Category Chips (Uses horizontal ScrollView - no conflict) */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.categoryRow}
            >
                {["All", "Men", "Women", "Electronics", "Jewelry"].map((cat, i) => (
                    <TouchableOpacity
                        key={i}
                        style={styles.categoryChip}
                        onPress={() => handleCategoryFilter(cat)}
                    >
                        <Text style={styles.categoryText}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search products..."
                    placeholderTextColor="#888"
                    value={search}
                    onChangeText={handleSearch} // Updates the fast 'search' state
                />
            </View>

            {/* Trending Now (Uses horizontal ScrollView - no conflict) */}
            <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingRow}>
                {products.slice(0, 5).map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.trendingCard}
                        onPress={() => router.push(`/item/${item.id}`)}
                    >
                        <Image source={{ uri: item.image }} style={styles.trendingImage} />
                        <Text style={styles.trendingTitle} numberOfLines={1}>
                            {item.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};


// 2. Main Component (Home) Logic
export default function Home() {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const router = useRouter();

    // Debounce the search input for performance
    const debouncedSearch = useDebounce(search, 500);

    // Initial Data Fetch
    useEffect(() => {
        fetch("https://fakestoreapi.com/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setFiltered(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Search Filtering Logic (runs only after debouncing)
    useEffect(() => {
        if (debouncedSearch.trim() === "") {
            setFiltered(products);
        } else {
            const newData = products.filter((item) =>
                item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
            setFiltered(newData);
        }
    }, [debouncedSearch, products]);

    // Handle instant text input update
    const handleSearch = (text) => {
      setSearch(text);
    };

    // Handle Category Filtering
    const handleCategoryFilter = (cat) => {
        // Reset search field when filtering by category
        setSearch(""); 
        if (cat === "All") {
            setFiltered(products);
        } else {
            const newData = products.filter((p) =>
                p.category.toLowerCase().includes(cat.toLowerCase())
            );
            setFiltered(newData);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/item/${item.id}`)}
        >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title} numberOfLines={2}>
                {item.title}
            </Text>
            <Text style={styles.price}>₹{item.price}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header remains outside the main scroller */}
            <View style={styles.header}>
                <Text style={styles.headerText}>ShopPulse</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#2196F3" style={{ flex: 1, marginTop: 20 }} />
            ) : (
                // 3. THE FIX: FlatList is now the primary vertical scroller
                <FlatList
                    data={filtered}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.list}
                    
                    // 4. All other content is moved to the header component
                    ListHeaderComponent={
                      <ListHeader 
                        products={products} 
                        search={search} 
                        handleCategoryFilter={handleCategoryFilter}
                        handleSearch={handleSearch}
                      />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
  // ... (All styles remain the same) ...
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  header: {
    height: 60,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  headerText: { fontSize: 30, fontWeight: "bold", color: "#fff" },

  categoryRow: { flexDirection: "row", marginVertical: 10, paddingHorizontal: 10 },
  categoryChip: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
  },
  categoryText: { color: "#2196F3", fontWeight: "600" },

  searchContainer: {
    backgroundColor: "#fff",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    elevation: 2,
  },
  searchInput: { height: 40, fontSize: 16, color: "#333" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
    marginTop: 10,
    color: "#333",
  },
  trendingRow: { paddingVertical: 10, paddingLeft: 10 },
  trendingCard: {
    width: 120,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
    padding: 10,
    elevation: 3,
  },
  trendingImage: { width: 80, height: 80, resizeMode: "contain" },
  trendingTitle: { fontSize: 12, textAlign: "center", marginTop: 5, color: "#333" },

  list: { padding: 10 },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    elevation: 3,
  },
  image: { width: 100, height: 100, resizeMode: "contain", marginBottom: 10 },
  title: { fontSize: 14, fontWeight: "600", color: "#333", textAlign: "center" },
  price: { fontSize: 16, fontWeight: "bold", color: "#2196F3", marginTop: 5 },
});