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

export default function ({navigation}) {

    const laboratory = {key:'laboratory', color: 'red', selectedDotColor: 'blue'};
    const lecture = {key:'lecture', color: 'blue', selectedDotColor: 'blue'};
    const seminary = {key:'seminary', color: 'green'};


    return(

        <View style={styles.container}>

            <View >
                <CalendarList style={styles.calendar}

                              firstDay={1}
                    // Callback which gets executed when visible months change in scroll view. Default = undefined
                              onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
                    // Max amount of months allowed to scroll to the past. Default = 50
                              pastScrollRange={12}
                    // Max amount of months allowed to scroll to the future. Default = 50
                              futureScrollRange={12}
                    // Enable or disable scrolling of calendar list
                              scrollEnabled={true}
                    // Enable or disable vertical scroll indicator. Default = false
                              showScrollIndicator={false}
                              onDayPress={(day) => {console.log('selected day', day)}}
                    // Enable horizontal scrolling, default = false
                              horizontal={true}
                    // Enable paging on horizontal, default = false
                              pagingEnabled={true}
                              markedDates={{
                                  '2020-03-25': {dots: [laboratory,lecture, seminary], selected: true, selectedColor: 'red'},
                                  '2020-03-26': {dots: [laboratory,lecture]}
                              }}
                              markingType={'multi-dot'}
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
