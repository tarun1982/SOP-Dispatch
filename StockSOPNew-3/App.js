/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import ScanBarCode from './ScanBarcode';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default class App extends Component {
	render() {
		return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen}/>
        <Stack.Screen options={{headerShown: false, gestureEnabled: false}} name="Home" component={HomeScreen} />
        <Stack.Screen name="ScanBarCode" component={ScanBarCode} />
      </Stack.Navigator>
    </NavigationContainer>
    ) 
	}
}

