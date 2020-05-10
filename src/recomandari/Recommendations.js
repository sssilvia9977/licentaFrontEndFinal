import * as React from "react";
import {Button, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator} from "react-native";
import colors from "../../assets/colors";
import commonStyle from "../../assets/style";
import {FontAwesome5} from '@expo/vector-icons';
import {useState} from "react";
import axios from "axios";
import {useEffect} from "react";
import {Overlay} from "react-native-elements";
import Menu from "../Menu";


export default function ({navigation}) {

    const sessionFromBack  = navigation.getParam("sessionFromBack", "0");
    const [openMenu, setOpenMenu] = useState(false);

    return(

        <View>

            <View style={commonStyle.statusBar}/>
            <View style={commonStyle.navigationBar}>
                <Text onPress={() => setOpenMenu(true)}>Menu</Text>
                <Overlay isVisible={openMenu}
                         animationType="fade"
                         borderRadius={9}
                         height={370}
                         containerStyle={{flex: 1, flexDirection:"row",justifyContent: "flex-start"}}
                         windowBackgroundColor="rgba(214, 162, 232, .9)"
                         overlayBackgroundColor={colors.backgroudCommon}
                         onBackdropPress={() => setOpenMenu(false)}>

                    <Menu navigation={navigation} disapear = {setOpenMenu} session={sessionFromBack}/>
                </Overlay>
            </View>


            <TouchableOpacity
                style={[commonStyle.commonButton, { width:220, alignSelf:"center", marginTop:10 ,flexDirection: "row"}]}
                onPress={()=> console.log("haha")}
            >
                <FontAwesome5 style = {{paddingLeft:10, paddingRight: 10, color:"white"}}
                              name="plus" size={25}/>
                <Text style={[commonStyle.textButtonCommon, {fontSize: 15}]}>Add a recommendation</Text>
            </TouchableOpacity>





        </View>

    );

}


const styles = StyleSheet.create({

    container:{
        flex:1
    }


});