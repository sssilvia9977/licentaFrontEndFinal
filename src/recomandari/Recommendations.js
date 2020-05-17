import * as React from "react";
import {
    Button,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    ImageBackground,
    Dimensions
} from "react-native";
import colors from "../../assets/colors";
import commonStyle from "../../assets/style";
import {FontAwesome5} from '@expo/vector-icons';
import {useState} from "react";
import axios from "axios";
import {useEffect} from "react";
import {Overlay} from "react-native-elements";
import Menu from "../Menu";
import RecForm from "./RecForm";

let topPart = require("../../assets/TopPart.png");
let addRecomButton = require("../../assets/AddRecomButton.png");


/*
TODO:
 */

export default function ({navigation}) {

    const sessionFromBack  = navigation.getParam("sessionFromBack", "0");
    const [openMenu, setOpenMenu] = useState(false);

    return(

        <View>
            <View style={commonStyle.statusBar}/>

            <View style={styles.topPart}>
                <ImageBackground source={topPart} style={styles.topPartBackground}>

                    <View style={{position: "relative", bottom: 50, right: 160}}>
                        <FontAwesome5 name={"bars"} size={24} style={{marginLeft: 10, marginTop: 40, color: "white"}}
                                      onPress={() => setOpenMenu(true)}/>
                        <Overlay isVisible={openMenu}
                                 animationType="fade"
                                 borderRadius={9}
                                 height={340}
                                 containerStyle={{flex: 1, flexDirection: "row", justifyContent: "flex-start"}}
                                 windowBackgroundColor={colors.backgroundCommonDark}
                                 onBackdropPress={() => setOpenMenu(false)}>

                            <Menu navigation={navigation} disapear={setOpenMenu} session={sessionFromBack}/>
                        </Overlay>
                    </View>

                    <Text style={styles.textTopPart}>What students recommend</Text>
                </ImageBackground>
            </View>



            <View style={styles.bottomPart}>
                <RecForm navigation={navigation} sessionFromBack = {sessionFromBack} />
             </View>


        </View>

    );

}


const styles = StyleSheet.create({
    bottomPart:{
       // flex: 0.65,
        marginTop:200,
        marginBottom: -100
        //paddingBottom: 30,
    },

    container:{
        flex:1
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
        color: "white",
        fontSize: 30,
        textAlign:"center",
        fontFamily: "montserrat",
        position:"relative",
        bottom: 30,

    },


});

/*
 <TouchableOpacity
                    style={[commonStyle.commonButton, { width:220, alignSelf:"center", marginTop:10 ,flexDirection: "row"}]}
                    onPress={()=> navigation.navigate("AddRecMaps", {sessionFromBack:sessionFromBack})}
                >
                    <FontAwesome5 style = {{paddingLeft:10, paddingRight: 10, color:"white"}}
                                  name="plus" size={25}/>
                    <Text style={[commonStyle.textButtonCommon, {fontSize: 15}]}>Add a recommendation</Text>
                </TouchableOpacity>
 */