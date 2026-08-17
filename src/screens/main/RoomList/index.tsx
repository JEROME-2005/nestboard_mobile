import React from 'react';

import {
  Text,
} from 'react-native';

import {
  ActivityIndicator,
  View,
} from 'react-native';

import {
  useRoute,
} from '@react-navigation/native';

import RoomListHeader
  from './components/Header';

import RoomList
  from './components/RoomList';

import {
  Colors,
} from '../../../constant/colors';

import {
  useRoomTypeDetails,
} from '../../../hooks/useRoomTypeDetails';

const RoomTypeDetails = () => {
  const route: any =
    useRoute();

  const {
    roomTypeId,
    roomTypeName,
    location,
  } =
    route.params ?? {};

  const {
    roomType,
    loading,
    error,
  } =
    useRoomTypeDetails(
      roomTypeId,
    );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          Colors.WHITE,
      }}
    >
      <RoomListHeader
        location={
          location ?? ''
        }
        name={
          roomTypeName ??
          roomType?.name ??
          'Rooms'
        }
      />

      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent:
              'center',
            alignItems:
              'center',
          }}
        >
          <ActivityIndicator
            size="large"
            color={
              Colors.PRIMARY_COLOR
            }
          />
        </View>
      ) : error ? (
        <View
          style={{
            flex: 1,
            justifyContent:
              'center',
            alignItems:
              'center',
            padding: 24,
          }}
        >
          <Text
            style={{
              color: '#6B7280',
              textAlign: 'center',
            }}
          >
            {error}
          </Text>
        </View>
      ) : roomType ? (
        <RoomList
          roomType={
            roomType
          }
        />
      ) : null}
    </View>
  );
};

export default RoomTypeDetails;