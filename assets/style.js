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
    },
    inputFocus: {
        height: 40,
        width: 300,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: 20,
        color: colors.loginScreenTextColor,
        paddingHorizontal: 10,
        borderRadius: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#FAC748',
    },
    commonButton : {
        alignItems: 'center',
        backgroundColor: colors.buttonCommon,
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
    actualText: {
        color: colors.backgroundCommonDark,
        fontSize: 20,
        fontWeight: 'bold',
    },
    actualSmallText:{

        fontSize: 17,
    }


});