import * as React from "react";
import {ImageBackground, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback} from 'react-native';
import {Text, TextInput, View, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity} from "react-native";
import colors from "../assets/colors";
import commonStyle from "../assets/style"
import {useState} from "react";
import axios from "axios";
import CustomMarker from "../components/CustomMarker";
import {useEffect} from "react";
import * as Font from 'expo-font';
import {BASE_URL, headers} from "../components/Auth";

let bottomSectionImage = require("../assets/BottomSection.png");
let topSectionImage = require("../assets/TopSectionCrop.png");
let loginButton = require("../assets/LoginIcon.png");
let signupButton = require("../assets/SignUpIcon.png");
let passwordIcon = require("../assets/Password.png");
let usernameIcon = require("../assets/Username.png");


export default function LoginDESIGN({navigation}) {

    let sessionFromBack = 0;

    const [username, setUsername] = useState("Silvia");
    const [password, setPassword] = useState("a");

    const [onFocusStyleUsername, setOnFocusStyleUsername] = useState(true);
    const [onFocusStylePassword, setOnFocusStylePassword] = useState(true);

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    function callLogin(navigation) {
        axios.post(BASE_URL+ "/", {username: username, password: password}, {
            headers: headers(username, password)
        }).then(response => {
            sessionFromBack = response.data.sessionId;
        //    console.log(response.data);
            console.log("session:", sessionFromBack);
            if (sessionFromBack !== 0) {
                navigation.navigate('MyProfile', {sessionFromBack: sessionFromBack});
            } else {
                alert("Username or password wrong.")
            }

        });
    }


    function callSignUp(navigation) {
        navigation.navigate('SignUp');
    }


    useEffect(() => {

        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);



    return (


        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled keyboardVerticalOffset={-1050}>

                <View style={styles.topPart}>
                    <ImageBackground source={topSectionImage}
                                     style={{width: Dimensions.get("screen").width, height: 250}}>
                        <Text style={styles.textTopPart}>Nume aplicatie</Text>
                    </ImageBackground>
                </View>


                <View style={[styles.middlePart, {flex: isKeyboardVisible ? 0.7 : 0.5}]}>
                    <ScrollView>
                        <Image source={usernameIcon} style={[styles.iconUserPass, {marginTop: isKeyboardVisible ? 40 : 20}]}/>
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

                        <Image source={passwordIcon} style={styles.iconUserPass}/>
                        <TextInput
                            secureTextEntry={true}
                            placeholderTextColor='rgba(255, 255, 255, 0.7)'
                            placeholder="Password"
                            autoCapitalize='none'
                            style={[onFocusStylePassword === true ? commonStyle.inputNoFocus : commonStyle.inputFocus]}
                            onFocus={() => setOnFocusStylePassword(!onFocusStylePassword)}
                            onBlur={() => setOnFocusStylePassword(!onFocusStylePassword)}
                            onChangeText={text => setPassword(text)}
                            value={password}
                        />
                    </ScrollView>
                </View>


                {
                    isKeyboardVisible ?
                        <View/>
                        :
                        <View style={styles.bottomPart}>
                            <ImageBackground source={bottomSectionImage}
                                             style={{width: Dimensions.get("screen").width, height: 150}}>
                                <View style={{
                                    position: "relative",
                                    top: -50,
                                    flexDirection: "row",
                                    justifyContent: "space-around"
                                }}>
                                    <TouchableOpacity
                                        // style={commonStyle.commonButton}
                                        onPress={() => callLogin(navigation)}>
                                        <Image source={loginButton} style={{width: 170, height: 170}}/>
                                    </TouchableOpacity>


                                    <TouchableOpacity
                                        //  style={commonStyle.commonButton}
                                        onPress={() => callSignUp(navigation)}>
                                        <Image source={signupButton} style={{width: 170, height: 170}}/>
                                    </TouchableOpacity>
                                </View>

                            </ImageBackground>
                        </View>
                }


            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

    );


}

const styles = StyleSheet.create({
    iconUserPass: {
        width: 159,
        height: 28,
        marginBottom: 10
    },
    topPart: {
        flex: 0.3,
        flexDirection: "column",
    },
    middlePart: {

        margin: 30,
    },
    bottomPart: {
        flex: 0.2,
        justifyContent: "flex-end"
    },
    container: {
        flex: 1,
    },
    buttonContainer: {},
    buttonText: {
        textAlign: 'center',
        color: colors.loginScreenTextColor,
    },
    textTopPart: {
        color: "white",
        fontSize: 35,
        fontFamily: "montserrat",
        position: "relative",
        bottom: -60,
        alignSelf: "center"
    },

});
