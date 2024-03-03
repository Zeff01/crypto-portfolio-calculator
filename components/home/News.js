import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
// import Carousel from 'react-native-snap-carousel';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import news1Image from '../../assets/images/news1.png';
import { dateConverter } from '../../utils/dataConverter';
// import news2Image from '../../assets/images/news2.png';
// import news3Image from '../../assets/images/news3.png';
import { Dimensions } from 'react-native';


dummyNews = [
    {
        title: 'Why Bitcoiners Are Rooting for This Latest China Mining Ban to Finally, Actually Be Real',
        created_at: '2024-03-02T00:01:14.684Z',
        cover: news1Image
    },
    {
        title: '‘Grayscale Discount’ Narrows to 10% and Could Shrink More as Lockups Expire',
        created_at: '2024-03-02T08:08:14.684Z',
        cover: news1Image
    },
    {
        title: 'Elon Musk Says Lightning Network ‘Needed’ to Scale Bitcoin for Now',
        created_at: "2024-03-02T23:13:14.684Z",
        cover: news1Image
    }
]

const windowWidth = Dimensions.get('window').width;
const itemWidth = windowWidth - 35;

const styles = StyleSheet.create({
    container: {
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flexDirection: 'row',
        backgroundColor: '#e5e5e5',
        borderRadius: 10,
        padding: 10,
        width: itemWidth,
    },
    firstItem: {
        marginLeft: 20,
    },
    lastItem: {
        marginRight: 25,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'space-between'
    },
    preview: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    published: {
        color: 'gray',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 5,
    },

});

const News = ({ data }) => {


    const renderSeparator = () => {
        return <View style={{ width: 43 }} />; // Adjust the width to your desired gap size
    };

    const renderItem = ({ item, index }) => {
        const isFirstItem = index === 0;
        const isLastItem = index === dummyNews.length - 1;

        const contentStyles = [
            styles.content,
            isFirstItem && styles.firstItem,
            isLastItem && styles.lastItem
        ];

        return (
            <TouchableOpacity style={[styles.content, contentStyles]} onPress={() => console.log('Goes to news page')}>
                <View style={styles.textContainer}>
                    <Text style={styles.preview}>{item.title}</Text>
                    <Text style={styles.published}>{dateConverter(item.created_at)}</Text>
                </View>
                <Image
                    source={item.cover}
                    style={styles.image}
                />
            </TouchableOpacity>
        )
    };

    return (
        <View style={styles.container}>
            <SwiperFlatList
                autoplay={true}
                autoplayDelay={5}
                autoplayLoop={true}
                autoplayLoopKeepAnimation={true}
                data={dummyNews}
                renderItem={renderItem}
                ItemSeparatorComponent={renderSeparator}
            />
        </View>
    )
}

export default News