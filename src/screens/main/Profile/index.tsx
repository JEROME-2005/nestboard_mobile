import React from 'react';

import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  CalendarDays,
} from 'lucide-react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import Typography
  from '../../../components/ui/Typography';

import {
  Colors,
} from '../../../constant/colors';

const Profile = () => {
  const navigation: any =
    useNavigation();

  return (
    <View style={styles.container}>
      <Typography variant="h1">
        Profile
      </Typography>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate(
            'MyBookings',
          )
        }
      >
        <CalendarDays
          size={22}
          color={
            Colors.SECONDARY_COLOR
          }
        />

        <Typography variant="h3">
          My Bookings
        </Typography>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.WHITE,
    padding: 20,
    gap: 24,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    borderRadius: 16,
    backgroundColor:
      Colors.WHITE,
    elevation: 2,
  },
});