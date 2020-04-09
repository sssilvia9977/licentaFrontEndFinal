import * as React from "react";

import axios from 'axios';
import commonStyle from "../../assets/style"
import {
    Button,
    StyleSheet,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    TouchableWithoutFeedback,
    Animated
} from "react-native";
import {FontAwesome5} from '@expo/vector-icons';
import colors from "../../assets/colors";
import {useState} from "react";
import { Divider } from 'react-native-elements';
import {backgroundColor} from "@eva-design/eva/mapping";
import MyCourseDetailsTemplate from "./MyCourseDetailsTemplate";


export default function MyCoursesTemplate(props) {

    /*
    TODO: afiseasa lecture sau labsau semi numai daca userul are asta la materia lui si verifica daca la classRoom am observatii
     */
    const sessionFromBack = props.sessionFromBack;


    return (


        <TouchableOpacity
            onPress={()=>   props.navigation.navigate('MyCourseDetailsTemplate', { courseName:props.courseName , sessionFromBack : sessionFromBack})}
            style={styles.container}>
            <FontAwesome5 style={{paddingLeft: 2, paddingTop: 7, paddingRight: 5}}
                          name="book-open" size={20}
                          color={colors.backgroundCommonDark}/>

            <View>
                <Text style={commonStyle.actualText}>{props.courseAbreviere}</Text>
                <Text style={commonStyle.actualText}>{props.courseName}</Text>

            </View>
        </TouchableOpacity>


    );
}

const styles = StyleSheet.create({
    container: {

        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
        flexDirection: "row",
        paddingBottom: 30,
    },

});

