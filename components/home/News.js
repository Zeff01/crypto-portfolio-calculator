import { View, Text, StyleSheet, Image } from 'react-native';
import React,{ useState, useEffect} from 'react';
import Carousel from 'react-native-snap-carousel';
import news1Image from '../../assets/images/news1.png';
import { dateConverter } from '../../utils/dataConverter';
// import news2Image from '../../assets/images/news2.png';
// import news3Image from '../../assets/images/news3.png';

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

const styles = StyleSheet.create({
    container: {
      height: 121,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
        flexDirection: 'row', 
        backgroundColor: '#e5e5e5',
        borderRadius: 5,
        padding: 20,
        marginHorizontal: 25, 
        elevation: 5,
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
    console.log(data)
    const renderItem = ({ item }) => {
            return (
                <View style={styles.content}>
                    <View style={styles.textContainer}>
                    <Text style={styles.preview}>{item.title}</Text>
                    <Text style={styles.published}>{dateConverter(item.created_at)}</Text>
                    </View>
                    <Image
                    source={item.cover}
                    style={styles.image}
                    />
                </View>
            )
        };
    
    return (
        <View style={styles.container}>
            <Carousel
            data={dummyNews}
            renderItem={renderItem}
            sliderWidth={400}
            itemWidth={400}
            autoplay={true}
            autoplayInterval={5000}
            loop={true}
            layout={'default'}
            />
        </View>
    )
}

export default News