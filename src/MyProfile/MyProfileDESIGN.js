import {ActivityIndicator, Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import commonStyle from "../../assets/style";
import {FontAwesome5} from "@expo/vector-icons";
import {Avatar, Input, Overlay} from "react-native-elements";
import colors from "../../assets/colors";
import Menu from "../Menu";
import * as React from "react";
import {useState} from "react";
import {useEffect} from "react";
import axios from "axios";
import MyProfileForm from "./MyProfileForm";


let topPart = require("../../assets/TopPart.png");

export default function ({navigation}) {

    const [render, setRender] = useState(false);
    const sessionFromBack = navigation.getParam('sessionFromBack', '0');
    const [username, setUsername] = useState("");
    // console.log("Session from my profile: " + sessionFromBack);

    const [openMenu, setOpenMenu] = useState(false);
    const [openChangeUsername, setOpenChangeUsername] = useState(false);
    const [textInput, setTextInput] = useState("");
    const [errormessage, setErrorMessage] = useState("");

    useEffect(() => {
        axios.post("http://192.168.43.239:8080/getUsername", {sessionId: sessionFromBack}).then(response => {
            setUsername(response.data.username);
            setRender(true);
        });
    }, []);

    function closeEditOverlay() {
        setErrorMessage("");
        setOpenChangeUsername(false);
    }

    async function updateUsername() {
        if (textInput === "") {
            setErrorMessage("Please provide a new username");
        } else if (textInput === username) {
            setErrorMessage("You already have this username");
        } else {
            const resp = await axios.post("http://192.168.43.239:8080/updateUser", {
                sessionId: sessionFromBack,
                username: textInput
            });
            if (resp.data !== "ok") {
                setErrorMessage(resp.data);
            } else {
                setUsername(textInput);
                closeEditOverlay();
            }

        }

    }





    return(
        <View style={styles.container}>
            <View style={commonStyle.statusBar}/>
            <View style={styles.topPart}>

                <ImageBackground source={topPart} style={styles.topPartBackground}>

                    <View style={{position: "relative", bottom: 50, right: 160}}>
                        <FontAwesome5 name={"bars"} size={24} style={{marginLeft: 10, marginTop:40, color: "white"}}
                                      onPress={() => setOpenMenu(true)}/>
                        <Overlay isVisible={openMenu}
                                 animationType="fade"
                                 borderRadius={9}
                                 height={370}
                                 containerStyle={{flex: 1, flexDirection: "row", justifyContent: "flex-start"}}
                                 windowBackgroundColor="rgba(214, 162, 232, .9)"
                                 overlayBackgroundColor={colors.backgroudCommon}
                                 onBackdropPress={() => setOpenMenu(false)}>

                            <Menu navigation={navigation} disapear={setOpenMenu} session={sessionFromBack}/>
                        </Overlay>
                    </View>

                    <View style={styles.avatarView}>

                        <Avatar
                            size="xlarge"
                            rounded
                            title={username.charAt(0)}
                            onPress={() => setOpenChangeUsername(true)}
                            activeOpacity={0.7}
                            containerStyle={{position: "absolute"}}
                        />

                        <Overlay isVisible={openChangeUsername}
                                 animationType="fade"
                                 borderRadius={9}
                                 height={200}
                                 containerStyle={{flex: 1, flexDirection: "row", justifyContent: "flex-start"}}
                                 windowBackgroundColor="rgba(214, 162, 232, .9)"
                                 overlayBackgroundColor={colors.backgroudCommon}
                                 onBackdropPress={() => closeEditOverlay()}>

                            <View>
                                <Input
                                    style={{width: 200, paddingTop: 30, paddingBottom: 20}}
                                    label="New username"
                                    onChangeText={text => setTextInput(text)}/>
                                <View style={{height:20}}>
                                    <Text style={[commonStyle.labelText, {textAlign: "center", color: "red"}]}>{errormessage}</Text>
                                </View>


                                <TouchableOpacity
                                    style={[commonStyle.commonButton, {bottom: 0, marginTop: 30}]}
                                    onPress={() => updateUsername()}
                                >
                                    <Text style={commonStyle.textButtonCommon}>Update username</Text>
                                </TouchableOpacity>
                            </View>

                        </Overlay>

                    </View>
                    <Text style={styles.userNameText}>{username}</Text>
                </ImageBackground>

            </View>


            <View style={{flex: 0.61}}>
                {render && <MyProfileForm sessionFromBack={sessionFromBack} navigation={navigation}/> || !render &&
                <ActivityIndicator size="large" color="#0000ff"/>}
            </View>

        </View>

    );
}



const styles = StyleSheet.create({
    userNameText: {
        fontSize: 29,
        fontWeight:"bold",
        paddingTop: 7,
        fontFamily: "montserrat",
        position:"relative",
        top:-102,
        color:"white"
    },
    avatarView: {
        marginTop:20,
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 25
    },
    container: {
        flex: 1,
        alignContent: "center",
    },
    topPart: {
        flex: 0.39,
        justifyContent: "flex-start",
    },
    topPartBackground: {
        width: Dimensions.get("screen").width,
        height: 200,
        alignItems: "center",
        justifyContent: "center",
    },
    textTopPart: {
        color: "white",
        fontSize: 35,
        fontFamily: "montserrat"

    },


})