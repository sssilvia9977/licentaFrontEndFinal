import * as React from "react";
import {View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView} from "react-native";
import colors from "../assets/colors";
import commonStyle from "../assets/style";
import {Overlay} from "react-native-elements";
import Menu from "../src/Menu";
import {useState} from "react";
import MapView from 'react-native-maps';
import * as Permissions from "expo-permissions";
import Polyline from '@mapbox/polyline'
import {Marker} from "react-native-maps";
import {useEffect} from "react";
import * as Location from 'expo-location';
import {FontAwesome5} from "@expo/vector-icons";


export default function ({navigation}) {

    const [onFocusPickAssig, setOnFocusPickAssig] = useState(1);

    const sessionFromBack = navigation.getParam('sessionFromBack', '0');
    const [openMenu, setOpenMenu] = useState(false);

    const [permissionResponse, setPermissionResponse] = useState(false);
    const [location, setLocation] = useState({latitude: 0, longitude: 0, title: ''});
    const [errorMsg, setErrorMsg] = useState();

    const destination = navigation.getParam("address", "");
    const [destCoords, setDestCoords] = useState([]);


    async function getDirections(startLoc, desLoc) {
        try {
            //aici am ceva eroare la respJson
            const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${desLoc}&key=AIzaSyCqf1Djekazim8MTvftAXHifffsQ4Q_VYY`)
            const respJson = await resp.json();
            const points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            const coords = points.map(point => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            });
            setDestCoords(coords);
        } catch (e) {
            console.log('Error', e)
        }
    }


    useEffect(() => {
        (async () => {
            let currentLocation;
            const {status} = await Permissions.askAsync(Permissions.LOCATION);
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setPermissionResponse(true);
            } else {
                if (status === 'granted') {
                    currentLocation = await Location.getCurrentPositionAsync({});
                    setLocation({
                        latitude: currentLocation.coords.latitude,
                        longitude: currentLocation.coords.longitude,
                        title: ''
                    });
                    getDirections(location, destination);
                }
            }
        })();


    }, []);


    return (
        <View style={styles.container}>
            <View style={commonStyle.statusBar}/>
            <View style={commonStyle.navigationBar}>
                <Text onPress={() => setOpenMenu(true)}>Menu</Text>
                <Overlay isVisible={openMenu}
                         animationType="fade"
                         borderRadius={9}
                         height={370}
                         containerStyle={{flex: 1, flexDirection: "row", justifyContent: "flex-start"}}
                         windowBackgroundColor="rgba(214, 162, 232, .9)"
                         overlayBackgroundColor={colors.backgroudCommon}
                         onBackdropPress={() => setOpenMenu(false)}>
                    <Menu navigation={navigation} disapear={setOpenMenu} session={sessionFromBack}/>
                </Overlay>
            </View>

            {
                permissionResponse ?
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <ActivityIndicator size="large" color="#0000ff"/>
                        <Text>We need your permission! :) </Text>
                    </View>

                    :

                    <View
                        style={styles.container}>
                        <MapView
                            showsUserLocation
                            region={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                                longitudeDelta: 0.032,
                                latitudeDelta: 0.0001
                            }}
                            style={{flex: 1}}
                        >
                        </MapView>

                        <View
                            style={{
                                width: "100%",
                                paddingTop: 10,
                                position: 'absolute',//use absolute position to show button on top of the map
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                            }}
                        >

                            <TouchableOpacity
                                style={onFocusPickAssig === 1 ? styles.iconAreaFocus : styles.iconAreaBlur}
                                onPress={() => setOnFocusPickAssig(1)}>
                                <FontAwesome5 style={{paddingLeft: 5, paddingBottom: 7, margin: 7}} name="walking"
                                              size={25}
                                              color={colors.white}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={onFocusPickAssig === 2 ? styles.iconAreaFocus : styles.iconAreaBlur}
                                onPress={() => setOnFocusPickAssig(2)}>
                                <FontAwesome5 style={{paddingBottom: 7, margin: 7}} name="bus"
                                              size={25}
                                              color={colors.white}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={onFocusPickAssig === 3 ? styles.iconAreaFocus : styles.iconAreaBlur}
                                onPress={() => setOnFocusPickAssig(3)}>
                                <FontAwesome5 style={{paddingBottom: 7, margin: 7}} name="car"
                                              size={25}
                                              color={colors.white}
                                />
                            </TouchableOpacity>
                        </View>


                        <View
                            style={{
                                position: 'absolute',
                                backgroundColor: 'rgba(214, 162, 232, .1)',
                                alignSelf: "flex-end",
                                borderRadius: 20,
                                padding: 10,
                            }}
                        >
                            <Text style={commonStyle.labelText}>Course starts at: </Text>
                            <Text style={commonStyle.labelText}>Time to leave: </Text>
                            <Text style={commonStyle.labelText}>Time on road: </Text>
                        </View>


                    </View>


            }

        </View>
    );
}

// <Marker coordinate={{latitude: destination.latitude, longitude: destination.longitude}}/>
//<Marker coordinate={location}/>

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: "column",
    },
    iconAreaFocus: {
        backgroundColor: colors.buttonCommon,
        padding: 10,
        borderRadius: 20,
        width: 60,
        height: 60,
    },
    iconAreaBlur: {
        backgroundColor: colors.gray,
        padding: 10,
        borderRadius: 20,
        width: 60,
        height: 60,
    },

});