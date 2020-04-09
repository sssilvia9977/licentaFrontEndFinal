import * as React from "react";

import {Text, View, Image, StyleSheet, Dimensions, Keyboard, TouchableWithoutFeedback} from "react-native";
import {Components} from 'react';
import { Button, ThemeProvider } from 'react-native-elements';
import LoginScreenForm from './LoginScreenForm'
import colors from "../assets/colors";
import {KeyboardAvoidingView} from 'react-native';
import {useState} from "react";
import axios from "axios";



const LoginScreen = ({navigation}) => {



    return (

        <TouchableWithoutFeedback onPress = {Keyboard.dismiss} accessible = {false}>
        <KeyboardAvoidingView  behavior="height" enabled style={styles.container}>
            <View style={styles.logInContainer}>

                <Text
                    onPress={()=>navigation.openDrawer()}
                    style={styles.title}>Welcome to StudLife</Text>

                <Button
                    title="Go to Maps"
                    onPress={() => navigation.navigate('AccessMap')
                    }
                />

                <LoginScreenForm navigation={navigation}/>

            </View>
        </KeyboardAvoidingView >
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.loginScreenBackgroundColor,
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




