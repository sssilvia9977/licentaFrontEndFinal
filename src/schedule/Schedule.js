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

const {width, height} = Dimensions.get('window');

export default function Schedule({navigation}) {


    const [onFocusPickAssig, setOnFocusPickAssig] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);


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

            <ScheduleForm style={styles.calendar} navigation={navigation}/>

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


                    {onFocusPickAssig === false ? <TaskSchedule courseAbreviere="OS" courseType="Lec" hourStart="08:00" hourEnd="10:00" classRoom="F"
                        address="Strada George Baritiu"/> :   <TaskAssignment courseAbreviere="DB" deadline="Marti"   taskName="Make some views"/>
                    }

                    {onFocusPickAssig === false ? <TaskSchedule courseAbreviere="PSN" courseType="Lab" hourStart="12:00" hourEnd="14:00"
                                                                classRoom="205 lab" address="Strada Observator"/>:  <TaskAssignment courseAbreviere="OS" deadline="Vineri"   taskName="Learn Threads"/>
                    }

                    {onFocusPickAssig === false ?  <TaskSchedule courseAbreviere="OS" courseType="Sem" hourStart="14:00" hourEnd="16:00"
                                                                 classRoom="101" address="Strada Dorobantilor 72"/>:
                        <TaskAssignment courseAbreviere="OS" deadline="Vineri"   taskName="Learn Threads"/>
                    }

                    {onFocusPickAssig === false ?   <TaskSchedule courseAbreviere="OS" courseType="Lec" hourStart="08:00" hourEnd="10:00" classRoom="F"
                                                                  address="Strada George Baritiu"/> :   <TaskAssignment courseAbreviere="DB" deadline="Marti"   taskName="Make some views"/>
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
