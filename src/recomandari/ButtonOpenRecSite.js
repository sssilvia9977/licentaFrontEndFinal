import {KeyboardAvoidingView, Linking, Text, TouchableOpacity, View, StyleSheet} from "react-native";
import commonStyle from "../../assets/style";
import * as React from "react";
import {useEffect} from "react";
import {useState} from "react";
import axios from "axios";


export default function ({placeId}) {
//sa nu uit sa pun place id in google api req din componenta unde pun acest buton

    const GOOGLE_API_KEY = 'AIzaSyCqf1Djekazim8MTvftAXHifffsQ4Q_VYY';

    const [website, setWebsite] = useState("");
    const [showButton, setShowButton] = useState(false);
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=website&key=${GOOGLE_API_KEY}`;

    useEffect(() => {

        (async () => {
         //   console.log(placeId)
            const resp = await axios.get(url);
            if (resp.data.result !== undefined && resp.data.result.website !==undefined) {
              //  console.log(resp.data);
                setWebsite(resp.data.result.website);
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        })();

    }, [placeId]);


    function openBrowser() {
        Linking.openURL(website);
    }


    return (

        <View>
            {
                showButton ?
                    <TouchableOpacity
                        style={[commonStyle.commonButton, styles.buttonContainer]}
                        onPress={() => openBrowser()}>
                        <Text style={commonStyle.textButtonCommon}>See website</Text>
                    </TouchableOpacity> : <View/>
            }
        </View>

    )
}


const styles = StyleSheet.create({
    buttonContainer: {
        position: "absolute",
        bottom: 0,
    }
});