'use strict'
import colors from "./colors";
import {StatusBar} from "react-native";

var React = require('react-native');

var{
    StyleSheet,
} = React;

module.exports = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: colors.backgroudCommon,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputNoFocus: {
        height: 40,
        width: 300,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: 20,
        color: colors.loginScreenTextColor,
        paddingHorizontal: 10,
        borderRadius: 20,
        borderWidth:1,
        borderColor: colors.myPink,
    },
    inputFocus: {
        height: 40,
        width: 300,
        backgroundColor: 'rgba(219, 45, 105, 0.3)',
        marginBottom: 20,
        color: colors.loginScreenTextColor,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    inputNoFocusMaps: {
        height: 40,
       // width: 300,
        backgroundColor: 'rgb(214, 162, 232)',
        marginBottom: 20,
        color: colors.white,
        paddingHorizontal: 10,
        borderRadius: 20,
        fontWeight: 'bold',
        marginLeft: 40,
    },
    inputFocusMaps: {
        height: 40,
       // width: 300,
        backgroundColor: 'rgb(214, 162, 232)',
        marginBottom: 20,
        color: colors.white,
        paddingHorizontal: 10,
        borderRadius: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#FAC748',
        fontWeight: 'bold',
        marginLeft: 40,
    },
    commonButton : {
        alignItems: 'center',
        backgroundColor: colors.myPink,
        padding: 10,
        marginBottom:10,
        borderRadius: 20,
    },
    textButtonCommon: {
        color: colors.white,
        fontWeight: 'bold',
    },
    navigationBar:{
        backgroundColor: colors.loginScreenBackgroundColor,
        padding: 6,
    },
    statusBar:{
        height: StatusBar.currentHeight,
    },
    labelText: {
        color: colors.backgroundCommonDark,
        fontWeight: 'bold',
        fontSize: 15,
    },
   /* actualText: {
        color: colors.backgroundCommonDark,
        fontSize: 20,
        fontWeight: 'bold',
    },*/
    actualText: {
        fontFamily:"montserrat",
        fontSize: 20,
    },
    actualSmallText:{

        fontSize: 17,
    }


});