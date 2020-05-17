import * as React from "react";

import axios from 'axios';
import commonStyle from "../assets/style"
import {
    Button,
    StyleSheet,
    ScrollView,
    Text,
    View,
    SafeAreaView,
    RefreshControl,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    TouchableWithoutFeedback,
    Animated,
    Modal, ActivityIndicator
} from "react-native";
import {FontAwesome5} from '@expo/vector-icons';
import {useState} from "react";
import {backgroundColor} from "@eva-design/eva/mapping";
import {Divider, Overlay} from "react-native-elements";
import colors from "../assets/colors";
import TaskAssignment from "../src/schedule/TaskAssignment";
import {useEffect} from "react";
import AddAssignment from "../src/schedule/AddAssignment";
import {Dropdown} from "react-native-material-dropdown";
import {useCallback} from "react";
import Menu from "../src/Menu";

/*
TODO: this is old
 */
export default function MyCoursesTemplate({navigation}) {


    const [render, setRender] = useState(false);
    const sessionFromBack = navigation.getParam('sessionFromBack', '0');
    const [courseDetails, setCourseDetails] = useState({});
    const courseNa = JSON.stringify(navigation.getParam('courseName', ""));
    const courseName = courseNa.substring(1, courseNa.length - 1);
//    console.log("The course name is: " + courseName);
    const [overlayVisible, setoverlayVisible] = useState(false);


    const [assigs, setAssigs] = useState([]);
    const [openMenu, setOpenMenu] = useState(false);

    function splitDate(a) {
        return  a.dateLine.substring(6,10) + "-" + a.dateLine.substring(3,5) + "-" + a.dateLine.substring(0,2);
    }

    function ordonareDupaDate(assigs){
        let sortate = assigs.sort(function (a, b) {
            let newA = splitDate(a);
            let newB = splitDate(b);
            return ('' + newA).localeCompare(newB);
        });
        return sortate;
    }


    useEffect(() => {
        (async () => {
            const response = await axios.post("http://192.168.43.239:8080/getCourseDetails", {
                sessionId: sessionFromBack,
                courseName: courseName
            });
            setAssigs(ordonareDupaDate(response.data.assigmentDTOS));
            setCourseDetails(response.data);
            setRender(true);
        })();

    }, [navigation]);

    function deleteAssignment(id: number) {
        setAssigs(assigs.filter(assig => assig.id !== id))
    }

    function updateAssignment(assignment) {
        assigs.forEach(assig => {
            if (assig.id === assignment.id) {
                assig = assignment;
            }
        });
        setAssigs(ordonareDupaDate(assigs));
    }

    function activateOverlay() {
        setoverlayVisible(!overlayVisible);
    }

    return (

        <View>
            <View style={commonStyle.statusBar}/>
            <View style={commonStyle.navigationBar}>
                <FontAwesome5 name={"bars"} size={24} style={{marginLeft: 10}} onPress={() => setOpenMenu(true)}/>
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

            {
                render ?
                    <ScrollView>

                        <View style={{paddingBottom: 70,}}>

                            <View style={styles.avatarView}>
                                <Text style={{
                                    color: colors.backgroundCommonDark,
                                    paddingBottom: 10,
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    fontFamily: "serif",
                                }}>{courseName}</Text>
                            </View>

                            {
                                courseDetails.classRoomLecture == "" ?
                                    <View style={styles.container}><Text style={commonStyle.actualText}>No
                                        lecture</Text></View> :
                                    <View style={styles.container}>
                                        <View style={styles.myView}>
                                            <Text style={commonStyle.actualText}>Lecture: </Text>
                                            <Text
                                                style={commonStyle.actualSmallText}>{courseDetails.professorLecture}</Text>
                                            <Text
                                                style={commonStyle.actualSmallText}>{courseDetails.professorLectureEmail === "Not announced" ? "Email not announced" : courseDetails.professorLectureEmail}</Text>
                                            <Text
                                                style={commonStyle.actualSmallText}>{courseDetails.classRoomLecture}, {courseDetails.addressLecture}</Text>
                                            <Text
                                                style={commonStyle.actualSmallText}>{courseDetails.observationLecture}</Text>
                                        </View>
                                    </View>
                            }


                            {
                                courseDetails.classRoomLab == "" ?
                                    <View style={styles.container}><Text style={commonStyle.actualText}>No
                                        Laboratory</Text></View> :
                                    <View style={styles.container}>
                                        <View style={styles.myView}>
                                            <Text style={commonStyle.actualText}>Laboratory: </Text>
                                            <Text
                                                style={commonStyle.actualSmallText}>{courseDetails.professorLab}</Text>
                                            <Text
                                                style={commonStyle.actualSmallText}>{courseDetails.professorLabEmail === "Not announced" ? "Email not announced" : courseDetails.professorLabEmail}</Text>
                                            <Text
                                                style={commonStyle.actualSmallText}>{courseDetails.classRoomLab}, {courseDetails.addressLab}</Text>
                                            <Text
                                                style={commonStyle.actualSmallText}>{courseDetails.observationLab}</Text>
                                        </View>
                                    </View>
                            }

                            {
                                courseDetails.classRoomSeminary == "" ?
                                    <View style={styles.container}><Text style={commonStyle.actualText}>No
                                        Seminary</Text></View> :
                                    <View style={styles.container}>
                                        <View style={styles.myView}>
                                            <Text style={commonStyle.actualText}>Seminary: </Text>
                                            <Text
                                                style={commonStyle.actualSmallText}>{courseDetails.professorSeminary}</Text>
                                            <Text
                                                style={commonStyle.actualSmallText}>{courseDetails.professorSeminaryEmail === "Not announced" ? "Email not announced" : courseDetails.professorSeminaryEmail}</Text>
                                            <Text
                                                style={commonStyle.actualSmallText}>{courseDetails.classRoomSeminary}, {courseDetails.addressSeminary}</Text>
                                            <Text
                                                style={commonStyle.actualSmallText}>{courseDetails.observationSeminary}</Text>
                                        </View>
                                    </View>
                            }


                            <Divider style={{backgroundColor: colors.myPink, height: 2, marginTop: 10}}/>


                            <View style={styles.container}>
                                <Text style={commonStyle.actualText}>Assignments:</Text>

                                <FontAwesome5 style={{paddingLeft: 10, paddingRight: 10, paddingTop: 5}} name="plus"
                                              size={30}
                                              color={colors.myPink}
                                              onPress={() => activateOverlay()}
                                />


                                <Overlay isVisible={overlayVisible}
                                         borderRadius={9}
                                         height={370}
                                         containerStyle={{flex: 1, justifyContent: "flex-start"}}
                                         windowBackgroundColor="rgba(214, 162, 232, .9)"
                                         overlayBackgroundColor={colors.backgroudCommon}
                                         onBackdropPress={() => setoverlayVisible(false)}>

                                    <AddAssignment navigation={navigation} courseName={courseName}
                                                   sessionFromBack={sessionFromBack}
                                                   hideOverlay={setoverlayVisible}
                                                   setAssignments={setAssigs}
                                                   assignments={assigs}
                                    />
                                </Overlay>


                            </View>

                            {assigs.map(assig => (

                                <TaskAssignment
                                    deleteAssignment={deleteAssignment}
                                    updateAssignment={updateAssignment}
                                    key={assig.id}
                                    assigId={assig.id}
                                    navigation={navigation}
                                    sessionFromBack={sessionFromBack} courseAbreviere={assig.title}
                                    deadline={assig.dateLine} description={assig.description}
                                    status={assig.status}
                                    openOverlay="true"/>
                            ))}


                        </View>
                    </ScrollView>

                    :
                    <ActivityIndicator size="large" color="#0000ff"/>

            }
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        paddingRight: 10,
        paddingLeft: 13,
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    myView: {
        flexDirection: "column",
    },
    avatarView: {
        flex: 0.05,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 18,
    },
});

