import * as React from "react";
import {
    Button,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    TouchableHighlight
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
import CardView from "./CardView";


export default function ({navigation}) {

    const sessionFromBack  = navigation.getParam("sessionFromBack", "0");
    const [openMenu, setOpenMenu] = useState(false);
    const [myRec, setMyRec] = useState([]);

    const [render, setRender] = useState(false);

    useEffect(() => {

        (async () => {
            const resp = await axios.post('http://192.168.43.239:8080/getRecPostedByUser', {sessionId:sessionFromBack});
            setMyRec(resp.data);
            setRender(true);
        })();

    }, []);

    async function deleteRec(){



    }




    if(!render){
        return <ActivityIndicator/>
    }
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
                onPress={()=> navigation.navigate("AddRecMaps", {sessionFromBack:sessionFromBack})}
            >
                <FontAwesome5 style = {{paddingLeft:10, paddingRight: 10, color:"white"}}
                              name="plus" size={25}/>
                <Text style={[commonStyle.textButtonCommon, {fontSize: 15}]}>Add a recommendation</Text>
            </TouchableOpacity>

            <ScrollView style={{marginBottom: 150}} contentContainerStyle={{ alignItems:"center"}}>
                {
                    myRec.map((rec, index) => (
                        <TouchableHighlight underlayColor='rgba(86, 19, 41, 0.0)' onLongPress={()=>console.log("my rec")} key={index}>
                            <CardView placeName={rec.placeName} address={rec.address}
                                      comment={rec.initialComment} />
                        </TouchableHighlight>
                    ))
                }
            </ScrollView>






        </View>

    );

}


const styles = StyleSheet.create({

    container:{
        flex:1
    }


});