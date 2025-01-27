import * as React from "react";

import {Text, View, Image, StyleSheet, Dimensions, Keyboard, TouchableWithoutFeedback} from "react-native";
import {Components} from 'react';
import { Button, ThemeProvider } from 'react-native-elements';
import LoginScreenForm from './LoginScreenForm'
import colors from "../assets/colors";
import {KeyboardAvoidingView} from 'react-native';
import {useState} from "react";
import axios from "axios";


/*
TODO: This is ooollldd
 */
const LoginScreen = ({navigation}) => {



    return (

        <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
        <KeyboardAvoidingView  behavior="height" enabled style={styles.container}>
            <View style={styles.logInContainer}>

                <LoginScreenForm navigation={navigation}/>

            </View>
        </KeyboardAvoidingView >
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logInContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1
    },
    title: {
        color: colors.loginScreenTextColor,
    }

});


export default LoginScreen;




