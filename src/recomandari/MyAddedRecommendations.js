import * as React from "react";
import {
    Button,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Image,
    TouchableHighlight, ImageBackground, Dimensions
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

let topPart = require("../../assets/TopPart.png");
let addRecomButton = require("../../assets/AddRecomButton.png");

/*
TODO: okk, this is ook!!!!
 */
export default function ({navigation}) {

    const sessionFromBack = navigation.getParam("sessionFromBack", "0");
    const [openMenu, setOpenMenu] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [myRec, setMyRec] = useState([]);
    const [indexRecToDelete, setIndexRecToDelete] = useState(0);

    const [render, setRender] = useState(false);


    useEffect(() => {

        (async () => {
            const resp = await axios.post('http://192.168.43.239:8080/getRecPostedByUser', {sessionId: sessionFromBack});
            setMyRec(resp.data);
            setRender(true);
        })();

    }, []);

    async function deleteRec() {
        setOpenDelete(false);
        await axios.delete("http://192.168.43.239:8080/deleteRec", {data: {recId: indexRecToDelete}});
        setMyRec(myRec.filter(rec => rec.recId !== indexRecToDelete));
    }


    return (

        <View style={styles.container}>
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

                    <Text style={styles.textTopPart}>My added recommendations</Text>

                    <Overlay isVisible={openDelete}
                             animationType="fade"
                             borderRadius={9}
                             height={70}
                             containerStyle={{flex: 1, flexDirection: "row", justifyContent: "flex-start"}}
                             windowBackgroundColor="rgba(214, 162, 232, .9)"
                             overlayBackgroundColor={colors.backgroudCommon}
                             onBackdropPress={() => setOpenDelete(false)}>
                        <TouchableOpacity onPress={() => deleteRec()}>
                            <Text style={{fontSize: 35, fontWeight: "bold", color: "red"}}>Delete</Text>
                        </TouchableOpacity>

                    </Overlay>
                </ImageBackground>
            </View>


            <View style={styles.bottomPart}>


                <TouchableOpacity
                    style={{alignSelf: "center" }}
                    onPress={() => navigation.navigate("AddRecMaps", {sessionFromBack: sessionFromBack})}
                >
                    <Image style={styles.imageAddRecButton} source={addRecomButton}/>
                </TouchableOpacity>



                <ScrollView contentContainerStyle={{alignItems: "center"}}>
                    {
                        myRec.map((rec, index) => (
                            <TouchableHighlight underlayColor='rgba(86, 19, 41, 0.0)' onLongPress={() => {
                                setIndexRecToDelete(rec.recId);
                                setOpenDelete(true)
                            }} key={index}>
                                <CardView placeName={rec.placeName} address={rec.address}
                                          comment={rec.initialComment}/>
                            </TouchableHighlight>
                        ))
                    }
                </ScrollView>
            </View>

        </View>

    );

}


const styles = StyleSheet.create({
    imageAddRecButton:{
        width: 350,
        height: 100,
    },
    container: {
        flex: 1,
    },
    topPart: {
        flex: 0.25,
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
    bottomPart:{
        flex: 0.75,
    }


});



