import {
  View,
  TouchableOpacity,
} from 'react-native';

import React, {
  useState,
} from 'react';

import Typography
  from '../../../../components/ui/Typography';

import {
  Colors,
} from '../../../../constant/colors';

import RegularButton
  from '../../../../components/ui/RegularButton';

import {
  Room,
} from '../../../../types/properties';

import {
  Plus,
} from 'lucide-react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  useDispatch,
} from 'react-redux';

import {
  updateBookingDetails,
} from '../../../../store/bookingSlice';

type Props = {
  room: Room;
  price: string;
};

const RoomCard = ({
  room,
  price,
}: Props) => {
  const [
    selectedSeat,
    setSelectedSeat,
  ] = useState<
    number | null
  >(null);

  const navigation: any =
    useNavigation();

  const dispatch =
    useDispatch();

  const availableSeats =
    room.booking.filter(
      seat =>
        !seat.tenant,
    );

  const bookThisSeat = () => {
    if (
      selectedSeat === null
    ) {
      return;
    }

    dispatch(
      updateBookingDetails({
        date: '',
        duration: 0,
        roomId: room.roomId,
        roomName: room.roomName,
        seatIndex: selectedSeat,
        pricePerSeat: price,
      }),
    );

    navigation.navigate(
      'ConfirmBooking',
    );
  };

  const extractInitials = (
    tenant: string,
  ) => {
    if (!tenant) {
      return '';
    }

    const parts =
      tenant.trim().split(' ');

    if (parts.length === 1) {
      return parts[0]!
        .charAt(0)
        .toUpperCase();
    }

    return (
      parts[0]!.charAt(0) +
      parts[1]!.charAt(0)
    ).toUpperCase();
  };

  return (
    <View
      style={{
        borderRadius: 16,
        elevation: 2,
        backgroundColor:
          Colors.WHITE,
        padding: 24,
        gap: 16,
      }}
    >
      <Typography variant="h2">
        {room.roomName}
      </Typography>

      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        {room.booking.map(
          seat => {
            const isAvailable =
              !seat.tenant;

            const selected =
              selectedSeat ===
              seat.seatIndex;

            if (!isAvailable) {
              return (
                <View
                  key={
                    seat.seatIndex
                  }
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor:
                      '#704F3C',
                    justifyContent:
                      'center',
                    alignItems:
                      'center',
                    borderRadius: 100,
                  }}
                >
                  <Typography variant="button">
                    {extractInitials(
                      seat.tenant,
                    )}
                  </Typography>
                </View>
              );
            }

            return (
              <TouchableOpacity
                key={
                  seat.seatIndex
                }
                onPress={() =>
                  setSelectedSeat(
                    seat.seatIndex,
                  )
                }
                style={{
                  width: 48,
                  height: 48,
                  justifyContent:
                    'center',
                  alignItems:
                    'center',
                  borderRadius: 100,
                  borderColor:
                    selected
                      ? Colors.PRIMARY_COLOR
                      : Colors.BORDER_GRAY,
                  borderWidth:
                    selected
                      ? 2
                      : 1.6,
                  backgroundColor:
                    selected
                      ? `${Colors.PRIMARY_COLOR}20`
                      : 'transparent',
                }}
              >
                <Plus
                  color={
                    selected
                      ? Colors.PRIMARY_COLOR
                      : Colors.BORDER_GRAY
                  }
                  width={20}
                  height={20}
                />
              </TouchableOpacity>
            );
          },
        )}
      </View>

      <View>
        {room.booking.map(
          seat =>
            seat.tenant ? (
              <Typography
                key={
                  seat.seatIndex
                }
                variant="subtitle"
                color={
                  Colors.TEXT_GRAY
                }
              >
                {seat.tenant}
              </Typography>
            ) : null,
        )}
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent:
            'space-between',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor:
              '#D1FAE5',
            height: 40,
            justifyContent:
              'center',
            alignItems:
              'center',
            paddingHorizontal: 16,
            borderRadius: 100,
          }}
        >
          <Typography color="#10B981">
            {availableSeats.length}{' '}
            Available
          </Typography>
        </View>

        <RegularButton
          disable={
            selectedSeat === null
          }
          text="Book this seat"
          onPress={
            bookThisSeat
          }
          Icon={null}
        />
      </View>
    </View>
  );
};

export default RoomCard;