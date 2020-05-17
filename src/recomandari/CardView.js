import * as React from "react";
import {
    Button,
    StyleSheet,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    ImageBackground, TouchableWithoutFeedback
} from "react-native";
import colors from "../../assets/colors";
import commonStyle from "../../assets/style";
import {FontAwesome5} from '@expo/vector-icons';
import {useState} from "react";
import axios from "axios";
import {useEffect} from "react";
import {Overlay} from "react-native-elements";

/*
TODO: OKK, this is OOOKK,
 */
export default function ({address, image, comment, placeName}) {
//tre sa pun in props si imaginea din maps luata cumva

    const [imageReference, setImageReference] = useState();
    const [showPlaceName, setShowPlaceName] = useState(placeName);

    const GOOGLE_API = 'AIzaSyCqf1Djekazim8MTvftAXHifffsQ4Q_VYY';


    const [render, setRender] = useState(false);


    async function getCardGoogleDetails() {
        const resp = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${address}&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=${GOOGLE_API}`);
        if(resp.data.candidates[0].photos !== undefined){
            let photoRef = resp.data.candidates[0].photos[0].photo_reference;
            setImageReference(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${GOOGLE_API}`);
        }else {
            setImageReference('https://anthropocenemagazine.org/wp-content/uploads/2020/04/Panda-2.jpg')
        }

        setRender(true);
    }

    useEffect(()=>{
        getCardGoogleDetails();
        let x = "";
        if(placeName.length > 20){
            x = placeName.substr(0, 19) + "...";
            setShowPlaceName(x);
        }

    }, []);


    if(!render){
        <ActivityIndicator/>
    }

    return (


        <View style={styles.cardView}>
            <ImageBackground
                source={{uri: imageReference}}
                imageStyle={{borderRadius: 20}}
                style={{width: "100%", height: "100%", resizeMode: "cover", flexDirection: "column-reverse"}}>
                <View style={styles.viewOnImage}>
                    <Text style={[commonStyle.actualText, { marginLeft: 10, marginTop:5}]}>{showPlaceName}</Text>
                </View>
            </ImageBackground>
        </View>


    );


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 600,
    },
    viewOnImage: {
        backgroundColor: "rgba(255,255,255,0.8)",
        width: "100%",
        height: "20%",
        borderRadius: 20,
    },
    cardView: {
        width: 250,
        height: 200,
        borderWidth: 2,
        borderColor: colors.myPink,
        borderRadius: 20,
        marginTop: 10,
        marginRight: 10,
        marginLeft: 10,
    },

});