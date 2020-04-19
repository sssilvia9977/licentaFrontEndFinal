import * as React from "react";

import axios from 'axios';
import {Button, StyleSheet, Text, View, TouchableOpacity, Dimensions, StatusBar, ScrollView} from "react-native";
import * as Permissions from "expo-permissions";
import {useState} from "react";
import commonStyle from "../../assets/style"
import LoginScreenForm from "../LoginScreenForm";
import colors from "../../assets/colors";
import ScheduleForm from "./ScheduleCalendarForm";
import * as DocumentPicker from 'expo-document-picker';
import TaskSchedule from "./TaskSchedule";
import TaskAssignment from "./TaskAssignment";
import {Overlay} from "react-native-elements";
import Menu from "../Menu";
import {useEffect} from "react";

const {width, height} = Dimensions.get('window');

export default function Schedule({navigation}) {

    const sessionFromBack = navigation.getParam('sessionFromBack', '0');

    const [onFocusPickAssig, setOnFocusPickAssig] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    const [scheduleDate, setScheduleDate] = useState();
    const [scheduleDay, setScheduleDay] = useState(new Date().getDay());   // 0 e duminica

    const [oraLuni, setOraLuni] = useState([]);
    const [oraMarti, setOraMarti] = useState([]);
    const [oraMiercuri, setOraMiercuri] = useState([]);
    const [oraJoi, setOraJoi] = useState([]);
    const [oraVineri, setOraVineri] = useState([]);

    const [structInCalendar, setStructInCalendar] = useState();



    useEffect(() => {

        (async () => {
           /*  const responseAssig = await axios.post("http://192.168.43.239:8080/getAssigsUntilDay", {
                  sessionId: sessionFromBack,
                  scheduleDate: scheduleDate,
             });*/

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
                if(ora.day == "Monday")         setOraLuni(oraLuni => [...oraLuni, ora]);
                else if(ora.day == "Tuesday")   setOraMarti(oraMarti => [...oraMarti, ora]);
                else if(ora.day == "Wednesday") setOraMiercuri(oraMiercuri => [...oraMiercuri, ora]);
                else if(ora.day == "Thursday")  setOraJoi(oraJoi => [...oraJoi, ora]);
                else if(ora.day == "Friday")    setOraVineri(oraVineri => [...oraVineri, ora]);
            });
//---------------------------------------------------------------------------------------------------------





        })();
    }, [navigation]);

    //TODO: 1 am sa colorez in functie de perioada  2  apoi am sa iau din orar pt luni marti etc 3 sa iau assig pt acele date
    //afisez assigurile mereu pana la deadline ul lor


    return (

        <View style={styles.container}>
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

            <ScheduleForm  style={styles.calendar} navigation={navigation} sendScheduleDay={setScheduleDay} sendScheduleDate={setScheduleDate} sessionFromBack={sessionFromBack}/>

            <ScrollView>
                <View style={styles.aranjare}>
                    <View style={styles.viewStyle}>
                        <TouchableOpacity
                            onPress={() => setOnFocusPickAssig(false)}>
                            <Text style={onFocusPickAssig === false ? styles.textStyleOnFocus : styles.textStyleOnBlur}>
                                Schedule</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setOnFocusPickAssig(true)}>
                            <Text style={onFocusPickAssig === true ? styles.textStyleOnFocus : styles.textStyleOnBlur}
                            >Assignments</Text>
                        </TouchableOpacity>


                </View>

                        {onFocusPickAssig == false ?

                            (scheduleDay == 1  ?
                                    oraLuni.map((ora, index) =>
                                        <TaskSchedule courseAbreviere={ora.courseAbreviere} courseType={ora.courseType}
                                                      hourStart={ora.hourStart} hourEnd={ora.hourEnd} classRoom={ora.courseClassRoom}
                                                      address={ora.courseAddress} detailsAddress = {ora.courseAddressDetails} key = {index}/> )

                                    :

                                    (scheduleDay == 2  ?
                                            oraMarti.map((ora, index) =>
                                                <TaskSchedule courseAbreviere={ora.courseAbreviere} courseType={ora.courseType}
                                                              hourStart={ora.hourStart} hourEnd={ora.hourEnd} classRoom={ora.courseClassRoom}
                                                              address={ora.courseAddress} detailsAddress = {ora.courseAddressDetails}  key = {index} /> )
                                            :
                                            (scheduleDay == 3  ?
                                                    oraMiercuri.map((ora, index) =>
                                                        <TaskSchedule courseAbreviere={ora.courseAbreviere} courseType={ora.courseType}
                                                                      hourStart={ora.hourStart} hourEnd={ora.hourEnd} classRoom={ora.courseClassRoom}
                                                                      address={ora.courseAddress} detailsAddress = {ora.courseAddressDetails}  key = {index} /> )
                                                    :
                                                    (scheduleDay == 4  ?
                                                            oraJoi.map((ora, index) =>
                                                                <TaskSchedule courseAbreviere={ora.courseAbreviere} courseType={ora.courseType}
                                                                              hourStart={ora.hourStart} hourEnd={ora.hourEnd} classRoom={ora.courseClassRoom}
                                                                              address={ora.courseAddress} detailsAddress = {ora.courseAddressDetails}  key = {index} /> )
                                                            :

                                                            (scheduleDay == 5  ?
                                                                    oraVineri.map((ora, index) =>
                                                                        <TaskSchedule courseAbreviere={ora.courseAbreviere} courseType={ora.courseType}
                                                                                      hourStart={ora.hourStart} hourEnd={ora.hourEnd} classRoom={ora.courseClassRoom}
                                                                                      address={ora.courseAddress} detailsAddress = {ora.courseAddressDetails}  key = {index}/> )

                                                                    :
                                                                    <View></View>
                                                            )
                                                    )
                                            )
                                    )
                            )

                            :

                            <TaskAssignment courseAbreviere="DB" deadline="Marti"   taskName="Make some views"/>

                        }

                </View>
            </ScrollView>

        </View>


    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroudCommon,
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
        flex: 1,
        flexDirection: 'column',
        paddingBottom: 20,
    }
});
