import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import AuthStack
  from './AuthStack';

import AppStack
  from './AppStack';

const Stack =
  createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="AppStack"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="AppStack"
        component={AppStack}
      />

      <Stack.Screen
        name="AuthStack"
        component={AuthStack}
      />
    </Stack.Navigator>
  );
};

export default MainStack;