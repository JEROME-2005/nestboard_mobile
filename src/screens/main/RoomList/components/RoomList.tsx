import React from 'react';

import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import Typography
  from '../../../../components/ui/Typography';

import type {
  RoomType,
} from '../../../../types/properties';

import RoomCard
  from './RoomCard';

type Props = {
  roomType: RoomType;
};

const RoomList = ({
  roomType,
}: Props) => {
  const rooms =
    roomType.rooms ?? [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <View
        style={styles.header}
      >
        <Typography variant="h1">
          Available Rooms
        </Typography>

        <Typography
          variant="caption"
          style={styles.subtitle}
        >
          Select a room to continue
          with your booking.
        </Typography>
      </View>

      {rooms.length === 0 ? (
        <View
          style={styles.empty}
        >
          <Typography variant="h3">
            No rooms available
          </Typography>

          <Typography
            variant="caption"
            style={styles.emptyText}
          >
            There are currently no
            rooms available for this
            room type.
          </Typography>
        </View>
      ) : (
        rooms.map(room => (
          <RoomCard
            key={
              room.roomId ??
              room.id
            }
            room={room}
            price={
              roomType.pricePerMonth
            }
          />
        ))
      )}
    </ScrollView>
  );
};

export default RoomList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 120,
  },

  header: {
    marginBottom: 20,
  },

  subtitle: {
    marginTop: 6,
    color: '#9293A7',
  },

  empty: {
    padding: 30,
    borderRadius: 18,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },

  emptyText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#9293A7',
  },
});