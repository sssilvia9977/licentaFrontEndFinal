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
import MyCourseDetailsTemplate from "../../old/MyCourseDetailsTemplate";
import {width} from "react-native-scl-alert/src/helpers/dimensions";

/*
  TODO: OK, this is OOKK!!!
   */
export default function MyCoursesTemplate(props) {


    const sessionFromBack = props.sessionFromBack;


    return (


        <TouchableOpacity
            onPress={()=>   props.navigation.navigate('MyCourseDetailsTemplate', { courseName:props.courseName , sessionFromBack : sessionFromBack})}

            style={styles.container}>
            <FontAwesome5 style={{paddingLeft: 2, paddingTop: 3, paddingRight: 5}}
                          name="book-open" size={20}
                          color={colors.myPink}/>

            <View>
                <Text style={[commonStyle.actualText, {fontWeight:"bold"}]}>{props.courseAbreviere}</Text>
                <Text style={[commonStyle.actualText]}>{props.courseName}</Text>

            </View>
        </TouchableOpacity>


    );
}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        flexDirection: 'row',
        margin: 10,
        padding: 10,
        borderRadius: 20,
        borderWidth:1,
        borderColor: 'rgba(125, 125, 125, 0.6)',
        shadowColor:"#000",
        shadowOffset:{
            width: 0, height: 6
        },
        shadowRadius: 7.49,
        shadowOpacity: 0.37,
        elevation: -4


    },

});
