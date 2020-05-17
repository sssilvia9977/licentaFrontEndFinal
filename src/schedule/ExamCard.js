import * as React from "react";

import axios from 'axios';
import commonStyle from "../../assets/style"
import {Button, StyleSheet, ScrollView, Text, View, TouchableOpacity, Dimensions, StatusBar} from "react-native";
import {FontAwesome5} from '@expo/vector-icons';
import colors from "../../assets/colors";
import {useState} from "react";

export default function (props) {

    return (
        <View style={styles.container}>
            <View style={styles.containerTouch}>

                <View style={{width: "13%"}}>
                    <FontAwesome5 style={{paddingTop: 4}} name="book-open" size={20}
                                  color={colors.myPink}/>
                </View>

                <View>
                    <Text style={commonStyle.actualText}>{props.courseAbreviere}</Text>
                    <Text style={commonStyle.actualSmallText}>{props.date}</Text>
                </View>

            </View>
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







