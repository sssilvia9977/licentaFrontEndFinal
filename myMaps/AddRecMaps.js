import {Keyboard, StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView,} from "react-native";
import * as React from "react";
import colors from "../assets/colors";
import commonStyle from "../assets/style";
import MapView, {Marker} from "react-native-maps";
import {useState} from "react";
import GoogleSearch from "./GoogleSearch";
import {useEffect} from "react";
import axios from "axios";


export default function ({navigation}) {

    const GOOGLE_API_KEY = 'AIzaSyCqf1Djekazim8MTvftAXHifffsQ4Q_VYY';
    const sessionFromBack = navigation.getParam('sessionFromBack', '0');

    const [selectedRecData, setSelectedRecData] = useState({});
    const [selectedRecDetails, setSelectedRecDetails] = useState({});
    const [pressedEnterData, setPressedEnterData] = useState("");
    const [finalAddress, setFinalAddress] = useState("");

    const [latSelectedLocation, setLatSelectedLocation] = useState(0);
    const [longSelectedLocation, setLongSelectedLocation] = useState(0);
    const [recUniq, setRecUniq] = useState(true);
    const [placeExists, setPlaceExists] = useState(false); //verificare daca user a introdus un loc care intr adevar exista
    const [placeCluj, setPlaceCluj] = useState(false); //locatia sa fie din cluj

    const [startSearch, setStartSearch] = useState(false);
    const [addDetailsView, setAddDetailsView] = useState(false);

    const [region, setRegion] = useState({
        latitude: 46.771287,
        longitude: 23.590307,
        latitudeDelta: 0.032,
        longitudeDelta: 0.0001
    });


    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setStartSearch(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setStartSearch(false);
                if (selectedRecData !== "" || Object.keys(selectedRecData).length !== 0) {
                    setAddDetailsView(true);
                }
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        setPlaceCluj(false);
        setPlaceExists(false);
        if (Object.keys(selectedRecData).length !== 0) {
            getLatAndLong(selectedRecData.description);
            verifyRecIsUniq(selectedRecData.description);
            setFinalAddress(selectedRecData.description);
        } else if (pressedEnterData !== "") {
            getLatAndLong(pressedEnterData);
            verifyRecIsUniq(pressedEnterData);
            setFinalAddress(pressedEnterData);
        }
    }, [selectedRecData, selectedRecDetails, pressedEnterData]);

    async function getLatAndLong(address: string) {
        let newAdd = address.replace(/ /g, "+");
        let finalAdd = newAdd.replace(/,/g, "");
        //   console.log("the replaced address: " + finalAdd);
        const resp = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${finalAdd}&key=${GOOGLE_API_KEY}`);
        if (resp.data.status === "OK") {
            setPlaceExists(true);
            if (resp.data.results[0].formatted_address.includes("cluj") || resp.data.results[0].formatted_address.includes("Cluj")) {
                setPlaceCluj(true);
                const latSelectedLocation = resp.data.results[0].geometry.location.lat;
                const longSelectedLocation = resp.data.results[0].geometry.location.lng;

                setLatSelectedLocation(latSelectedLocation);
                setLongSelectedLocation(longSelectedLocation);

                setRegion(
                    {
                        latitude: latSelectedLocation,
                        longitude: longSelectedLocation,
                        latitudeDelta: 0.0070,
                        longitudeDelta: 0.00050
                    }
                );
            }
        }
    }

    async function verifyRecIsUniq(address) {
        const resp = await axios.post('http://192.168.43.239:8080/checkUniq', {address: address});
        //  console.log("Rec cautat este uniq in baza de date? ");
        //   console.log(resp.data);
        setRecUniq(resp.data);
    }

    return (
        <View style={styles.container}>
            <View style={commonStyle.statusBar}/>
            <View
                style={styles.containerMaps}>
                <MapView
                    showsUserLocation
                    region={region}
                    style={{flex: 1}}
                >

                    <Marker coordinate={{latitude: latSelectedLocation, longitude: longSelectedLocation}}/>

                </MapView>

                <View style={{
                    width: "100%", paddingTop: 10, marginBottom: 10, position: 'absolute',//use absolute position to show button on top of the map
                    flex: 1,
                }}>
                    <GoogleSearch sendPressEnterData={setPressedEnterData}
                                  sendDetailsLeavingLocation={setSelectedRecDetails}
                                  sendDataLeavingLocation={setSelectedRecData}/>
                </View>

                {
                    startSearch ?
                        <View/> :

                        <View
                            style={{
                                position: 'absolute',
                                width: '90%',
                                marginBottom: 20,
                                marginLeft: 20,
                                marginRight: 20,
                                paddingRight: 20,
                                paddingLeft: 20,
                                paddingBottom: 20,
                                backgroundColor: 'rgba(214, 162, 232, .8)',
                                alignSelf: "flex-end",
                                borderRadius: 20,
                                padding: 10,
                            }}
                        >

                            {
                                addDetailsView ?
                                    (
                                        placeExists ?
                                            (
                                                placeCluj ?
                                                    (
                                                        recUniq ?

                                                                <TouchableOpacity
                                                                    style={{alignItems:"center"}}
                                                                    onPress={() => navigation.navigate("AddRecFinalStep", {sessionFromBack:sessionFromBack ,finalAddress:finalAddress})}>
                                                                    <Text style={[commonStyle.textButtonCommon, {fontSize: 30}]}>Next ></Text>
                                                                </TouchableOpacity>


                                                            :
                                                            <Text style={commonStyle.labelText}>This place is already recommended.</Text>
                                                    )
                                                    :
                                                    <Text style={commonStyle.labelText}>Please enter a place form Cluj-Napoca.</Text>
                                            )
                                            :
                                            <Text style={commonStyle.labelText}>Please enter a valid recommendation.</Text>
                                    )
                                    :
                                    <Text style={commonStyle.labelText}>Search for the place you want to recommend</Text>
                            }


                        </View>
                }


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


});

