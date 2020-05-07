import * as React from "react";

import axios from 'axios';
import commonStyle from "../../assets/style"
import {Button, StyleSheet, ScrollView, Text, View, TouchableOpacity, Dimensions, StatusBar} from "react-native";
import {FontAwesome5} from '@expo/vector-icons';
import colors from "../../assets/colors";
import {useState} from "react";

export default function TaskSchedule(props) {

    return (
        <View style={styles.container}>

            <TouchableOpacity
                style={styles.container}
                onPress={() => props.navigation.navigate('MyCourseDetailsTemplate', {
                    courseName: props.courseName,
                    sessionFromBack: props.sessionFromBack
                })}>

                <View style={{width: "13%"}}>
                    <FontAwesome5 style={{paddingTop: 4}} name="book-open" size={20}
                                  color={colors.backgroundCommonDark}/>
                    <Text style={commonStyle.labelText}>{props.courseType}</Text>
                </View>

                <View>
                    <Text style={commonStyle.actualText}>{props.courseAbreviere}</Text>
                    <Text style={commonStyle.actualSmallText}>{props.hourStart} - {props.hourEnd}</Text>
                    <Text style={commonStyle.actualSmallText}>{props.classRoom}</Text>
                    <Text style={commonStyle.actualSmallText}>{props.address}</Text>
                </View>
            </TouchableOpacity>

            <View style={{alignSelf: "flex-end"}}>
                <FontAwesome5 style={{paddingRight: 10, paddingBottom: 7}} name="route"
                              size={25}
                              color={colors.backgroundCommonDark}
                              onPress={() => props.navigation.navigate("GoToCourse", {
                                  address: props.address,
                                  sessionFromBack: props.sessionFromBack,
                                  hourStart: props.hourStart,
                                  classRoom: props.classRoom,
                                  timestamp: props.timestamp
                              })}/>
            </View>



        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
        flexDirection: "row",

    }
});







