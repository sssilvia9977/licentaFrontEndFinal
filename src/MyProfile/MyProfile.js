import * as React from "react";
import {useEffect} from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from "react-native";
import colors from "../../assets/colors";
import commonStyle from "../../assets/style";
import { Avatar } from "react-native-elements";
import MyProfileForm from "./MyProfileForm";
import {useState} from "react";
import axios from "axios";


/*
TODO: la avatar, ia de undeva initialel alea
TODO: daca apesi pe imagine, poti schimba imaginea
 */

export default function ({navigation}) {

    const [render, setRender] = useState(false);
    const sessionFromBack = JSON.stringify(navigation.getParam('sessionFromBack', '0'));
    const [username, setUsername] = useState("");
   // console.log("Session from my profile: " + sessionFromBack);

     useEffect(() =>{
        axios.post("http://192.168.43.239:8080/getUsername", {sessionId: sessionFromBack}).then(response => {
            setUsername(response.data.username);
            setRender(true);
        });
     });


    return(
        <View style={styles.container}>
            <View style={commonStyle.statusBar}/>
            <View style={commonStyle.navigationBar}>
                <Text onPress={()=>navigation.openDrawer()}>Menu</Text>
            </View>

            <View style={styles.avatarView}>
                <Avatar
                    size="large"
                    rounded
                    title={username.charAt(0)}
                    onPress={() => console.log("Works!")}
                    activeOpacity={0.7}
                />

                <Text style={styles.userNameText}>{username}</Text>
            </View>

            {render && <MyProfileForm sessionFromBack={sessionFromBack} navigation={navigation}/> || !render &&  <ActivityIndicator size="large" color="#0000ff" />}


        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroudCommon,
        justifyContent: 'flex-start',
    },
    avatarView: {
        flex: 0.25,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 15,
    },
    userNameText: {
        color: colors.backgroundCommonDark,
        fontWeight: 'bold',
        fontSize: 21,
        paddingTop: 7,
        fontFamily: "serif"
    }


});