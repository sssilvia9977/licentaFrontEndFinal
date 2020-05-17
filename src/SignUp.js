import * as React from "react";
import {Dimensions, Image, ImageBackground, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import commonStyle from "../assets/style";
import {FontAwesome5} from "@expo/vector-icons";
import {Overlay} from "react-native-elements";
import colors from "../assets/colors";
import Menu from "./Menu";
import SignUpComponent from "./schedule/SignUpComponent";
import {useState} from "react";
import {useEffect} from "react";
import axios from "axios";
import {SCLAlert, SCLAlertButton} from "react-native-scl-alert";


let topPart = require("../assets/TopPart.png");
let done = require("../assets/SignupDone.png");

export default function({navigation}){

    const [username, setUsername] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [uni, setUni] =  useState("");
    const [faculty, setFaculty] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [fnameError, setFnameError] = useState("");
    const [lnameError, setLnameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [uniError, setUniError] =  useState("");
    const [facultyError, setFacultyError] = useState("");


    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);


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


     async function addUser(){
         if(email < 3 && !email.includes("@")){
             setEmailError("Please provide a valid email");
         }
         if(username.length < 3){
             setUsernameError("Please provide a username with a minimum length of 4")
         }
         if(password.length < 5){
             setPasswordError("Please enter a password of minimum 6 characters");
         }else{
             const resp = await axios.post("http://192.168.43.239:8080/addUser", {username:username, password:password, email:email,
                 faculty:faculty, uni:uni, fname:fname, lname:lname});
             if(resp.data !== "ok"){
                 setUsernameError(resp.data);
             }else{
                 setOpenConfirmation(true);
             }

         }
     }



    return(


            <View style={{flex:1}}>
                <View style={commonStyle.statusBar}/>
                <View style={styles.topPart}>
                    <ImageBackground source={topPart} style={styles.topPartBackground}>
                        <Text style={styles.textTopPart}>Sign up</Text>
                    </ImageBackground>
                </View>

                <SCLAlert
                    theme="success"
                    show={openConfirmation}
                    title="Done"
                    subtitle="Your account has been created!"
                    onRequestClose={() => setOpenConfirmation(false)}>
                    <SCLAlertButton theme="success" onPress={()=> {setOpenConfirmation(false); navigation.navigate("LoginDESIGN");}}>Great!</SCLAlertButton>
                </SCLAlert>

                <View style={[styles.bottomPart, { marginTop: isKeyboardVisible ? 110 : -20}]}>
                    <ScrollView contentContainerStyle={{margin:20}} keyboardShouldPersistTaps='handled'>

                        <SignUpComponent label="Username" send={setUsername} error={usernameError}/>
                        <SignUpComponent label="First Name" send={setFname} error={fnameError}/>
                        <SignUpComponent label="Last Name" send={setLname} error={lnameError}/>
                        <SignUpComponent label="Email" send={setEmail} error={emailError}/>
                        <SignUpComponent label="Password" send={setPassword} error={passwordError}/>
                        <SignUpComponent label="University" send={setUni} error={uniError}/>
                        <SignUpComponent label="Faculty" send={setFaculty} error={facultyError}/>

                        <TouchableOpacity onPress={()=>addUser()}
                        >
                                <Image style={{marginBottom:20, alignSelf:"center", width:90, height:90}} source={done}/>
                        </TouchableOpacity>

                    </ScrollView>
                </View>








            </View>
    );
}


const styles = StyleSheet.create({
    bottomPart:{
        flex: 0.65,
    },
    topPart: {
        flex: 0.35,
        justifyContent: "flex-start",
    },
    topPartBackground: {
        width: Dimensions.get("screen").width,
        height: 200,
        alignItems: "center",
        justifyContent: "center",
    },
    textTopPart: {
        marginTop: 55,
        color: "white",
        fontSize: 30,
        textAlign:"center",
        fontFamily: "montserrat",
        position:"relative",
        bottom: 30,
    },
})