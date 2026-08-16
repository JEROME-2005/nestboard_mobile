import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Alert,
  View,
} from 'react-native';

import {
  Picker,
} from '@react-native-picker/picker';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  useSelector,
  useDispatch,
} from 'react-redux';

import dayjs from 'dayjs';

import {
  Lock,
} from 'lucide-react-native';

import ConfirmScreenHeader
  from './components/Header';

import Typography
  from '../../../components/ui/Typography';

import RegularButton
  from '../../../components/ui/RegularButton';

import {
  RootState,
} from '../../../store/store';

import {
  Colors,
} from '../../../constant/colors';

import {
  BookingAPI,
} from '../../../api/bookings';

import {
  formatNumberIntoCurrency,
} from '../../../util/common';

const Months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const currentYear =
  new Date().getFullYear();

const Years = [
  currentYear,
  currentYear + 1,
  currentYear + 2,
];

const ConfirmBooking = () => {
  const navigation: any =
    useNavigation();

  const dispatch =
    useDispatch();

  const currentProperty =
    useSelector(
      (
        state: RootState,
      ) =>
        state.property
          .currentProperty,
    );

  const data =
    useSelector(
      (
        state: RootState,
      ) =>
        state.booking.data,
    );

  const roomId =
    data?.roomId;

  const roomName =
    data?.roomName;

  const seatIndex =
    data?.seatIndex;

  const pricePerSeat =
    Number(
      data?.pricePerSeat ?? 0,
    );

  const [
    fromDate,
    setFromDate,
  ] = useState(
    `${currentYear}-${Months[0]}`,
  );

  const [
    toDate,
    setToDate,
  ] = useState(
    `${currentYear}-${Months[2]}`,
  );

  const [
    booking,
    setBooking,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const duration =
    useMemo(() => {
      const start =
        dayjs(
          fromDate,
          'YYYY-MMM',
        );

      const end =
        dayjs(
          toDate,
          'YYYY-MMM',
        );

      const value =
        end.diff(
          start,
          'month',
        );

      return Math.max(
        value,
        0,
      );
    }, [
      fromDate,
      toDate,
    ]);

  const total =
    useMemo(
      () =>
        (
          pricePerSeat *
          duration
        ).toFixed(2),
      [
        pricePerSeat,
        duration,
      ],
    );

  useEffect(() => {
    if (
      duration === 0 &&
      fromDate !== toDate
    ) {
      setToDate(fromDate);
    }
  }, [
    duration,
    fromDate,
    toDate,
  ]);

  const bookNow = async () => {
    if (
      !roomId ||
      seatIndex === undefined ||
      seatIndex === null
    ) {
      return;
    }

    if (duration <= 0) {
      Alert.alert(
        'Invalid lease',
        'Please select a valid lease period.',
      );
      return;
    }

    setBooking(true);
    setError(null);

    try {
      const booking =
        await BookingAPI.createBooking(
          roomId,
          seatIndex,
          dayjs(
            fromDate,
            'YYYY-MMM',
          ).format(
            'YYYY-MM',
          ),
          duration,
          Number(total),
        );

      if (
        booking.status ===
        'PENDING'
      ) {
        const confirmed =
          await BookingAPI.confirmBooking(
            booking.id,
          );

        if (
          confirmed.status ===
          'CONFIRMED'
        ) {
          Alert.alert(
            'Booking confirmed',
            'Your seat has been successfully reserved.',
            [
              {
                text: 'View My Bookings',
                onPress: () =>
                  navigation.navigate(
                    'MyBookings',
                  ),
              },
            ],
          );
        }
      }
    } catch (err: any) {
      const status =
        err?.response?.status;

      if (
        status === 409
      ) {
        setError(
          'This seat is no longer available. Please choose another seat.',
        );

        Alert.alert(
          'Seat unavailable',
          'This seat was taken before your booking was completed. Please choose another available seat.',
        );
      } else {
        setError(
          'Unable to complete the booking. Please try again.',
        );

        Alert.alert(
          'Booking failed',
          'Unable to complete your booking. Please try again.',
        );
      }
    } finally {
      setBooking(false);
    }
  };

  return (
    <View
      style={{
        backgroundColor:
          Colors.WHITE,
        padding: 16,
        flex: 1,
        gap: 16,
      }}
    >
      <ConfirmScreenHeader />

      <View
        style={{
          padding: 20,
          elevation: 1,
          borderRadius: 16,
          backgroundColor:
            Colors.WHITE,
          gap: 24,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent:
              'space-between',
          }}
        >
          <Typography
            variant="body"
            color={
              Colors.TEXT_GRAY
            }
          >
            Property
          </Typography>

          <Typography variant="h3">
            {currentProperty?.title}
          </Typography>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent:
              'space-between',
          }}
        >
          <Typography
            variant="body"
            color={
              Colors.TEXT_GRAY
            }
          >
            Room
          </Typography>

          <Typography variant="h3">
            {roomName}
          </Typography>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent:
              'space-between',
          }}
        >
          <Typography
            variant="body"
            color={
              Colors.TEXT_GRAY
            }
          >
            Seat
          </Typography>

          <Typography variant="h3">
            {seatIndex}
          </Typography>
        </View>

        <View>
          <Typography
            variant="body"
            color={
              Colors.TEXT_GRAY
            }
          >
            Lease Period
          </Typography>

          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              alignItems:
                'center',
              marginTop: 10,
            }}
          >
            <Picker
              selectedValue={
                fromDate
              }
              style={{
                backgroundColor:
                  '#eee',
                width: '40%',
              }}
              onValueChange={value =>
                setFromDate(
                  value,
                )
              }
            >
              {Years.map(year =>
                Months.map(
                  month => (
                    <Picker.Item
                      key={`${year}-${month}`}
                      label={`${year}-${month}`}
                      value={`${year}-${month}`}
                    />
                  ),
                ),
              )}
            </Picker>

            <Typography variant="h1">
              -
            </Typography>

            <Picker
              selectedValue={
                toDate
              }
              style={{
                backgroundColor:
                  '#eee',
                width: '40%',
              }}
              onValueChange={value =>
                setToDate(
                  value,
                )
              }
            >
              {Years.map(year =>
                Months.map(
                  month => (
                    <Picker.Item
                      key={`${year}-${month}`}
                      label={`${year}-${month}`}
                      value={`${year}-${month}`}
                    />
                  ),
                ),
              )}
            </Picker>
          </View>
        </View>

        <View
          style={{
            height: 0.5,
            backgroundColor:
              Colors.BORDER_GRAY,
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent:
              'space-between',
          }}
        >
          <Typography
            variant="body"
            color={
              Colors.TEXT_GRAY
            }
          >
            Price
          </Typography>

          <Typography
            variant="body"
            color={
              Colors.TEXT_GRAY
            }
          >
            {formatNumberIntoCurrency(
              pricePerSeat,
            )}{' '}
            x {duration} months
          </Typography>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent:
              'space-between',
          }}
        >
          <Typography variant="h1">
            Total
          </Typography>

          <Typography variant="h1">
            {formatNumberIntoCurrency(
              Number(total),
            )}
          </Typography>
        </View>

        {error && (
          <Typography
            color="#EF4444"
            style={{
              textAlign: 'center',
            }}
          >
            {error}
          </Typography>
        )}
      </View>

      <RegularButton
        Icon={
          <Lock
            color={Colors.WHITE}
          />
        }
        loading={booking}
        disable={
          booking ||
          duration <= 0
        }
        onPress={bookNow}
        text={
          `Confirm LKR ${total}`
        }
      />

      <Typography
        variant="caption"
        style={{
          textAlign: 'center',
        }}
      >
        Your booking will be confirmed
        after successful reservation.
      </Typography>
    </View>
  );
};

export default ConfirmBooking;