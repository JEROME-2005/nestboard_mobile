import React, {
  useMemo,
} from 'react';

import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  Wind,
  User,
} from 'lucide-react-native';

import Typography
  from '../../../../components/ui/Typography';

import {
  Colors,
} from '../../../../constant/colors';

import type {
  Room,
} from '../../../../types/properties';

type Props = {
  room: Room;
  price: string;
};

const RoomCard = ({
  room,
  price,
}: Props) => {
  const navigation: any =
    useNavigation();

  /*
   * Count seats that don't currently
   * have a tenant.
   */
  const availableSeats =
    useMemo(() => {
      return room.booking.filter(
        seat =>
          !seat.tenant ||
          seat.tenant.trim() === '',
      );
    }, [room.booking]);

  /*
   * Total seats.
   *
   * If booking data exists, use that.
   * Otherwise fall back to seatCapacity.
   */
  const totalSeats =
    room.booking.length > 0
      ? room.booking.length
      : room.seatCapacity;

  const occupiedSeats =
    Math.max(
      totalSeats -
        availableSeats.length,
      0,
    );

  const occupancyPercentage =
    totalSeats > 0
      ? Math.round(
          (occupiedSeats /
            totalSeats) *
            100,
        )
      : 0;

  const hasAvailableSeats =
    availableSeats.length > 0;

  const handleViewRoom =
    () => {
      if (
        !hasAvailableSeats
      ) {
        Alert.alert(
          'Room Full',
          'There are currently no available seats in this room.',
        );

        return;
      }

      /*
       * Navigate to the booking /
       * room-selection screen.
       *
       * The roomId is the important value
       * needed by ConfirmBooking.
       */
      navigation.navigate(
        'ConfirmBooking',
        {
          roomId:
            room.roomId,

          roomName:
            room.roomName,

          price,

          room,
        },
      );
    };

  return (
    <View
      style={styles.card}
    >
      {/* ROOM HEADER */}
      <View
        style={styles.header}
      >
        <View
          style={styles.titleContainer}
        >
          <Typography
            variant="h2"
            style={styles.roomName}
          >
            {room.roomName}
          </Typography>

          <Typography
            variant="h3"
            style={styles.price}
          >
            LKR {price} / seat / month
          </Typography>
        </View>

        <View
          style={styles.acBadge}
        >
          {room.hasAC ? (
            <>
              <Wind
                size={15}
                color={
                  Colors.PRIMARY_COLOR
                }
              />

              <Typography
                variant="caption"
                style={styles.acText}
              >
                AC
              </Typography>
            </>
          ) : (
            <Typography
              variant="caption"
              style={styles.acText}
            >
              None AC
            </Typography>
          )}
        </View>
      </View>

      {/* AVAILABILITY */}
      <View
        style={styles.availabilityRow}
      >
        <Typography
          variant="caption"
          style={styles.availabilityText}
        >
          {availableSeats.length}{' '}
          seats free
        </Typography>

        <Typography
          variant="caption"
          style={styles.availabilityText}
        >
          {occupancyPercentage}%
          {' '}
          filled
        </Typography>
      </View>

      {/* PROGRESS BAR */}
      <View
        style={styles.progressBackground}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.min(
                occupancyPercentage,
                100,
              )}%`,
            },
          ]}
        />
      </View>

      {/* SEAT SUMMARY */}
      <View
        style={styles.seatSummary}
      >
        <User
          size={17}
          color={
            Colors.SECONDARY_COLOR
          }
        />

        <Typography
          variant="caption"
          style={
            styles.seatSummaryText
          }
        >
          {availableSeats.length}{' '}
          of {totalSeats} seats
          available
        </Typography>
      </View>

      {/* VIEW ROOMS / BOOK */}
      <TouchableOpacity
        style={[
          styles.button,
          !hasAvailableSeats &&
            styles.disabledButton,
        ]}
        onPress={
          handleViewRoom
        }
        disabled={
          !hasAvailableSeats
        }
        activeOpacity={0.8}
      >
        <Typography
          variant="h3"
          style={
            styles.buttonText
          }
        >
          {hasAvailableSeats
            ? 'View Rooms'
            : 'No Seats Available'}
        </Typography>

        {hasAvailableSeats && (
          <Typography
            variant="h3"
            style={
              styles.arrow
            }
          >
            ›
          </Typography>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default RoomCard;

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor:
      Colors.WHITE,
    marginBottom: 18,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },

  titleContainer: {
    flex: 1,
  },

  roomName: {
    color: '#17172B',
    marginBottom: 8,
  },

  price: {
    color: '#17172B',
  },

  acBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFF0E9',
  },

  acText: {
    color: Colors.PRIMARY_COLOR,
    fontWeight: '600',
  },

  availabilityRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  availabilityText: {
    color: '#9293A7',
  },

  progressBackground: {
    height: 10,
    marginTop: 8,
    borderRadius: 5,
    backgroundColor: '#EEEEF0',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor:
      Colors.PRIMARY_COLOR,
  },

  seatSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
  },

  seatSummaryText: {
    color: '#6B7280',
  },

  button: {
    height: 56,
    marginTop: 20,
    borderRadius: 30,
    backgroundColor:
      Colors.PRIMARY_COLOR,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 28,
  },
});