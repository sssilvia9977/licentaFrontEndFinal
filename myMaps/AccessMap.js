import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Image, ActivityIndicator} from 'react-native';
import * as Permissions from "expo-permissions";
import Polyline from '@mapbox/polyline'
import {Marker} from "react-native-maps";

const { width, height }  = Dimensions.get('screen');

const locations = require('./locations');/*JSON.parse('[{\n' +
    '    "name": "UTCN Dorobantilor",\n' +
    '    "address": "Calea Dorobanților 71-73, Cluj-Napoca 400000",\n' +
    '    "coords": {\n' +
    '      "latitude": 46.774141,\n' +
    '      "longitude": 23.607799\n' +
    '    },\n' +
    '    "image_url": "http://dreamercosmetic.com/uploads/source/chekd101/trangdiem/bomyphamchanel5moncaocap11600x450.jpg"\n' +
    '  }]');*/


export default class AccessMap extends React.Component {

    state = {
        latitude: 0,
        longitude: 0,
        locations: locations,
        destination: locations[0],
        coords: []
    }

    async componentDidMount() {
        const {status} = await Permissions.getAsync(Permissions.LOCATION);

        if (status != 'granted') {
            const response = await Permissions.askAsync(Permissions.LOCATION)
        }
        navigator.geolocation.getCurrentPosition(
            ({coords: {latitude, longitude}}) => this.setState({
                latitude,
                longitude
            }, this.mergeCoords),
            (error) => console.log('Error:', error)
        )

        const {locations: [sampleLocation] } = this.state;


        this.setState({
            desLatitude: sampleLocation.coords.latitude,
            desLongitude: sampleLocation.coords.longitude
        }, this.mergeCoords)


    }

    mergeCoords = () => {
        const {
            latitude,
            longitude,
            desLatitude,
            desLongitude
        } = this.state;

        const hasStartAndEnd = latitude !== null && desLatitude !== null
        if(hasStartAndEnd){
            const concatStart = `${latitude}, ${longitude}`
            const concatEnd = `${desLatitude}, ${desLongitude}`
            this.getDirections(concatStart, concatEnd)
        }
    };

   async getDirections(startLoc, desLoc) {

        try{
            const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${desLoc}&key=AIzaSyCqf1Djekazim8MTvftAXHifffsQ4Q_VYY`)
            const respJson = await resp.json();
            const points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            const coords = points.map( point => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            });
            this.setState({coords})
        } catch (e) {
            console.log('Error', e)
        }
   }

    onMarkerPress = location => () => {
        const { coords: { latitude, longitude } } = location
        console.log('location: ', location)
        this.state.destination = location
        this.setState({
            destination: location,
            desLatitude: latitude,
            desLongitude: longitude
        }, this.mergeCoords)
    }

    renderMarkers = () => {
        const { locations } = this.state
        return (
            <View>
                {
                    locations.map((location, idx) => {
                        const {
                            coords: { latitude, longitude }
                        } = location
                        return (
                            <Marker
                                key={idx}
                                coordinate={{ latitude, longitude }}
                                onPress={this.onMarkerPress(location)}
                            />
                        )
                    })
                }
            </View>
        )
    }

    render() {

        const {latitude, longitude, coords, destination} = this.state;
       // let destination = this.state.destination
        console.log('dest', destination.image_url)
        console.log('state', this.state)

        if (latitude) {
            return (
                <MapView
                    showsUserLocation
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude,
                        longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }}
                >

                    {this.renderMarkers()}
                    <MapView.Polyline
                        strokeWidth={2}
                        strokeColor="red"
                        coordinates={coords}
                    />

                </MapView>
            );
        }
        return (
            <View style={styles.container}>
                    <ActivityIndicator size="large" color="#0000ff" />
                <Text>We need your permission! :) </Text>
            </View>
        )



    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
