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
                style={styles.containerTouch}
                onPress={() => props.navigation.navigate('MyCourseDetailsTemplate', {
                    courseName: props.courseName,
                    sessionFromBack: props.sessionFromBack
                })}>

                <View style={{width: "13%"}}>
                    <FontAwesome5 style={{paddingTop: 4}} name="book-open" size={20}
                                  color={colors.myPink}/>
                    <Text style={[commonStyle.labelText, {color:colors.myPink}]}>{props.courseType}</Text>
                </View>

                <View>
                    <Text style={commonStyle.actualText}>{props.courseAbreviere}</Text>
                    <Text style={commonStyle.actualSmallText}>{props.hourStart} - {props.hourEnd}</Text>
                    <Text style={commonStyle.actualSmallText}>{props.classRoom}</Text>
                    <Text style={commonStyle.actualSmallText}>{props.address}</Text>
                </View>
            </TouchableOpacity>

            {
                props.address === "" || props.address === null ?
                    <View/>
                    :
                    <View style={{alignSelf: "flex-end"}}>
                        <FontAwesome5 style={{paddingRight: 10, paddingBottom: 7}} name="route"
                                      size={25}
                                      color={colors.myPink}
                                      onPress={() => props.navigation.navigate("GoToCourse", {
                                          address: props.address,
                                          sessionFromBack: props.sessionFromBack,
                                          hourStart: props.hourStart,
                                          classRoom: props.classRoom,
                                          timestamp: props.timestamp
                                      })}/>
                    </View>
            }

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 20,
        flex: 1,
        flexDirection: "row",

        borderRadius: 20,
        borderWidth:1,
        borderColor: 'rgba(125, 125, 125, 0.6)',
    },
    containerTouch: {
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
        flexDirection: "row",
    },
});







