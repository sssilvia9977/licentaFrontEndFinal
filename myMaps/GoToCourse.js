import * as React from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    KeyboardAvoidingView,
    TextInput, TouchableWithoutFeedback, Keyboard
} from "react-native";
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
import axios from 'axios';
import GoogleSearch from "./GoogleSearch";


export default function ({navigation}) {

    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const bus = "transit"; // you can optionally specify either a departure_time or an arrival_time. If neither time is specified, the departure_time defaults to now
    const walk = "walking";
    const car = "driving";
    const GOOGLE_API_KEY = "AIzaSyCqf1Djekazim8MTvftAXHifffsQ4Q_VYY";

    const [onFocusPickAssig, setOnFocusPickAssig] = useState(1);

    const sessionFromBack = navigation.getParam('sessionFromBack', '0');
    const [openMenu, setOpenMenu] = useState(false);

    const [permissionResponse, setPermissionResponse] = useState(false);
    const [location, setLocation] = useState({latitude: 0, longitude: 0, title: ''});
    const [errorMsg, setErrorMsg] = useState();
    const [wayOfTransport, setWayOfTransport] = useState(walk);

    const destination = navigation.getParam("address", "");
    const hourStart = navigation.getParam("hourStart", "");  //asta e doar ora la care incepe cursul
    const classRoom = navigation.getParam("classRoom", "");
    const courseDateStartTimeStamp = navigation.getParam("timestamp", 0);   //asta tine ziua si data la care incepe cursrul, nu si ora gen 22 apr 2020 ora 00:00:00 adica fix 12 noaptea
    const [courseStartDate, setCourseStartDate] = useState(days[new Date(courseDateStartTimeStamp).getDay()]);
    const [timeToLeave, setTimeToLeave] = useState("");
    const [fromSchedule, setFromSchedule] = useState(hourStart !== "");  // daca e din sch pot sa arata si ora plecare si etc si sa pun sa setez alarma

    const [destCoords, setDestCoords] = useState({latitude: 0, longitude: 0});
    const [destPolylineCoords, setDestPolylineCoords] = useState([]);
    const [duration, setDuration] = useState("");

    const [first, setFirst] = useState(true);
    const [render, setRender] = useState(false);

    const [onFocusStyleUsername, setOnFocusStyleUsername] = useState(true); // pt cand apas pe a introduce o adresa
    const [startSearch, setStartSearch] = useState(false);

    function calculateMillisecondsFromMidnightToSpecificHour(hour: string) {
        let nrOfHours = hour.substr(0, 1) === "0" ? hour.substr(1, 1) : hour.substr(0, 2); //eu am ora gen 08 sau 13
        let nrOfMinutes = hour.substr(3, 1) === "0" ? hour.substr(4, 1) : hour.substr(3, 2);

        let nrOfHoursToMillis = parseInt(nrOfHours) * 3600000;
        let nrOfMinutesToMillis = parseInt(nrOfMinutes) * 60000;

        return nrOfHoursToMillis + nrOfMinutesToMillis;
    }

    function travelTimeToMillis(travelTime: string) {
        let travelTimeArray = travelTime.split(" ");
        let nrZile = 0;
        let nrOre = 0;
        let nrMinute = 0;

        //verifica daca zice cate zile sau numa cate or / minute
        if (travelTime.includes("days") && travelTime.includes("hours") && travelTime.includes("min")) {
            nrZile = parseInt(travelTimeArray[0]);
            nrOre = parseInt(travelTimeArray[2]);
            nrMinute = parseInt(travelTimeArray[4]);
        } else if (travelTime.includes("days") && travelTime.includes("hours")) {
            nrZile = parseInt(travelTimeArray[0]);
            nrOre = parseInt(travelTimeArray[2]);
        } else if (travelTime.includes("hours") && travelTime.includes("min")) {
            nrOre = parseInt(travelTimeArray[0]);
            nrMinute = parseInt(travelTimeArray[2]);
        } else if (travelTime.includes("min")) {
            nrMinute = parseInt(travelTimeArray[0]);
        }

        return nrZile * 86400000 + nrOre * 3600000 + nrMinute * 60000;
    }

    function checkDate(date) {
        if (date < 10)
            return "0" + date;
        return date;
    }

    function calculateTimeToLeave(courseDateStart: number, courseStartHour: string, travelTime: string) {

        //1. fa un format pt ziua si ora in care am acel curs, sa fie totul in timestamp
        let courseDateAndHourMillis = calculateMillisecondsFromMidnightToSpecificHour(courseStartHour) + courseDateStart;

        //2. travel time este string care are numar de zile si ore si trebuie reprezentat tot in timestamp
        let travelTimeMillis = travelTimeToMillis(travelTime);

        //3. scadere intre ziua curs si travel time => imi da ziua si ora la care tre sa plece omul, rezultatul e tot un time stamp
        let timeToLeaveMillies = courseDateAndHourMillis - travelTimeMillis;

        //4. vezi ca momentul in care pers sa plece de acsaa e in viitor, nu in trecut
        if (timeToLeaveMillies < Date.now()) {
            setTimeToLeave("The selected day is in the past");
        } else {

            let timeToLEaveDateObject = new Date(timeToLeaveMillies - 3 * 3600000);   // ca sa fie in time zone Ro
            console.log("timeToLEaveDateObject");
            console.log(timeToLEaveDateObject);
            let timeToLeaveString = "You should leave on: " + days[timeToLEaveDateObject.getDay()] +
                " (" + checkDate(timeToLEaveDateObject.getDate()) + "-" + checkDate(timeToLEaveDateObject.getMonth() + 1) + "-" + timeToLEaveDateObject.getFullYear() + ") " +
                " at " + checkDate(timeToLEaveDateObject.getHours()) + ":" + checkDate(timeToLEaveDateObject.getMinutes());
            setTimeToLeave(timeToLeaveString);
            console.log(timeToLeave);
        }

        //**6. afiseacza la user rezultatul si vezi cum faci sa isi poata seta alarma

    }

    async function getDirections(startLoc, desLoc, wayOfTransport) {
        setFirst(false);
        try {
            const resp = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?destination=${desLoc}&mode=${wayOfTransport}&key=${GOOGLE_API_KEY}
                            &origin=${startLoc.latitude},${startLoc.longitude}`);

            const points = Polyline.decode(resp.data.routes[0].overview_polyline.points);
            const coords = points.map(point => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            });
            setDestPolylineCoords(coords);

            const latFinalDestCoords = resp.data.routes[0].legs[0].end_location.lat;
            const longFinalDestCoords = resp.data.routes[0].legs[0].end_location.lng;
            setDestCoords({latitude: latFinalDestCoords, longitude: longFinalDestCoords});

            const durationVar = resp.data.routes[0].legs[0].duration.text;
            setDuration(durationVar);

            //aici calculez si cand plec de acasa si vezi sa fie in functie de miljoc transport  vezi la inceput sa fie in f de walk
            calculateTimeToLeave(courseDateStartTimeStamp, hourStart, durationVar);
            setRender(true);

        } catch (e) {
            console.log('Error', e)
        }
    }

    useEffect(() => {

        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setStartSearch(true);
            }
        );

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
                    getDirections(
                        {latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude,},
                        destination,
                        wayOfTransport
                    );
                }
            }
        })();


        return () => {
            keyboardDidShowListener.remove();
        };


    }, []);


    useEffect(() => {
        if (!first) {
            getDirections(
                {latitude: location.latitude, longitude: location.longitude,},
                destination,
                wayOfTransport
            );
        }
    }, [wayOfTransport]);


    return (
        <View style={styles.container}>
            <View style={commonStyle.statusBar}/>
            {
                permissionResponse ?
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <ActivityIndicator size="large" color="#0000ff"/>
                        <Text>We need your permission! :) </Text>
                    </View>

                    :

                    <TouchableWithoutFeedback onPress={() => {
                        Keyboard.dismiss, console.log("startSearch: " + startSearch), setStartSearch(false)
                    }} accessible={false}>
                        <View
                            style={styles.containerMaps}>
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

                                <MapView.Polyline strokeWidth={2} strokeColor="red" coordinates={destPolylineCoords}
                                />
                                <Marker coordinate={{latitude: destCoords.latitude, longitude: destCoords.longitude}}/>

                            </MapView>


                            <View style={{
                                width: "85%", paddingTop: 10, marginBottom: 10, position: 'absolute',//use absolute position to show button on top of the map
                                flex: 1,
                            }}>

                                <GoogleSearch sendStartSearch={setStartSearch}/>

                            </View>


                            {startSearch ?
                                <View></View>
                                :
                                <View
                                    style={{
                                        width: "100%", paddingTop: 10, position: 'absolute',//use absolute position to show button on top of the map
                                        flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginTop: 50
                                    }}
                                >

                                    <TouchableOpacity
                                        style={onFocusPickAssig === 1 ? styles.iconAreaFocus : styles.iconAreaBlur}
                                        onPress={() => {
                                            setWayOfTransport(walk);
                                            setOnFocusPickAssig(1)
                                        }}>
                                        <FontAwesome5 style={{paddingLeft: 5, paddingBottom: 7, margin: 7}}
                                                      name="walking"
                                                      size={25} color={colors.white}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={onFocusPickAssig === 2 ? styles.iconAreaFocus : styles.iconAreaBlur}
                                        onPress={() => {
                                            setWayOfTransport(bus);
                                            setOnFocusPickAssig(2)
                                        }}>
                                        <FontAwesome5 style={{paddingBottom: 7, margin: 7}} name="bus" size={25}
                                                      color={colors.white}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={onFocusPickAssig === 3 ? styles.iconAreaFocus : styles.iconAreaBlur}
                                        onPress={() => {
                                            setOnFocusPickAssig(3);
                                            setWayOfTransport(car)
                                        }}>
                                        <FontAwesome5 style={{paddingBottom: 7, margin: 7}} name="car"
                                                      size={25}
                                                      color={colors.white}
                                        />
                                    </TouchableOpacity>
                                </View>
                            }

                            {
                                !render ?
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
                                            backgroundColor: 'rgba(214, 162, 232, .6)',
                                            alignSelf: "flex-end",
                                            borderRadius: 20,
                                            padding: 10,
                                        }}
                                    >
                                        <ActivityIndicator size="large" color="#0000ff"/>
                                    </View>
                                    :

                                    (
                                        startSearch ?
                                            <View></View>
                                            :
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
                                                <Text style={commonStyle.labelText}>Course starts at: {hourStart},
                                                    on {courseStartDate} </Text>
                                                <Text style={commonStyle.labelText}>{timeToLeave} </Text>
                                                <Text style={commonStyle.labelText}>Time on road: {duration} </Text>

                                            </View>
                                    )

                            }

                        </View>
                    </TouchableWithoutFeedback>

            }
        </View>
    );
}

// <Marker coordinate={{latitude: destination.latitude, longitude: destination.longitude}}/>
//<Marker coordinate={location}/>

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
    iconAreaFocus: {
        backgroundColor: colors.loginScreenBackgroundColor,
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


/*
 <TextInput
                                placeholder="Enter starting location"
                                //autoCapitalize='none'
                                placeholderTextColor= 'rgb(255, 255, 255)'
                                style={[{} , onFocusStyleUsername === true ? commonStyle.inputNoFocusMaps : commonStyle.inputFocusMaps]}
                                onFocus={() => setOnFocusStyleUsername(!onFocusStyleUsername)}
                                onBlur={() => setOnFocusStyleUsername(!onFocusStyleUsername)}
                                onChangeText={text => console.log(text)}
                            />

 */