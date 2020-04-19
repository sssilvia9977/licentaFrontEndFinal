import * as React from "react";
import {View, Text, StyleSheet, ActivityIndicator} from "react-native";
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


export default function ({navigation}) {


    const sessionFromBack = navigation.getParam('sessionFromBack', '0');
    const [openMenu, setOpenMenu] = useState(false);

    const [permissionResponse, setPermissionResponse] = useState(false);
    const [location, setLocation] = useState({latitude: 0, longitude: 0, title: ''});
    const [errorMsg, setErrorMsg] = useState();

    const destination = navigation.getParam("address", "");


    useEffect(() => {
        (async () => {

            let currentLocation;
            const { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setPermissionResponse(true);
            }
            else{
                if (status === 'granted'){
                    currentLocation = await Location.getCurrentPositionAsync({});
                    setLocation({latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude, title: ''});
                    debugger;
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
                permissionResponse  ?
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text>We need your permission! :) </Text>
                    </View>

                    :

                    <MapView
                        showsUserLocation
                        region={{latitude: location.latitude, longitude: location.longitude, longitudeDelta: 0.032, latitudeDelta: 0.0001}}
                        style={{flex: 1}}
                    >

                    </MapView>





            }

        </View>
    );
}


//<Marker coordinate={location}/>

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroudCommon,
        justifyContent: 'flex-start',
    }
});