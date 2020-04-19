import 'react-native-gesture-handler';

import React from 'react';
import { StyleSheet, Text, View , Dimensions} from 'react-native';
import AccessMap from "./myMaps/AccessMap";
import LoginScreen from "./src/LoginScreen";
import Schedule from "./src/schedule/Schedule";
import MyProfile from "./src/MyProfile/MyProfile";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import colors from './assets/colors'
import {createDrawerNavigator} from "react-navigation-drawer";
import MyCourses from "./src/MyProfile/MyCourses";
import MyCourseDetailsTemplate from "./src/MyProfile/MyCourseDetailsTemplate";
import AddAssignment from "./src/schedule/AddAssignment";
import Menu from "./src/Menu";
import GoToCourse from "./myMaps/GoToCourse";



export default function App() {

  return (
      <AppContainer/>
  );

}


const AppDrawerNavigator = createDrawerNavigator({
  Login: {screen : LoginScreen},
  Schedule: {screen: Schedule},
  AccessMap: {screen: AccessMap},
  MyProfile: {screen: MyProfile},
  MyCourses: {screen: MyCourses},
  MyCourseDetailsTemplate:{screen: MyCourseDetailsTemplate},
  AddAssignment:{screen: AddAssignment},
});


const AppNavigator = createStackNavigator({

  Login: {
    screen: LoginScreen,
    navigationOptions:{
      header: null
    }
  },
  Menu:{
    screen: Menu,
    navigationOptions:{
      header: null
    }
  },
  GoToCourse:{
    screen: GoToCourse,
    navigationOptions:{
      header: null
    }
  },
  AddAssignment:{
    screen: AddAssignment ,
    navigationOptions:{
      header: null
    }
  },
  MyCourseDetailsTemplate: {
    screen: MyCourseDetailsTemplate,
    navigationOptions:{
      header: null
    }
  },
  MyCourses: {
    screen: MyCourses,
    navigationOptions:{
      header: null
    }
  },
  MyProfile:{
    screen: MyProfile,
    navigationOptions:{
      header: null
    }
  },

  Schedule: {
    screen: Schedule,
    navigationOptions: {
      header: null
    }
  },
  AccessMap: AccessMap,
},{
  headerMode: 'screen'
});

const AppContainer = createAppContainer(AppNavigator);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerStyle:{
    backgroundColor: colors.backgroudCommon,
    height:40,
  }

});
