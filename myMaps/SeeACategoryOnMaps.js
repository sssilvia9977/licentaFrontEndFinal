import {ActivityIndicator, ScrollView, StyleSheet, TouchableHighlight, View, Dimensions} from "react-native";
import commonStyle from "../assets/style";
import MapView, {Marker} from "react-native-maps";
import * as React from "react";
import {useState} from "react";
import CardView from "../src/recomandari/CardView";
import axios from "axios";
import {useEffect} from "react";
import Carousel from "react-native-snap-carousel/src/carousel/Carousel";
import ButtonOpenRecSite from "../src/recomandari/ButtonOpenRecSite";
import {useRef} from "react";


export default function ({navigation}) {

    const GOOGLE_API_KEY = 'AIzaSyCqf1Djekazim8MTvftAXHifffsQ4Q_VYY';

    const startPlaceIndex = navigation.getParam("startPlace", 0);
    const categArray = navigation.state.params.categArray;

    const [carouselIndex, setCarouselIndex] = useState(startPlaceIndex);
    const [myPlaceId, setMyPlaceId] = useState("");
    const [placeIdArray, setPlaceIdArray] = useState([]);
    const [placeGeoLoc, setPlaceGeoLoc] = useState([]);
    const [region, setRegion] = useState({
        latitude: 46.771287,
        longitude: 23.590307,
        latitudeDelta: 0.032,
        longitudeDelta: 0.0001
    });
    const [render, setRender] = useState(false);


    useEffect(() => {
        let placeIdArrayInitial = [];
        (async () => {
            let arrayGeoCoordsObjects = [];
            for (const e of categArray) {
                let newAdd = e.address.replace(/ /g, "+");
                let finalAdd = newAdd.replace(/,/g, "");
                let latLongObj = {};

                const resp = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${finalAdd}&key=${GOOGLE_API_KEY}`);
                const latSelectedLocation = resp.data.results[0].geometry.location.lat;
                const longSelectedLocation = resp.data.results[0].geometry.location.lng;

                latLongObj = {
                    lat: latSelectedLocation,
                    long: longSelectedLocation
                };
                arrayGeoCoordsObjects = [...arrayGeoCoordsObjects, latLongObj];

                //----------------------------------------
                const respPlaceId = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${finalAdd}&inputtype=textquery&fields=place_id&key=${GOOGLE_API_KEY}`);
                placeIdArrayInitial = [...placeIdArrayInitial, respPlaceId.data.candidates[0].place_id]

            }

            setRegion(
                {
                    latitude: arrayGeoCoordsObjects[startPlaceIndex].lat,
                    longitude: arrayGeoCoordsObjects[startPlaceIndex].long,
                    latitudeDelta: 0.0170,
                    longitudeDelta: 0.00150
                });

            setPlaceIdArray(placeIdArrayInitial);
            setPlaceGeoLoc(arrayGeoCoordsObjects);

            setRender(true);

            setMyPlaceId(placeIdArrayInitial[startPlaceIndex]);

        })();


    }, []);

    function renderCarouselItem({item}) {
        return (
            <View>
                <CardView placeName={item.placeName} address={item.address}
                          comment={item.initialComment}/>
            </View>
        );
    }


    async function onCarouselItemChange(index) {
        let newAdd = categArray[index].address.replace(/ /g, "+");
        let finalAdd = newAdd.replace(/,/g, "");

        const resp = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${finalAdd}&key=${GOOGLE_API_KEY}`);
        const latSelectedLocation = resp.data.results[0].geometry.location.lat;
        const longSelectedLocation = resp.data.results[0].geometry.location.lng;

        setMyPlaceId(placeIdArray[index]);
        setCarouselIndex(index);

        setRegion({
            latitude: latSelectedLocation,
            longitude: longSelectedLocation,
            latitudeDelta: 0.0170,
            longitudeDelta: 0.00150,
        })

      // this._map.animateCamera({center: {latitude:latSelectedLocation, longitude:longSelectedLocation}}, 1000)

        return(
            <Marker pinColor={"blue"} coordinate={{latitude: latSelectedLocation, longitude:longSelectedLocation}}/>
        );

    };

    if (!render)
        return (
            <View>
                <View style={commonStyle.statusBar}/>
                <ActivityIndicator/>
            </View>
        );
    return (

        <View style={styles.container}>
            <View style={commonStyle.statusBar}/>
            <View
                style={styles.containerMaps}>
                <MapView
                    showsUserLocation
                    region={region}
                    style={styles.map}
                    ref={map => this._map = map}
                >
                    {
                        placeGeoLoc.map((place, index) => (
                            <Marker pinColor={index === carouselIndex ? 'blue' : 'red'} key={index === carouselIndex? 'blue' + index : 'red' + index} coordinate={{latitude: place.lat, longitude: place.long}}/>
                        ))
                    }
                </MapView>

                <Carousel
                    ref={(c) => {this._carousel = c;}}
                    data={categArray}
                    renderItem={renderCarouselItem}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={270}
                    containerCustomStyle={styles.carousel}
                    onSnapToItem={(index) => onCarouselItemChange(index)}
                    firstItem={startPlaceIndex}
                />

                <View style={{position: "absolute", top: 670, left: 130}}>
                    <ButtonOpenRecSite placeId={myPlaceId}/>
                </View>

            </View>
        </View>

    );
}

const styles = StyleSheet.create({

    containerMaps: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: "row",
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: "column",
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    carousel: {
        position: 'absolute',
        bottom: 0,
        marginBottom: 48
    },

});
