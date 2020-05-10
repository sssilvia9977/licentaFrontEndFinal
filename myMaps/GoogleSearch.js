import React from 'react';
import { Image, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import colors from "../assets/colors";
import {useState} from "react";



export default function GoogleSearch({sendDataLeavingLocation, sendDetailsLeavingLocation, sendPressEnterData}) {

    function enterPress(text){
       // console.log(text.nativeEvent.text);
        sendPressEnterData(text.nativeEvent.text);

    }

    return (
        <GooglePlacesAutocomplete
            onSubmitEditing={(text) => enterPress(text)}
            showsCancelButtonWhileEditing={true}
            placeholder='Search'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
            listViewDisplayed='true'    // true/false/undefined  //auto
            fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            /*    console.log(data);
                console.log("*********************************");
                console.log(details);
                console.log("*********************************");*/
              sendDataLeavingLocation(data);
              sendDetailsLeavingLocation(details)
            }}

            query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: "AIzaSyCqf1Djekazim8MTvftAXHifffsQ4Q_VYY",
                language: 'ro', // language of the results
                types: ['geocode', 'address'] // default: 'geocode'
            }}

            styles={{
                container:{
                    flex:1,
                    justifyContent:'center',
                },
                textInputContainer: {
                    height: 45,
                   // width: '85%',
                    backgroundColor: 'rgb(214, 162, 232)',
                    marginBottom: 20,
                    color: colors.white,
                    paddingHorizontal: 10,
                    borderRadius: 20,
                    borderBottomWidth: 2,
                    borderBottomColor: '#FAC748',
                    fontWeight: 'bold',
                    marginLeft: 40,
                    marginRight: 40
                },
                description: {
                    fontWeight: 'bold'
                },
                textInput: {
                  //  textColor:colors.white,
                    marginLeft: 0,
                    marginRight: 0,
                    backgroundColor: 'rgb(214, 162, 232)',
                   // height: 38,
                  //  color: 'rgb(255, 255, 255)',
                    fontSize: 16
                },
                predefinedPlacesDescription: {
                    color: '#1faadb'
                },
                listView:{
                    marginLeft:20,
                    marginRight: 20,
                    backgroundColor: 'rgb(214, 162, 232)',
                },
                poweredContainer:{
                    backgroundColor: 'rgba(214, 162, 232, 0.6)',
                }
            }}

            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }}
            GooglePlacesSearchQuery={{
                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                rankby: 'distance',
                type: 'cafe'
            }}
            GooglePlacesDetailsQuery={{
                // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                fields: 'formatted_address',
            }}
            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
            getDefaultValue={() => ""  }
            //returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            //   currentLocation={true}
        />
    );
}