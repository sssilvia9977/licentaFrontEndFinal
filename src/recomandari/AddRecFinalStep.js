import {Text, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView} from "react-native";
import commonStyle from "../../assets/style";
import {Dropdown} from "react-native-material-dropdown";
import {Input} from "react-native-elements";
import * as React from "react";
import {useEffect} from "react";
import axios from "axios";
import {useState} from "react";
import CardView from "./CardView";


export default function AddRecFinalStep ({navigation}) {

    const [data, setData] = useState([{value: ""}]);
    const [selectedCat, setSelectedCat] = useState("");
    const [comment, setComment] = useState("");

    const finalAddress = navigation.getParam('finalAddress', '');
    const sessionFromBack = navigation.getParam('sessionFromBack', '0');


    useEffect(() => {
        (async () => {
            const takeCategories = await axios.get("http://192.168.43.239:8080/getAllCategories");
            let singleDataDropDown = {value: ""};
            let arrayDataObj = [{}];
            takeCategories.data.forEach(c => {
                singleDataDropDown = {value: c};
                arrayDataObj = [...arrayDataObj, singleDataDropDown];
            });
            setData(arrayDataObj);
        })();
    });

   async function addRec(){
        await axios.post("http://192.168.43.239:8080/addRec", {placeName: finalAddress, address: finalAddress, initialComment: comment, category:selectedCat, sessionId: sessionFromBack});
        navigation.navigate("MyProfile");
   }

    return (

        <View style={styles.container}>
            <View style={commonStyle.statusBar}/>

            <View style={{alignSelf:"center"}}>
                <CardView address={finalAddress} placeName={finalAddress}/>
            </View>

            <View style={{marginTop: 30}}>
                <Input
                    multiline={true}
                    label="Add your description"
                    style={{paddingTop: 30, width: 200,}}
                    onChangeText={text => setComment(text)}/>
            </View>

            <Dropdown label='Select category' data={data} onChangeText={value => setSelectedCat(value)} />

            <TouchableOpacity
                style={[commonStyle.commonButton, {marginTop: 150}]}
                onPress={() => addRec()}>
                <Text style={commonStyle.textButtonCommon}>Add recommendation</Text>
            </TouchableOpacity>

        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
    },


});