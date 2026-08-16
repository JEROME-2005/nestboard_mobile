import React from 'react';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  Home,
  Heart,
  User,
} from 'lucide-react-native';

import HomeScreen from '../../screens/main/Home';
import Favourites from '../../screens/main/Favorite';
import Profile from '../../screens/main/Profile';

import { Colors } from '../../constant/colors';

const Tab =
  createBottomTabNavigator();

const TabScreens = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor:
          Colors.PRIMARY_COLOR,

        tabBarInactiveTintColor:
          Colors.ICON_GRAY,

        tabBarHideOnKeyboard: true,

        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({
            color,
            size,
          }) => (
            <Home
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Favourites"
        component={Favourites}
        options={{
          tabBarIcon: ({
            color,
            size,
          }) => (
            <Heart
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({
            color,
            size,
          }) => (
            <User
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabScreens;