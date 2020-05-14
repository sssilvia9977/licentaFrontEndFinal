import * as React from "react";
import {StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, BackHandler ,ScrollView} from "react-native";
import colors from "../../assets/colors";
import commonStyle from "../../assets/style";
import {FontAwesome5} from "@expo/vector-icons";
import MyCoursesTemplate from "./MyCoursesTemplate";
import {Divider, Overlay} from "react-native-elements";
import {useState} from "react";
import axios from "axios";
import {useEffect} from "react";
import Menu from "../Menu";
import {SCLAlert, SCLAlertButton} from "react-native-scl-alert";

/*
TODO: la avatar, ia de undeva initialel alea
TODO: daca apesi pe imagine, poti schimba imaginea
 */


export default function ({navigation}) {

    const sessionFromBack = navigation.getParam('sessionFromBack', '0');
    const [courses, setCourses] = useState([]);

    const [openMenu, setOpenMenu] = useState(false);
    const [alertShow, setAlertShow] = useState(false);



   useEffect(() =>{
     //  console.log("my courses session id: " + sessionFromBack);
       axios.post("http://192.168.43.239:8080/getCourses", {sessionId:sessionFromBack}).then(response => {
           setCourses(response.data);

           if(response.data.length === 0 ) setAlertShow(true);

   });
   },[]);


    return(
        <View style={styles.container}>
            <View style={commonStyle.statusBar}/>
            <View style={commonStyle.navigationBar}>
                <FontAwesome5 name={"bars"} size={24} style={{marginLeft: 10}} onPress={() => setOpenMenu(true)}/>
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

            <SCLAlert
                theme="info"
                show={alertShow}
                title="Hello,"
                subtitle="You don't have any courses yet."
                onRequestClose={() => setAlertShow(false)}>
                <SCLAlertButton theme="info" onPress={()=> setAlertShow(false)}>OK</SCLAlertButton>
            </SCLAlert>


            <ScrollView>
            <View style={ styles.avatarView }>
                    <Text  style={{ color: colors.backgroundCommonDark,paddingTop:20, paddingBottom: 10, fontSize: 25, fontWeight: 'bold', fontFamily: "serif",}}>My Courses</Text>
            </View>

                {
                    courses.map((course, index) => (
                        <MyCoursesTemplate        courseAbreviere={course.abreviere}
                                                  courseName ={course.name}
                                                  navigation={navigation}
                                                  sessionFromBack = {sessionFromBack}
                                                  key={index}
                        />
                    ))
                }

            </ScrollView>

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
        flex: 0.05,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 8,
    },



});