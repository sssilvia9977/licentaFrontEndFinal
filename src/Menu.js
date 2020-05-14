import * as React from 'react'
import {Overlay} from "react-native-elements";
import {useState} from "react";
import colors from "../assets/colors";
import AddAssignment from "./schedule/AddAssignment";
import {StyleSheet, Text, View, ActivityIndicator, Button, TouchableOpacity, ImageBackground, Image} from "react-native";

export default function ({navigation, disapear, session}) {
    let profile = require('../assets/myProfile.png');
    let schedule = require('../assets/schedule.png');
    let courses = require('../assets/courses.png');
    let recommendations = require('../assets/recom.png');
    let profileSelected  = require('../assets/myProfileSelected.png');
    let scheduleSelected = require('../assets/scheduleSelected.png');
    let coursesSelected = require('../assets/myCoursesSelected.png');
    let recommendationsSelected = require('../assets/recomSelected.png');



    return (

        <View style={styles.container}>

            <View style={styles.cateDoua}>
                <TouchableOpacity onPress={()=> {navigation.navigate("MyProfile", {sessionFromBack:session}); disapear(false); }}>
                    <Image style={[styles.image, {height:120 }]} source={profile}/>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={()=> {navigation.navigate("MyCourses", {sessionFromBack:session}); disapear(false)}}>
                    <Image style={[styles.image, {marginTop:23 }]} source={courses}/>
                </TouchableOpacity>
            </View>


            <View  style={styles.cateDoua2}>
                <TouchableOpacity
                    onPress={()=> {navigation.navigate("Schedule", {sessionFromBack:session}); disapear(false)}}>
                    <Image style={[styles.image, {height:120 }]} source={schedule}/>
                </TouchableOpacity>

                <TouchableOpacity   onPress={()=> {navigation.navigate("Recommendations", {sessionFromBack:session}); disapear(false)}}>
                    <Image style={[styles.image, {marginTop:23 }]}  source={recommendations}/>
                </TouchableOpacity>
            </View>

        </View>


    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent:"space-around",
        alignItems:"stretch"
    },
    cateDoua: {
        height: 120,
       flexDirection: "row",
        justifyContent:"space-between",
    },
    cateDoua2: {
        height: 120,
        flexDirection: "row",
        justifyContent:"space-between",
    },
    image:{
        marginTop: 15,
        width: 110,
        height: 110
    }
});
