import React, { useEffect, useState } from 'react';
import {
  LinkingOptions,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';

import SplashScreen from '../screens/splash';
import MainStack from './MainStack';
import { checkStatus } from '../util/localStorage';
import { initAuth } from '../store/authSlice';

const Stack = createNativeStackNavigator();

const linking: LinkingOptions<any> = {
  prefixes: [
    'nestboard://',
  ],

  config: {
    screens: {
      MainStack: {
        screens: {
          AppStack: {
            screens: {
              PropertyDetails: 'property/:pid',
              Profile: 'profile/user/:id',
            },
          },
        },
      },
    },
  },
};

const RootStack = () => {
  const [authLoading, setAuthLoading] = useState(true);
  const [apiReady, setApiReady] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    checkStatus().then(refreshToken => {
      if (refreshToken) {
        dispatch(
          initAuth({
            refreshToken,
          }),
        );
      }

      setAuthLoading(false);
    });
  }, [dispatch]);

  if (authLoading || !apiReady) {
    return (
      <SplashScreen
        onReady={() => setApiReady(true)}
      />
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="MainStack"
          component={MainStack}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;