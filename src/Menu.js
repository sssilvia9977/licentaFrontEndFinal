import * as React from 'react'
import {Overlay} from "react-native-elements";
import {useState} from "react";
import colors from "../assets/colors";
import AddAssignment from "./schedule/AddAssignment";

import {StyleSheet, Text, View, ActivityIndicator, Button} from "react-native";

export default function ({navigation, disapear, session}) {


    return (

        <View>

            <Button title="My Profile" onPress={()=> {navigation.navigate("MyProfile", {sessionFromBack:session}); disapear(false); }}/>
            <Button title="Schedule" onPress={()=> {navigation.navigate("Schedule", {sessionFromBack:session}); disapear(false)}}/>
            <Button title="My courses" onPress={()=> {navigation.navigate("MyCourses", {sessionFromBack:session}); disapear(false)}}/>

        </View>


    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingRight: 10,
        paddingLeft: 13,
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    },
});
