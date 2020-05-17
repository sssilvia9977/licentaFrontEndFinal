import * as React from "react";
import {Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback} from 'react-native';
import {Text, TextInput, View, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import {Button, ThemeProvider} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Input} from 'react-native-elements';
import colors from "../assets/colors";
import commonStyle from "../assets/style"
import {useState} from "react";
import axios from "axios";
import CustomMarker from "../components/CustomMarker";


let bottomSectionImage = require("../assets/BottomSection.png");
let topSectionImage= require("../assets/TopSectionCrop.png");
let loginButton = require("../assets/LoginIcon.png");
let signupButton  = require("../assets/SignUpIcon.png");
let passwordIcon = require("../assets/Password.png");
let usernameIcon = require("../assets/Username.png");


/*
TODO: This is ooollldd
 */

export default function ({navigation}) {

    let sessionFromBack = 0;
    const [username, setUsername] = useState("Silvia");
    const [password, setPassword] = useState("a");

    const [onFocusStyleUsername, setOnFocusStyleUsername] = useState(true);
    const [onFocusStylePassword, setOnFocusStylePassword] = useState(true);

    const [simulare, setSimulare] = useState(true);

     function callLogin(navigation){
        axios.post("http://192.168.43.239:8080/", {username: username, password: password}).then(response => {
                sessionFromBack = response.data.sessionId;
                console.log("session:", sessionFromBack);
                if (sessionFromBack !== 0 ) {
                    navigation.navigate('MyProfile', {sessionFromBack: sessionFromBack});
                    setSimulare(false);
                }
                else{
                    alert("nu")
                }

        });
       /* if(setSimulare){
            navigation.navigate('MyProfile', {sessionFromBack: sessionFromBack});
        }*/
     }


    function callSignUp(navigation){
         navigation.navigate('SignUp');
    }



    return (


        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>





                <TextInput
                    placeholder="Username"
                    autoCapitalize='none'
                    placeholderTextColor='rgba(255, 255, 255, 0.7)'
                    style={onFocusStyleUsername === true ? commonStyle.inputNoFocus : commonStyle.inputFocus}
                    onFocus={() => setOnFocusStyleUsername(!onFocusStyleUsername)}
                    onBlur={() => setOnFocusStyleUsername(!onFocusStyleUsername)}
                    onChangeText={text => setUsername(text)}
                    value={username}
                />
                <TextInput
                    secureTextEntry={true}
                    placeholderTextColor='rgba(255, 255, 255, 0.7)'
                    placeholder="Password"
                    autoCapitalize='none'
                    style={onFocusStylePassword === true ? commonStyle.inputNoFocus : commonStyle.inputFocus}
                    onFocus={() => setOnFocusStylePassword(!onFocusStylePassword)}
                    onBlur={() => setOnFocusStylePassword(!onFocusStylePassword)}
                    onChangeText={text => setPassword(text)}
                    value={password}
                />

                <TouchableOpacity
                    style={commonStyle.commonButton}
                    onPress={() => callLogin(navigation)}>
                    <Text style={commonStyle.textButtonCommon}>Log in</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={commonStyle.commonButton}
                    onPress={() => callSignUp(navigation)}>
                    <Text style={commonStyle.textButtonCommon}>Sign up</Text>
                </TouchableOpacity>





            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

    );


}

const styles = StyleSheet.create({
    topPart:{
        flex: 0.3,
    },
    middlePart:{
        flex:0.5,
    },
    bottomPart:{
        flex:0.2,
    },
    container: {
        flex:1,
        padding: 20,

    },
    buttonContainer: {},
    buttonText: {
        textAlign: 'center',
        color: colors.loginScreenTextColor,
    },

});
