import * as React from "react";
import {ImageBackground, View, TouchableOpacity, StyleSheet, Text, Dimensions, Image, ScrollView} from "react-native";
import commonStyle from "../../assets/style";
import {FontAwesome5} from "@expo/vector-icons";
import {Input, Overlay} from "react-native-elements";
import colors from "../../assets/colors";
import Menu from "../Menu";
import {useState} from "react";
import AssigCardDESIGN from "./AssigCardDESIGN";
import {useEffect} from "react";
import axios from "axios";
import AddAssignment from "../schedule/AddAssignment";
import TaskAssignment from "../schedule/TaskAssignment";
import DatePicker from "react-native-datepicker";


let topPart = require("../../assets/TopPart.png");
let categoryContainer = require("../../assets/CategoryContainer.png");
let courseOn = require("../../assets/CourseOn.png");
let courseOff = require("../../assets/CourseOff.png");
let labOn = require("../../assets/LaboratoryOn.png");
let labOff = require("../../assets/LaboratoryOff.png");
let seminaryOn = require("../../assets/SeminaryOn.png");
let seminaryOff = require("../../assets/SeminaryOff.png");
let professor = require("../../assets/Professor.png");
let location = require("../../assets/Location.png");
let assigIcon = require("../../assets/Assignments.png");
let examIcon = require("../../assets/ExamIcon.png");

export default function ({navigation}) {

    const [openMenu, setOpenMenu] = useState(false);
    const [categoryOn, setCategoryOn] = useState([true, false, false]);


    const [render, setRender] = useState(false);
    const sessionFromBack = navigation.getParam('sessionFromBack', '0');
    const [courseDetails, setCourseDetails] = useState({});
    const courseNa = JSON.stringify(navigation.getParam('courseName', ""));
    const courseName = courseNa.substring(1, courseNa.length - 1);
    const [overlayVisible, setoverlayVisible] = useState(false);
    const [overlayExam, setOverlayExam] = useState(false);

    const [datePicker, setDatePicker] = useState(new Date);   //alegere data exam
    const [disabled, setDisabled] = useState(true);  // buton confiramrte examen

    const [assigs, setAssigs] = useState([]);
    const [exam, setExam] = useState({course: "", date: "no"});


    function splitDate(a) {
        return a.dateLine.substring(6, 10) + "-" + a.dateLine.substring(3, 5) + "-" + a.dateLine.substring(0, 2);
    }

    function ordonareDupaDate(assigs) {
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

            const responseExam = await axios.post("http://192.168.43.239:8080/getExamForCourse", {
                sessionId: sessionFromBack,
                courseName: courseName
            });
            if (responseExam.data !== "no") {
                let myExam = {
                    course: courseName,
                    date: responseExam.data.substr(0, 10)
                };
                setExam(myExam);
            }


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


    async function addExam() {
        let id = 0;
        (await axios.post("http://192.168.43.239:8080/addExam",
            {
                sessionId: sessionFromBack,
                courseName: courseName,
                examDate: datePicker,
                examDetails: "detalii"
            }));
        let examm = {
            course: courseName, date: datePicker
        };
        setExam(examm);
        setOverlayExam(false);
    }


    return (
        <View style={styles.container}>
            <View style={commonStyle.statusBar}/>
            <View style={styles.topPart}>

                <ImageBackground source={topPart} style={styles.topPartBackground}>

                    <View style={{alignSelf: "flex-start", marginBottom: 40}}>
                        <FontAwesome5 name={"bars"} size={24} style={{marginLeft: 10, color: "white"}}
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


                    <Text style={styles.textTopPart}>{courseName}</Text>
                </ImageBackground>

                <ImageBackground source={categoryContainer} style={styles.categoryContainer}>

                    <TouchableOpacity style={{width: 70, height: 22, position: "relative", bottom: 30, right: 15}}
                                      onPress={() => setCategoryOn([true, false, false])}>
                        <Image style={styles.categImageCourse} source={categoryOn[0] && courseOn || courseOff}/>
                    </TouchableOpacity>


                    <TouchableOpacity style={{width: 85, height: 30, position: "relative", bottom: 30}}
                                      onPress={() => setCategoryOn([false, true, false])}>
                        <Image style={styles.categImageLab} source={categoryOn[1] && labOn || labOff}/>
                    </TouchableOpacity>


                    <TouchableOpacity style={{width: 90, height: 28, position: "relative", bottom: 30, left: 15,}}
                                      onPress={() => setCategoryOn([false, false, true])}>
                        <Image style={styles.categImageSem} source={categoryOn[2] && seminaryOn || seminaryOff}/>
                    </TouchableOpacity>
                </ImageBackground>


            </View>


            <View style={styles.courseDetails}>
                <ScrollView>

                    {
                        categoryOn[0] && courseDetails.professorLecture !== "" ?
                            <View style={{marginBottom: 20, marginLeft: 55}}>
                                <View style={{flexDirection: "row"}}>
                                    <Image source={professor} style={styles.littleIcon}/>
                                    <Text style={{
                                        fontFamily: "montserrat",
                                        color: colors.myPink,
                                        fontSize: 13,
                                        marginTop: 9
                                    }}>{courseDetails.professorLecture},
                                        {courseDetails.professorLectureEmail === "Not announced" ? "Email not announced" : courseDetails.professorLectureEmail}
                                    </Text>
                                </View>

                                <View style={{flexDirection: "row", marginTop: 15}}>
                                    <Image source={location} style={styles.littleIcon}/>
                                    <ScrollView horizontal={true}>
                                        <Text style={{
                                            fontFamily: "montserrat",
                                            color: colors.myPink,
                                            fontSize: 13,
                                            marginTop: 9
                                        }}>{courseDetails.classRoomLecture} {courseDetails.addressLecture} {courseDetails.observationLecture} </Text>
                                    </ScrollView>

                                </View>

                                {
                                    exam.date !== "no" ?
                                        <View style={{flexDirection: "row", marginTop: 15}}>
                                            <Image source={examIcon} style={styles.littleIconExam}/>
                                            <Text style={{
                                                fontFamily: "montserrat",
                                                color: colors.myPink,
                                                fontSize: 13,
                                                marginTop: 9
                                            }}>Exam date: {exam.date}</Text>
                                        </View>
                                        :
                                        <View/>
                                }
                            </View>

                            :

                            (
                                categoryOn[1] && courseDetails.professorLab !== "" ?
                                    <View style={{marginBottom: 20, marginLeft: 55}}>
                                        <View style={{flexDirection: "row"}}>
                                            <Image source={professor} style={styles.littleIcon}/>
                                            <Text style={{
                                                fontFamily: "montserrat",
                                                color: colors.myPink,
                                                fontSize: 13,
                                                marginTop: 9
                                            }}>{courseDetails.professorLab},
                                                {courseDetails.professorLabEmail === "Not announced" ? "Email not announced" : courseDetails.professorLabEmail}
                                            </Text>
                                        </View>

                                        <View style={{flexDirection: "row", marginTop: 15}}>
                                            <Image source={location} style={styles.littleIcon}/>
                                            <ScrollView horizontal={true}>
                                                <Text style={{
                                                    fontFamily: "montserrat",
                                                    color: colors.myPink,
                                                    fontSize: 13,
                                                    marginTop: 9
                                                }}>{courseDetails.classRoomLab} {courseDetails.addressLab} {courseDetails.observationLab} </Text>
                                            </ScrollView>

                                        </View>
                                    </View>
                                    :
                                    courseDetails.professorSeminary !== "" &&
                                    <View style={{marginBottom: 20, marginLeft: 55}}>
                                        <View style={{flexDirection: "row"}}>
                                            <Image source={professor} style={styles.littleIcon}/>
                                            <Text style={{
                                                fontFamily: "montserrat",
                                                color: colors.myPink,
                                                fontSize: 13,
                                                marginTop: 9
                                            }}>{courseDetails.professorSeminary},
                                                {courseDetails.professorSeminaryEmail === "Not announced" ? "Email not announced" : courseDetails.professorSeminaryEmail}
                                            </Text>
                                        </View>

                                        <View style={{flexDirection: "row", marginTop: 15}}>
                                            <Image source={location} style={styles.littleIcon}/>
                                            <ScrollView horizontal={true}>
                                                <Text style={{
                                                    fontFamily: "montserrat",
                                                    color: colors.myPink,
                                                    fontSize: 13,
                                                    marginTop: 9
                                                }}>{courseDetails.classRoomSeminary} {courseDetails.addressSeminary} {courseDetails.observationSeminary} </Text>
                                            </ScrollView>

                                        </View>
                                    </View>

                            )

                    }

                    {
                        categoryOn[0] ?
                            <View style={styles.addAssigContainer}>
                                <Text style={[commonStyle.actualText, {marginLeft: 20}]}>Exam</Text>
                                <FontAwesome5 style={{paddingLeft: 10, marginRight: 30}} name="plus"
                                              size={30}
                                              color={colors.myPink}
                                              onPress={() => setOverlayExam(!overlayExam)}
                                />

                                <Overlay isVisible={overlayExam}
                                         borderRadius={9}
                                         height={200}
                                         containerStyle={{flex: 1, justifyContent: "flex-start"}}
                                         windowBackgroundColor="rgba(214, 162, 232, .9)"
                                         overlayBackgroundColor={colors.backgroudCommon}
                                         onBackdropPress={() => setOverlayExam(false)}>

                                    <View>
                                        <Text
                                            style={{fontWeight: 'bold', color: "#698a96", paddingTop: 30, fontSize: 15}}> Choose
                                            date</Text>
                                        <DatePicker
                                            style={{width: 200, paddingTop: 9, paddingBottom: 20}} date={datePicker} mode="date"
                                            placeholder="select date" format="DD-MM-YYYY" minDate="01-09-2018"
                                            maxDate="12-06-2029"
                                            confirmBtnText="Confirm" cancelBtnText="Cancel"
                                            customStyles={{
                                                dateIcon: {position: 'absolute', left: 0, top: 4, marginLeft: 0},
                                                dateInput: {marginLeft: 36}
                                            }}
                                            onDateChange={(date) => {
                                                setDatePicker(date);
                                                setDisabled(false)
                                            }}
                                        />

                                        <TouchableOpacity
                                            style={[commonStyle.commonButton, {backgroundColor: disabled ? colors.gray : colors.myPink}]}
                                            onPress={() => addExam()}
                                            disabled={disabled}
                                        >
                                            <Text style={commonStyle.textButtonCommon}>Save exam</Text>
                                        </TouchableOpacity>

                                    </View>
                                </Overlay>
                            </View>
                            :
                            <View/>
                    }


                    <View style={styles.addAssigContainer}>
                        <Text style={[commonStyle.actualText, {marginLeft: 20}]}>Assignments:</Text>
                        <FontAwesome5 style={{paddingLeft: 10, marginRight: 30}} name="plus"
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
                        <AssigCardDESIGN
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


                </ScrollView>

            </View>


        </View>


    )

}


const styles = StyleSheet.create({

    addAssigContainer: {
        paddingRight: 10,
        paddingLeft: 13,
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10,
    },

    courseDetails: {
        flex: 0.61,
        //  margin: 27,
    },
    littleIcon: {
        width: 30,
        height: 30,
        marginRight: 8,
    },
    littleIconExam: {
        width: 22,
        height: 22,
        marginRight: 17,
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
        justifyContent: "center"

    },
    textTopPart: {
        color: "white",
        fontSize: 35,
        fontFamily: "montserrat",
        marginTop: -20,
    },
    categoryContainer: {
        flexDirection: "row",
        position: "absolute",
        top: 130,
        //right:8,
        width: Dimensions.get("screen").width,
        height: 200,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center"
    },
    categImageLab: {
        width: 95,
        height: 30,
        position: "relative",
    },
    categImageSem: {
        width: 90,
        height: 28,
        position: "relative",
        left: 0,
    },
    categImageCourse: {
        width: 80,
        height: 25,
        position: "relative",
        right: 7,
        bottom: 2
    },


})