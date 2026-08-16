import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  Bell,
  Heart,
  Home,
  User,
} from 'lucide-react-native';

import HomeScreen
  from '../../screens/main/Home';

import Favourites
  from '../../screens/main/Favorite';

import Profile
  from '../../screens/main/Profile';

import {
  Colors,
} from '../../constant/colors';

import {
  NotificationsAPI,
} from '../../api/notifications';

const Tab =
  createBottomTabNavigator();

const ProfileTabIcon = ({
  color,
  size,
}: {
  color: string;
  size: number;
}) => {
  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  useEffect(() => {
    const loadUnreadCount =
      async () => {
        try {
          const notifications =
            await NotificationsAPI.getAll();

          setUnreadCount(
            notifications.filter(
              item => !item.isRead,
            ).length,
          );
        } catch (error) {
          console.error(
            'Unable to load notification count:',
            error,
          );
        }
      };

    loadUnreadCount();

    const interval =
      setInterval(
        loadUnreadCount,
        30000,
      );

    return () =>
      clearInterval(
        interval,
      );
  }, []);

  return (
    <View>
      <User
        color={color}
        size={size}
      />

      {unreadCount > 0 ? (
        <View style={styles.badge}>
          <Bell
            size={9}
            color="#FFFFFF"
          />
        </View>
      ) : null}
    </View>
  );
};

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
            <ProfileTabIcon
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

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -7,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      Colors.PRIMARY_COLOR,
    borderWidth: 2,
    borderColor:
      Colors.WHITE,
  },
});