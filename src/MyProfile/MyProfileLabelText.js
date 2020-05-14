import * as React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import colors from "../../assets/colors";
import commonStyle from "../../assets/style";
import {FontAwesome5} from '@expo/vector-icons';
import {Input, Overlay} from "react-native-elements";
import {useState} from "react";
import axios from "axios";


export default function (props) {

    const [textInput, setTextInput] = useState("");
    const [errormessage, setErrorMessage] = useState("");
    const [value, setValue] = useState(props.value);

    const [openChangeField, setOpenChangeField] = useState(false);
    const myLabel = props.label === "Email" ? "New email" : (
        props.label === "Change password" ? "New password" : (
            props.label === "University" ? "University" : "Faculty"
        )
    );


    async function updateUserData() {

        let resp;
        if (textInput === "") {
            setErrorMessage("Text cannot be empty.");
        } else if (textInput === props.value) {
            setErrorMessage("Please provide a new value.");
        } else {
            if (myLabel === "New email") {
                resp = await axios.post("http://192.168.43.239:8080/updateUser", {
                    sessionId: props.sessionFromBack,
                    email: textInput
                });
                debugger
                ok(resp.data);
            } else if (myLabel === "New password") {
                resp = await axios.post("http://192.168.43.239:8080/updateUser", {
                    sessionId: props.sessionFromBack,
                    password: textInput
                });
                ok(resp.data);
            } else if (myLabel === "University") {
                resp = await axios.post("http://192.168.43.239:8080/updateUser", {
                    sessionId: props.sessionFromBack,
                    uni: textInput
                });
                ok(resp.data);
            } else if (myLabel === "Faculty") {
                resp = await axios.post("http://192.168.43.239:8080/updateUser", {
                    sessionId: props.sessionFromBack,
                    faculty: textInput
                });
                ok(resp.data);
            }
        }


    }


    function ok(resp) {
        if (resp !== "ok") {
            setErrorMessage(resp);
        } else {
            setValue(textInput);
            setErrorMessage("");
            setOpenChangeField(false);
        }
    }

    function closeEditOverlay() {
        setErrorMessage("");
        setOpenChangeField(false);
    }


    return (

        <View style={styles.container}>
            <View style={{width: '90%'}}>
                <Text style={styles.labelText}>{props.label}</Text>
                <Text style={styles.actualText}>{value}</Text>
            </View>

            <View>
                <FontAwesome5 onPress={() => setOpenChangeField(true)} style={{paddingTop: 10}} name="edit" size={24}
                              color={colors.backgroundCommonDark}/>

                <Overlay isVisible={openChangeField}
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
                            label={myLabel}
                            onChangeText={text => setTextInput(text)}/>
                        <View style={{height: 20}}>
                            <Text style={[commonStyle.labelText, {
                                textAlign: "center",
                                color: "red"
                            }]}>{errormessage}</Text>
                        </View>


                        <TouchableOpacity
                            style={[commonStyle.commonButton, {bottom: 0, marginTop: 30}]}
                            onPress={() => {updateUserData();}}
                        >
                            <Text style={commonStyle.textButtonCommon}>Update</Text>
                        </TouchableOpacity>
                    </View>

                </Overlay>

            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: colors.myYellowFaded,
        margin: 15,
        padding: 10,
        borderRadius: 20,
    },
    labelText: {
        color: colors.backgroundCommonDark,
        fontWeight: 'bold',
        fontSize: 19,
    },
    actualText: {
        color: colors.backgroundCommonDark,
        fontSize: 18,
    },
});