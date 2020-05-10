import * as React from "react";
import {Button, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator} from "react-native";
import colors from "../../assets/colors";
import commonStyle from "../../assets/style";
import {FontAwesome5} from '@expo/vector-icons';
import MyProfileLableText from "./MyProfileLabelText";
import {useState} from "react";
import * as Permissions from "expo-permissions";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import {useEffect} from "react";


/*
TODO: cred ca acea componeneta o pot tot pasa cu alte propsuri care sa imi tina label name si value
 */

export default function ({sessionFromBack, navigation}) {

    const [render, setRender] = useState(false);

    const [email, setEmail] = useState("");
    const [faculty, setFaculty] = useState("");
    const [university, setUniversity] = useState("");

   useEffect(() =>{
        axios.post("http://192.168.43.239:8080/getUsername", {sessionId: sessionFromBack}).then(response => {
            setEmail(response.data.email);
            setFaculty(response.data.facultyName);
            setUniversity(response.data.universityName);
            setRender(true);
        });
    }, []);



    const [permissionResponse, setPermissionResponse] = useState("");
    async function accessFilesPermission() {
        const {status} = await Permissions.getAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            setPermissionResponse(await Permissions.askAsync(Permissions.CAMERA_ROLL))
        } else {
            try {
                const result = await DocumentPicker.getDocumentAsync({type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                sendDocument(result);
            } catch (e) {
                alert("Unknown error");
                throw e;
            }

        }
    }

    function sendDocument(result){
        const formData = new FormData();
        formData.append("file", {
            uri: result.uri,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            name: 'myFile'
        });

        axios.post("http://192.168.43.239:8080/sendSessionID", {sessionId: sessionFromBack}).then(response =>{});

        axios({
            url: 'http://192.168.43.239:8080/importExcel',
            method: "POST",
            data: formData,
        }).then((res)=>{
            console.log(result.name);
        });

    }

    if(!render)
        return <ActivityIndicator size="large" color="#0000ff" />
    return(
      <View style={styles.container}>

         <MyProfileLableText label = "Email" value = {email} />
         <MyProfileLableText label = "Change password" value = "" />
         <MyProfileLableText label = "Faculty" value = {faculty} />
         <MyProfileLableText label = "University" value = {university} />

          <Button title="Schedule" onPress={()=> {navigation.navigate("Schedule", {sessionFromBack:sessionFromBack});}}/>
          <Button title="Recommendations" onPress={()=> {navigation.navigate("Recommendations", {sessionFromBack:sessionFromBack});}}/>

          <TouchableOpacity>
              <Text
                  onPress={() => navigation.navigate('MyCourses', {sessionFromBack: sessionFromBack})}
                  style={styles.eticheta}>My Courses</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={commonStyle.commonButton}
              onPress={()=> accessFilesPermission()}
          >
              <Text style={commonStyle.textButtonCommon}>Upload schedule file (excel.xlsx)</Text>
          </TouchableOpacity>

      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.backgroudCommon,
        justifyContent: 'flex-start',
        padding: 10,
    },
    eticheta: {
        color: colors.backgroundCommonDark,
        fontWeight: 'bold',
        fontSize: 19,
        paddingBottom: 40,
    },




});