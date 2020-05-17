import * as React from "react";

import axios from 'axios';
import {
    Button,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    ScrollView,
    Image,
    ImageBackground
} from "react-native";
import * as Permissions from "expo-permissions";
import {useState} from "react";
import commonStyle from "../../assets/style"
import LoginScreenForm from "../../old/LoginScreenForm";
import colors from "../../assets/colors";
import ScheduleForm from "./ScheduleCalendarForm";
import * as DocumentPicker from 'expo-document-picker';
import TaskSchedule from "./TaskSchedule";
import TaskAssignment from "./TaskAssignment";
import {Overlay} from "react-native-elements";
import Menu from "../Menu";
import {useEffect} from "react";
import {SCLAlert, SCLAlertButton} from "react-native-scl-alert";
import {FontAwesome5} from "@expo/vector-icons";
import ExamCard from "./ExamCard";

const {width, height} = Dimensions.get('window');

let categoryContainer = require("../../assets/CategoryColored.png");
let scheduleOn = require("../../assets/ScheduleOn(1).png");
let scheduleOff = require("../../assets/ScheduleOff(1).png");
let assigOn = require("../../assets/AssignmentsOn(1).png");
let assigOff = require("../../assets/AssignmentsOff(1).png");
let topPartDoarBara = require("../../assets/topDoarBara.png");



export default function Schedule({navigation}) {

    const [categoryOn, setCategoryOn] = useState([true, false]);

    const sessionFromBack = navigation.getParam('sessionFromBack', '0');

    const [onFocusPickAssig, setOnFocusPickAssig] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    const [scheduleDate, setScheduleDate] = useState(new Date().getDate());
    const [scheduleMonth, setScheduleMont] = useState(new Date().getMonth());
    const [scheduleYear, setScheduleYear] = useState(new Date().getFullYear());
    const [scheduleDay, setScheduleDay] = useState(new Date().getDay());   // 0 e duminica
    const [timestamp, setTimestamp] = useState(Date.now());

    const [allowUse, setAllowUse] = useState(false);

    const [oraLuni, setOraLuni] = useState([]);
    const [oraMarti, setOraMarti] = useState([]);
    const [oraMiercuri, setOraMiercuri] = useState([]);
    const [oraJoi, setOraJoi] = useState([]);
    const [oraVineri, setOraVineri] = useState([]);

    const [assigs, setAssigs] = useState([]);
    const [assigsFiltered, setAssigsFiltered] = useState([]);
    const [structInCalendar, setStructInCalendar] = useState([]);

    const [exams, setExams] = useState([]);


    function splitDate(a) {
        let x = a.substr(6, 1);
        return a.substr(6, 4) + "-" + a.substring(3, 5) + "-" + a.substring(0, 2);  //year month day
    }

    function ordonareDupaDate(assigs) {
        let sortate = assigs.sort(function (a, b) {
            let newA = splitDate(a.dateLine);
            let newB = splitDate(b.dateLine);
            return ('' + newA).localeCompare(newB);
        });
        return sortate;
    }

    function checkDate(date) {
        if (date < 10)
            return "0" + date;
        return date;
    }

    function toDisplayAssig(item) {
        return (scheduleYear + "-" + checkDate(scheduleMonth + 1) + "-" + checkDate(scheduleDate)).localeCompare(splitDate(item.dateLine))
    }


    function afisareOrarInZiDeScoala(anSelected, lunaSelected, ziSelected, perioada) {
        let lunaSelectedBuna = lunaSelected + 1;
        let dataSelected = anSelected + "-" + checkDate(lunaSelectedBuna) + "-" + checkDate(ziSelected);

        let continueFor = true;
        let display = false;


        structInCalendar.forEach(str => {
            if (continueFor === true) {
                let start = str.periodStart.split("T")[0];
                let end = str.periodEnd.split("T")[0];
                let type = str.schoolPeriodType;

                if (type === perioada) {
                    let compareStart = start.localeCompare(dataSelected);    // vreau sa fie egale deci 0  SAU ordine start si apoi dateSelected deci -1 ca start inainte
                    let compareEnd = end.localeCompare(dataSelected);        // vreau sa fie egale deci 0  SAU ordine dateSelected si apoi end deci 1 ca end la final

                    if (compareEnd === 0 || compareStart === 0) {
                        continueFor = false;
                        display = true;
                    } else if (compareStart === -1 && compareEnd === 1) {
                        continueFor = false;
                        display = true;
                    }
                }
            }
        });

        return display;
    }

    useEffect(() => {
        if (allowUse) {
            setAssigsFiltered(ordonareDupaDate(assigs.filter((item) => toDisplayAssig(item) === -1 || toDisplayAssig(item) === 0)))
        }
    }, [scheduleDate]);

    useEffect(() => {
        (async () => {
            const responseAssig = await axios.post("http://192.168.43.239:8080/getAllAssigs", {
                sessionId: sessionFromBack,
            });
            if(responseAssig.data.length !== 0){
                setAssigs(responseAssig.data);
                setAssigsFiltered(ordonareDupaDate(responseAssig.data.filter((item) => (scheduleYear + "-" +
                    checkDate(scheduleMonth + 1) + "-" + checkDate(scheduleDate)).localeCompare(splitDate(item.dateLine)) === -1)));
            }
            setAllowUse(true);
//---------------------------------------------------------------------------------------------------------
            const responseOrar = await axios.post("http://192.168.43.239:8080/getSchedule", {
                sessionId: sessionFromBack
            });

            setOraLuni([]);
            setOraMarti([]);
            setOraMiercuri([]);
            setOraJoi([]);
            setOraVineri([]);

            responseOrar.data.forEach(ora => {
                if (ora.day == "Monday") setOraLuni(oraLuni => [...oraLuni, ora]);
                else if (ora.day == "Tuesday") setOraMarti(oraMarti => [...oraMarti, ora]);
                else if (ora.day == "Wednesday") setOraMiercuri(oraMiercuri => [...oraMiercuri, ora]);
                else if (ora.day == "Thursday") setOraJoi(oraJoi => [...oraJoi, ora]);
                else if (ora.day == "Friday") setOraVineri(oraVineri => [...oraVineri, ora]);
            });


//---------------------------------------------------------------------------------------------------------
            const responseStructura = await axios.post("http://192.168.43.239:8080/getStructAnUniv", {
                sessionId: sessionFromBack,
            });
            setStructInCalendar(responseStructura.data);

 //---------------------------------------------------------------------------------------------------------
            const respExams = await axios.post("http://192.168.43.239:8080/getExam", {
                sessionId: sessionFromBack,
            });
            setExams(respExams.data);
            console.log(respExams.data);



        })();
    }, [navigation]);

    return (

        <View style={styles.container}>
            <View style={commonStyle.statusBar}/>

                     <ImageBackground source={topPartDoarBara} style={{width:Dimensions.get("screen").width, height:40}}>
                              <FontAwesome5 name={"bars"} size={24} style={{marginLeft: 10, marginTop: 10, color: "white"}} onPress={() => setOpenMenu(true)}/>
                              <Overlay isVisible={openMenu}
                                       animationType="fade"
                                       borderRadius={9}
                                       height={340}
                                       containerStyle={{flex: 1, flexDirection: "row", justifyContent: "flex-start"}}
                                       windowBackgroundColor={colors.backgroundCommonDark}
                                       onBackdropPress={() => setOpenMenu(false)}>

                                  <Menu navigation={navigation} disapear={setOpenMenu} session={sessionFromBack}/>
                              </Overlay>
                    </ImageBackground>

            <ScheduleForm style={styles.calendar} navigation={navigation} sendScheduleDay={setScheduleDay}
                          sendScheduleDate={setScheduleDate} sendScheduleMonth={setScheduleMont}
                          sendScheduleYear={setScheduleYear} sendTimeStamp={setTimestamp}
                          sessionFromBack={sessionFromBack}/>


            <View style={{flex:0.65, justifyContent:"flex-start"}}>
                {
                    afisareOrarInZiDeScoala(scheduleYear, scheduleMonth, scheduleDate, "EXAM") ?
                        <ImageBackground source={categoryContainer} style={styles.categoryContainer}>
                                <Text style={[commonStyle.actualText, {color:"white", fontWeight:"bold", marginBottom:40}]}>EXAM PERIOD</Text>
                        </ImageBackground>
                        :
                        <ImageBackground source={categoryContainer} style={styles.categoryContainer}>
                            <TouchableOpacity style={{ width: 100, height: 42, position: "relative", bottom: 25, right: 15}}
                                              onPress={() => {setOnFocusPickAssig(false);setCategoryOn([true, false])}}>
                                <Image style={styles.categImageSchedule} source={categoryOn[0] && scheduleOn || scheduleOff}/>
                            </TouchableOpacity>


                            <TouchableOpacity style={{width: 105, height: 40, position: "relative", bottom: 25}}
                                              onPress={() => {setOnFocusPickAssig(true); setCategoryOn([false, true])}}>
                                <Image style={styles.categImageAssig} source={categoryOn[1] && assigOn || assigOff}/>
                            </TouchableOpacity>
                        </ImageBackground>
                }


            <View style={{marginBottom:-80, marginTop:40}}>
                    <ScrollView>
                        <View style={[styles.aranjare]}>

                            {onFocusPickAssig === false ?
                                //arata orar numai pe timp de scoala
                                (scheduleDay === 1 && afisareOrarInZiDeScoala(scheduleYear, scheduleMonth, scheduleDate, "SCHOOL") ?
                                        oraLuni.map((ora, index) =>
                                            <TaskSchedule courseAbreviere={ora.courseAbreviere}
                                                          courseName={ora.courseName}
                                                          courseType={ora.courseType}
                                                          hourStart={ora.hourStart} hourEnd={ora.hourEnd}
                                                          classRoom={ora.courseClassRoom}
                                                          address={ora.courseAddress}
                                                          detailsAddress={ora.courseAddressDetails}
                                                          sessionFromBack={sessionFromBack}
                                                          navigation={navigation}
                                                          timestamp={timestamp}
                                                          key={index}/>)
                                        :
                                        (scheduleDay === 2 && afisareOrarInZiDeScoala(scheduleYear, scheduleMonth, scheduleDate, "SCHOOL") ?
                                                oraMarti.map((ora, index) =>
                                                    <TaskSchedule courseAbreviere={ora.courseAbreviere}
                                                                  courseName={ora.courseName}
                                                                  courseType={ora.courseType}
                                                                  hourStart={ora.hourStart} hourEnd={ora.hourEnd}
                                                                  classRoom={ora.courseClassRoom}
                                                                  address={ora.courseAddress}
                                                                  detailsAddress={ora.courseAddressDetails}
                                                                  sessionFromBack={sessionFromBack}
                                                                  navigation={navigation}
                                                                  timestamp={timestamp}
                                                                  key={index}/>)
                                                :
                                                (scheduleDay === 3 && afisareOrarInZiDeScoala(scheduleYear, scheduleMonth, scheduleDate, "SCHOOL") ?
                                                        oraMiercuri.map((ora, index) =>
                                                            <TaskSchedule courseAbreviere={ora.courseAbreviere}
                                                                          courseName={ora.courseName}
                                                                          courseType={ora.courseType}
                                                                          hourStart={ora.hourStart} hourEnd={ora.hourEnd}
                                                                          classRoom={ora.courseClassRoom}
                                                                          address={ora.courseAddress}
                                                                          detailsAddress={ora.courseAddressDetails}
                                                                          sessionFromBack={sessionFromBack}
                                                                          navigation={navigation}
                                                                          timestamp={timestamp}
                                                                          key={index}/>)
                                                        :
                                                        (scheduleDay === 4 && afisareOrarInZiDeScoala(scheduleYear, scheduleMonth, scheduleDate,"SCHOOL") ?
                                                                oraJoi.map((ora, index) =>
                                                                    <TaskSchedule courseAbreviere={ora.courseAbreviere}
                                                                                  courseName={ora.courseName}
                                                                                  courseType={ora.courseType}
                                                                                  hourStart={ora.hourStart}
                                                                                  hourEnd={ora.hourEnd}
                                                                                  classRoom={ora.courseClassRoom}
                                                                                  address={ora.courseAddress}
                                                                                  detailsAddress={ora.courseAddressDetails}
                                                                                  sessionFromBack={sessionFromBack}
                                                                                  navigation={navigation}
                                                                                  timestamp={timestamp}
                                                                                  key={index}/>)
                                                                :
                                                                (scheduleDay === 5 && afisareOrarInZiDeScoala(scheduleYear, scheduleMonth, scheduleDate, "SCHOOL") ?
                                                                        oraVineri.map((ora, index) =>
                                                                            <TaskSchedule courseAbreviere={ora.courseAbreviere}
                                                                                          courseName={ora.courseName}
                                                                                          courseType={ora.courseType}
                                                                                          hourStart={ora.hourStart}
                                                                                          hourEnd={ora.hourEnd}
                                                                                          classRoom={ora.courseClassRoom}
                                                                                          address={ora.courseAddress}
                                                                                          detailsAddress={ora.courseAddressDetails}
                                                                                          sessionFromBack={sessionFromBack}
                                                                                          navigation={navigation}
                                                                                          timestamp={timestamp}
                                                                                          key={index}/>)
                                                                        :
                                                                        (afisareOrarInZiDeScoala(scheduleYear, scheduleMonth, scheduleDate, "HOLIDAY") ?
                                                                                <View><Text style={[styles.textStyleOnFocus, {color: colors.myPink}]}>Holiday</Text></View>
                                                                                :
                                                                                (
                                                                                    afisareOrarInZiDeScoala(scheduleYear, scheduleMonth, scheduleDate, "EXAM") ?
                                                                                        (
                                                                                            exams.map((ex, index) =>(
                                                                                                <ExamCard courseAbreviere={ex.courseAbreviere} key={index} date={ex.date.substr(0, 10)}/>
                                                                                            ))
                                                                                        )
                                                                                        :
                                                                                       <View/>
                                                                                )




                                                                        )

                                                                )
                                                        )
                                                )
                                        )
                                )

                                :

                                assigsFiltered
                                    .map((item, index) => (
                                        <TaskAssignment courseAbreviere={item.courseAbreviere} deadline={item.dateLine}
                                                        status={item.status} assigId={item.id}
                                                        openOverlay="false" description={item.description} taskName={item.title}
                                                        key={index}/>
                                    ))


                            }

                        </View>
                    </ScrollView>
            </View>


            </View>

        </View>


    );
};


const styles = StyleSheet.create({
    categImageSchedule: {
        width: 110,
        height: 20,
        position: "relative",
        right: 5,
        bottom: -17
    },
    categImageAssig: {
        width: 130,
        height: 20,
        position: "relative",
        right: 5,
        bottom: -15
    },
    categoryContainer: {
        flexDirection: "row",
        position: "absolute",
        bottom: 90,
        //right:8,
        width: Dimensions.get("screen").width,
        height: 130,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    viewStyle: {
        flex: 0.6,
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 10,
        borderBottomColor: colors.loginScreenBackgroundColor,
    },
    textStyleOnBlur: {
        color: colors.backgroundCommonDark,
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },
    textStyleOnFocus: {
        color: colors.backgroundCommonDark,
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: 'center',
    },
    calendar: {
        flex: 30,
    },
    colorTest: {
        backgroundColor: colors.loginScreenBackgroundColor
    },
    aranjare: {
        flexDirection: 'column',
    }
});
