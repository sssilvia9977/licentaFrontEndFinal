import * as React from "react";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback} from 'react-native';
import {Text, TextInput, View, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import {Button, ThemeProvider} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Input} from 'react-native-elements';
import colors from "../../assets/colors";
import commonStyle from "../../assets/style"
import {useState} from "react";
import {useEffect} from "react";
import axios from "axios";

export default function ({navigation, sendScheduleDate, sendScheduleDay, sessionFromBack, sendScheduleMonth, sendScheduleYear}) {

    const laboratory = {key: 'laboratory', color: 'red', selectedDotColor: 'blue'};
    const lecture = {key: 'lecture', color: 'blue', selectedDotColor: 'blue'};
    const seminary = {key: 'seminary', color: 'green'};

    const [initialMarkedDates, setInitialMarkedDates] = useState({});
    const [markedDates, setMarkedDates] = useState({});

    function structInCalendar(responseStructura) {
        let struct = responseStructura.data;  //am luat toate perioadele si pot sa fac .cescriebackend
        let calendarPeriod = {};

        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let daySelected = new Date().getDate();
        let currentDay = year + '-' + (month < 10 ? '0' + month : month) + '-' + (daySelected < 10 ? '0' + daySelected : daySelected);

        struct.forEach(str => {

            let end = new Date(str.periodEnd.split("T")[0]);
            let type = str.schoolPeriodType;

            let start = new Date(str.periodStart.split("T")[0]);
            for (; start <= end; start.setDate(start.getDate() + 1)) {
                let day = start.getDate();
                let month = start.getMonth() + 1;
                let year = start.getFullYear();
                let structDay = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)

                calendarPeriod[structDay] = {
                    customStyles: {
                        container: {
                            backgroundColor: str.schoolPeriodType === 'EXAM' ? 'red' : 'white',
                            elevation: str.schoolPeriodType === "HOLIDAY" ? 2 : 0
                        },
                        text: {
                            color: currentDay === structDay? 'blue' : 'black'
                        }
                    }
                };

            }


        });
        setMarkedDates(calendarPeriod);
        setInitialMarkedDates(calendarPeriod);

    }

    useEffect(() => {
        (async () => {
            const responseStructura = await axios.post("http://192.168.43.239:8080/getStructAnUniv", {
                sessionId: sessionFromBack,
            });
            structInCalendar(responseStructura);

        })();
    }, [navigation]);


    function sendDayAndDate(day) {
        //   console.log('selected day', day);
        sendScheduleDay(new Date(day.dateString).getDay());
        sendScheduleDate(new Date(day.dateString).getDate());
        sendScheduleMonth(new Date(day.dateString).getMonth());
        sendScheduleYear(new Date(day.dateString).getFullYear());

        let year = new Date(day.dateString).getFullYear();
        let month = new Date(day.dateString).getMonth() + 1;
        let daySelected = new Date(day.dateString).getDate();
        let selectedDay = year + '-' + (month < 10 ? '0' + month : month) + '-' + (daySelected < 10 ? '0' + daySelected : daySelected);

        setMarkedDates({
            ...initialMarkedDates, [selectedDay]: {
                customStyles: {
                    container: {
                        backgroundColor: colors.loginScreenBackgroundColor,
                    },
                    text: {
                        color: 'white',
                        fontWeight: 'bold'
                    }
                }
            }
        });

    }


    return (

        <View style={styles.container}>

            <View>

                <CalendarList style={styles.calendar}
                              firstDay={1}
                    // Callback which gets executed when visible months change in scroll view. Default = undefined
                              onVisibleMonthsChange={(months) => {
                                  console.log('now these months are visible', months);
                              }}
                              pastScrollRange={22}
                              futureScrollRange={12}
                    // Enable or disable scrolling of calendar list
                              scrollEnabled={true}
                    // Enable or disable vertical scroll indicator. Default = false
                              showScrollIndicator={false}
                              onDayPress={(day) => {
                                  sendDayAndDate(day)
                              }}
                    // Enable horizontal scrolling, default = false
                              horizontal={true}
                    // Enable paging on horizontal, default = false
                              pagingEnabled={true}
                              markingType={'custom'}
                              markedDates={markedDates}

                />
            </View>

        </View>

    );
}


const styles = StyleSheet.create({
    container: {
        height: '50%',
        width: Dimensions.get('window').width,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendar: {
        //  transform: [{scale: 0.90}],
        height: '40%',
        flex: 0.2,
    }
});
