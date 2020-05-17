import * as React from "react";
import {Button, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView, Linking} from "react-native";
import colors from "../../assets/colors";
import commonStyle from "../../assets/style";
import {FontAwesome5} from '@expo/vector-icons';
import MyProfileLableText from "./MyProfileLabelText";
import {useState} from "react";
import * as Permissions from "expo-permissions";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import {useEffect} from "react";
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert'


/*
TODO: OK,  this is OK!!!!!
 */

let website = "https://docs.google.com/spreadsheets/d/1DJA__upxq7oQChY82zpPzoUcAA1f6cSnBdGbhoEADpE/edit?usp=sharing";
export default function ({sessionFromBack, navigation}) {

    const [render, setRender] = useState(false);

    const [alertShow, setAlertShow] = useState(false);
    const [email, setEmail] = useState("");
    const [faculty, setFaculty] = useState("");
    const [university, setUniversity] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");


    useEffect(() => {
        axios.post("http://192.168.43.239:8080/getUsername", {sessionId: sessionFromBack}).then(response => {
            setEmail(response.data.email);
            setLname(response.data.lastName);
            setFname(response.data.firstName);
            setFaculty(response.data.facultyName);
            setUniversity(response.data.universityName);
            setRender(true);
        });
    }, []);


    function redirectXcel(){
        Linking.openURL(website);
    }

    const [permissionResponse, setPermissionResponse] = useState("");

    async function accessFilesPermission() {
        const {status} = await Permissions.getAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            setPermissionResponse(await Permissions.askAsync(Permissions.CAMERA_ROLL))
        } else {
            try {
                const result = await DocumentPicker.getDocumentAsync({type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                sendDocument(result);
            } catch (e) {
                alert("Unknown error");
                throw e;
            }

        }
    }

    function sendDocument(result) {
        const formData = new FormData();
        formData.append("file", {
            uri: result.uri,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            name: 'myFile'
        });

        axios.post("http://192.168.43.239:8080/sendSessionID", {sessionId: sessionFromBack}).then(response => {
        });

        axios({
            url: 'http://192.168.43.239:8080/importExcel',
            method: "POST",
            data: formData,
        }).then((res) => {
            console.log(result.name);
            setAlertShow(true);
        });

    }



    if (!render)
        return <ActivityIndicator size="large" color="#0000ff"/>
    return (
        <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{ justifyContent: 'flex-start',}} style={styles.container}>

            <MyProfileLableText sessionFromBack={sessionFromBack} label="First Name" value={fname}/>
            <MyProfileLableText sessionFromBack={sessionFromBack} label="Last Name" value={lname}/>
            <MyProfileLableText sessionFromBack={sessionFromBack} label="Email" value={email}/>
            <MyProfileLableText sessionFromBack={sessionFromBack} label="Change password" value=""/>
            <MyProfileLableText sessionFromBack={sessionFromBack} label="University" value={university}/>
            <MyProfileLableText sessionFromBack={sessionFromBack} label="Faculty" value={faculty}/>

            <TouchableOpacity
                style={commonStyle.commonButton}
                onPress={() => {navigation.navigate("MyAddedRecommendations", {sessionFromBack: sessionFromBack});}}
            >
                <Text style={commonStyle.textButtonCommon}>My added recommendations</Text>
            </TouchableOpacity>


            <TouchableOpacity
                style={commonStyle.commonButton}
                onPress={() => accessFilesPermission()}
            >
                <Text style={commonStyle.textButtonCommon}>Upload schedule file (excel.xlsx)</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={commonStyle.commonButton}
                onPress={() => redirectXcel()}
            >
                <Text style={commonStyle.textButtonCommon}>Go to schedule file format</Text>
            </TouchableOpacity>


            <SCLAlert
                theme="success"
                show={alertShow}
                title="Done"
                subtitle="Your schedule has been uploaded!"
                onRequestClose={() => setAlertShow(false)}>
                <SCLAlertButton theme="success" onPress={()=> setAlertShow(false)}>OK</SCLAlertButton>
            </SCLAlert>
            
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 10,
    },
    eticheta: {
        color: colors.backgroundCommonDark,
        fontWeight: 'bold',
        fontSize: 19,
        paddingBottom: 40,
    },


});