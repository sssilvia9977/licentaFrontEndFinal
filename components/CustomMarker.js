
import React from "react";
import {Text, ImageBackground} from "react-native";

let mapPin = require('../assets/mapPin.png');
export default  function ({number}) {


    return(

        <ImageBackground style={{width:30, height: 40, alignItems: 'center'}} source={mapPin}>
            <Text style={{marginTop: 4, fontWeight:'bold', fontSize: 16}}>{number}</Text>
        </ImageBackground>

    );

}