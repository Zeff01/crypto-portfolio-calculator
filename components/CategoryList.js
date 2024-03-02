
import { FlatList, StyleSheet, View, Image, Text } from "react-native";


const CategoryItem = ({ item }) => {
    return (
        <View style={styles.categoryItem}>
            <Image source={{ uri: item.cover }} style={styles.categoryImage} />
            <Text style={styles.categoryTitle}>{item.title}</Text>
            <Text style={styles.categorySubtitle}>{item.subtitle}</Text>
        </View>
    );
};



export const CategoriesList = ({ data }) => {
    return (
        <FlatList
            data={data}
            renderItem={({ item }) => <CategoryItem item={item} />}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    categoryItem: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    categoryImage: {
        width: '100%',
        height: 150, // Adjust based on your preference
        resizeMode: 'cover',
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 10,
        color: '#333',
    },
    categorySubtitle: {
        fontSize: 14,
        marginHorizontal: 10,
        marginBottom: 10,
        color: '#666',
    },
});

