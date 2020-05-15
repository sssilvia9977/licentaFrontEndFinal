import {Image, StyleSheet, ImageBackground, Text, View, TouchableOpacity, TouchableWithoutFeedback} from "react-native";
import React, {useState} from "react";
import colors from "../../assets/colors";
import {FontAwesome5} from "@expo/vector-icons";
import axios from "axios";
import {Divider, Input, Overlay} from "react-native-elements";
import DatePicker from "react-native-datepicker";
import commonStyle from "../../assets/style";


let assigCard = require("../../assets/AssignmentCard.png");
let assigIcon = require("../../assets/AssignmentIcon.png");
let deadLine = require("../../assets/DeadlineIcon.png");

export default function (props) {

    //const myColorStatus = props.status;
    const [myColor, setMyColor] = useState(props.status === "COMPLETED" );
    const [openMenu, setOpenMenu] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [heightOver, setHeightOver] = useState(100);

    const [datePicker, setDatePicker] = useState(props.deadline);
    const [courseChoise, setCourseChoise] = useState([{value: "banana"}]);
    const [assigTitle, setAssigTitle] = useState(props.courseAbreviere);
    const [assigDesc, setAssigDesc] = useState(props.description);

    const [openOverlayFromSchedule, setOpenOverlayFromSchedule]= useState(props.openOverlay.length === 4);

    function changeAssigStatus() {
        setMyColor(!myColor);
        // console.log(props.assigId);
        axios.post("http://192.168.43.239:8080/setAssigStatus", {
            sessionId: props.sessionFromBack,
            assigId: props.assigId
        })
    }

    function updateAssigAndNavigate() {
        // console.log("Id of assig longed presses: " + props.assigId);

        axios.post("http://192.168.43.239:8080/updateAssig", {
            sessionId: props.sessionFromBack,
            assigId: props.assigId,
            assigTitle: assigTitle,
            assigDeadline: datePicker,
            assigDescription: assigDesc
        });
        //TODO add courseName cand ne trebuie
        let assignment = {title: assigTitle, dateLine: datePicker, description: assigDesc, id: props.assigId};
        props.updateAssignment(assignment);
        props.navigation.navigate("MyCourseDetailsTemplate", {newIsVisible : false});
        setOpenMenu(false);
        setOpenUpdate(false);
        setHeightOver(100);
    }

    function updateAssig() {
        setOpenUpdate(true);
        setHeightOver(370);
    }

    function deleteAssig() {
        //  console.log("Id of assig to DELETE: " + props.assigId);
        setOpenMenu(false);
        props.deleteAssignment(props.assigId);
        axios.post("http://192.168.43.239:8080/deleteAssig", {
            sessionId: props.sessionFromBack,
            assigId: props.assigId
        });
        props.navigation.navigate("MyCourseDetailsTemplate");
    }

    function setDatee(date) {
        setDatePicker(date);
        console.log(date);
    }



    return(

        <View style={{alignItems:"center", alignContent:"flex-start"}}>
            <Overlay isVisible={openOverlayFromSchedule ? openMenu : false}
                     borderRadius={9}
                     height={heightOver}
                     containerStyle={{flex: 1, justifyContent: "space-between"}}
                     windowBackgroundColor="rgba(214, 162, 232, .9)"
                     overlayBackgroundColor={colors.backgroudCommon}
                     onBackdropPress={() => {
                         setOpenMenu(false);
                         setHeightOver(100);
                         setOpenUpdate(false)
                     }}>

                {
                    openUpdate ?
                        <View>
                            <Input
                                style={{width: 200, paddingTop: 30, paddingBottom: 20}}
                                label="Assignment title"
                                defaultValue={props.courseAbreviere}
                                onChangeText={text => setAssigTitle(text === '' ? props.courseAbreviere : text) }/>


                            <View>
                                <Text
                                    style={{fontWeight: 'bold', color: "#698a96", paddingTop: 30, fontSize: 15}}> Choose deadline</Text>
                                <DatePicker
                                    style={{width: 200, paddingTop: 9, paddingBottom: 20}}
                                    date={datePicker}
                                    mode="date" placeholder="select date" format="DD-MM-YYYY" minDate="01-09-2018" maxDate="12-06-2029" confirmBtnText="Confirm" cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0
                                        },
                                        dateInput: {
                                            marginLeft: 36
                                        }
                                    }}
                                    onDateChange={(date) => setDatee(date)}
                                />
                            </View>

                            <Input
                                multiline={true}
                                style={{paddingTop: 30, width: 200,}}
                                label="Assignment description"
                                defaultValue={props.description}
                                onChangeText={text => setAssigDesc(text === '' ? props.description : text)}/>

                            <TouchableOpacity
                                style={[commonStyle.commonButton, {marginTop: 50}]}
                                onPress={() => updateAssigAndNavigate()}
                            >
                                <Text style={commonStyle.textButtonCommon}>Update assignment</Text>
                            </TouchableOpacity>

                        </View>

                        :

                        <View>
                            <TouchableOpacity
                                onPress={() => updateAssig()}>
                                <Text style={commonStyle.actualText}>Update</Text>
                            </TouchableOpacity>
                            <Divider style={{backgroundColor: colors.myPink, height: 2, marginTop: 10}}/>
                            <TouchableOpacity
                                onPress={() => deleteAssig()}>
                                <Text style={[commonStyle.actualText, {
                                    paddingTop: 10,
                                    color: colors.myPink
                                }]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                }
            </Overlay>


            <TouchableWithoutFeedback onLongPress={() => {setOpenMenu(true); }}>
                <ImageBackground source={assigCard} style={{width:325, height: 145}}>

                    <View style={{marginTop: 22, marginLeft:35, flexDirection:"row", justifyContent:"space-between"}}>
                        <View style={{flexDirection:"column"}}>
                            <View style={{flexDirection: "row"}}>
                                <Image source={assigIcon} style={styles.littleIcon}/>
                                <Text style={styles.textStyle}>{props.courseAbreviere}</Text>
                            </View>

                            <View style={{flexDirection: "row"}}>
                                <Image source={deadLine} style={styles.littleIcon}/>
                                <Text style={styles.textStyle}>{props.deadline}</Text>
                            </View>

                            {
                                props.taskName == null ?
                                    <Text style={styles.textStyle}>{props.description}</Text> :
                                    <View>
                                        <Text style={commonStyle.actualSmallText}>{props.taskName}</Text>
                                        <Text style={styles.textStyle}>{props.description}</Text>
                                    </View>
                            }

                        </View>


                            <FontAwesome5 style={{width: "13%", paddingLeft: 6, paddingTop: 5, marginRight:10, marginTop: 10}} name="check-circle" size={25}
                                          color={myColor === false ? colors.gray : colors.green}
                                          onPress={() => changeAssigStatus()}/>
                    </View>
                </ImageBackground>

            </TouchableWithoutFeedback>


        </View>


    );

}


const styles = StyleSheet.create({
    textStyle: {
        fontFamily: "montserrat",
        color: colors.myPink,
        fontSize: 13,
        marginTop: 9,
        marginLeft: 8
    },
    littleIcon: {
        width: 27,
        height: 27,
        marginLeft: 6,
    },

})