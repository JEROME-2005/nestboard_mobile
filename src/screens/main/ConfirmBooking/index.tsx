import React, {
  useMemo,
  useState,
} from 'react';

import {
  Alert,
  StyleSheet,
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

import {
  clearBooking,
} from '../../../store/bookingSlice';

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

  const bookingData =
    useSelector(
      (
        state: RootState,
      ) =>
        state.booking.data,
    );

  /*
   * Selected room.
   */
  const roomId =
    bookingData?.roomId;

  const roomName =
    bookingData?.roomName;

  const seatIndex =
    bookingData?.seatIndex;

  /*
   * Convert the stored price safely.
   *
   * Handles:
   *   "20000"
   *   "20000.00"
   *   "LKR 20000"
   *   "LKR 20,000"
   */
  const pricePerSeat =
    useMemo(() => {
      const raw =
        bookingData?.pricePerSeat;

      if (
        raw === undefined ||
        raw === null
      ) {
        return 0;
      }

      const cleaned =
        String(raw)
          .replace(/LKR/gi, '')
          .replace(/,/g, '')
          .replace(/[^0-9.]/g, '');

      const value =
        Number(cleaned);

      return Number.isFinite(
        value,
      )
        ? value
        : 0;
    }, [
      bookingData?.pricePerSeat,
    ]);

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
  ] = useState<
    string | null
  >(null);

  /*
   * Calculate duration in months.
   */
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

      return Math.max(
        end.diff(
          start,
          'month',
        ),
        0,
      );
    }, [
      fromDate,
      toDate,
    ]);

  /*
   * Client-side preview only.
   *
   * Backend calculates the real
   * booking total from its own
   * room price.
   */
  const total =
    useMemo(() => {
      return (
        pricePerSeat *
        duration
      );
    }, [
      pricePerSeat,
      duration,
    ]);

  /*
   * Don't allow the end date to
   * be before the start date.
   */
  const handleStartDateChange =
    (value: string) => {
      setFromDate(value);

      const start =
        dayjs(
          value,
          'YYYY-MMM',
        );

      const end =
        dayjs(
          toDate,
          'YYYY-MMM',
        );

      if (
        end.isBefore(
          start,
          'month',
        )
      ) {
        setToDate(value);
      }
    };

  const handleEndDateChange =
    (value: string) => {
      const start =
        dayjs(
          fromDate,
          'YYYY-MMM',
        );

      const end =
        dayjs(
          value,
          'YYYY-MMM',
        );

      if (
        end.isBefore(
          start,
          'month',
        )
      ) {
        Alert.alert(
          'Invalid lease period',
          'The end month cannot be before the start month.',
        );

        return;
      }

      if (
        end.isSame(
          start,
          'month',
        )
      ) {
        Alert.alert(
          'Invalid lease period',
          'Please select at least 1 month.',
        );

        return;
      }

      setToDate(value);
    };

  const bookNow = async () => {
    if (!roomId) {
      Alert.alert(
        'Missing room',
        'The selected room could not be found. Please select the room again.',
      );

      return;
    }

    if (
      seatIndex ===
        undefined ||
      seatIndex === null
    ) {
      Alert.alert(
        'Select a seat',
        'Please go back and select an available seat.',
      );

      return;
    }

    if (
      pricePerSeat <= 0
    ) {
      Alert.alert(
        'Invalid room price',
        'The room price could not be loaded. Please go back and select the room again.',
      );

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
      /*
       * IMPORTANT:
       *
       * Backend expects:
       *   roomId
       *   seatNumber
       *   startMonth
       *   durationMonths
       *
       * Backend calculates totalAmount itself.
       */
      const pendingBooking =
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
        );

      /*
       * We have now created the
       * PENDING booking.
       *
       * Confirm it.
       */
      if (
        pendingBooking.status !==
        'PENDING'
      ) {
        throw new Error(
          'Booking was not created as pending.',
        );
      }

      const confirmed =
        await BookingAPI.confirmBooking(
          pendingBooking.id,
        );

      if (
        confirmed.status ===
        'CONFIRMED'
      ) {
        dispatch(
          clearBooking(),
        );

        Alert.alert(
          'Booking confirmed',
          `Seat ${seatIndex} in ${roomName} has been successfully reserved.`,
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
      } else {
        throw new Error(
          'Booking could not be confirmed.',
        );
      }
    } catch (err: any) {
      console.error(
        'BOOKING ERROR:',
        err?.response?.data ??
          err,
      );

      const status =
        err?.response?.status;

      if (
        status === 409
      ) {
        setError(
          'This seat is no longer available.',
        );

        Alert.alert(
          'Seat unavailable',
          'This seat was taken before your booking was completed. Please choose another available seat.',
        );
      } else {
        const message =
          err?.response?.data
            ?.error?.message ??
          err?.response?.data
            ?.message ??
          'Unable to complete your booking.';

        setError(message);

        Alert.alert(
          'Booking failed',
          message,
        );
      }
    } finally {
      setBooking(false);
    }
  };

  return (
    <View
      style={
        styles.container
      }
    >
      <ConfirmScreenHeader />

      <View
        style={styles.card}
      >
        {/* PROPERTY */}
        <View
          style={
            styles.row
          }
        >
          <Typography
            variant="body"
            color={
              Colors.TEXT_GRAY
            }
          >
            Property
          </Typography>

          <Typography
            variant="h3"
            style={
              styles.value
            }
          >
            {currentProperty
              ?.title ??
              '-'}
          </Typography>
        </View>

        {/* ROOM */}
        <View
          style={
            styles.row
          }
        >
          <Typography
            variant="body"
            color={
              Colors.TEXT_GRAY
            }
          >
            Room
          </Typography>

          <Typography
            variant="h3"
            style={
              styles.value
            }
          >
            {roomName ??
              '-'}
          </Typography>
        </View>

        {/* SEAT */}
        <View
          style={
            styles.row
          }
        >
          <Typography
            variant="body"
            color={
              Colors.TEXT_GRAY
            }
          >
            Seat
          </Typography>

          <Typography
            variant="h3"
            style={
              styles.value
            }
          >
            {seatIndex ??
              '-'}
          </Typography>
        </View>

        {/* LEASE */}
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
            style={
              styles.pickerRow
            }
          >
            <Picker
              selectedValue={
                fromDate
              }
              style={
                styles.picker
              }
              onValueChange={
                handleStartDateChange
              }
            >
              {Years.map(
                year =>
                  Months.map(
                    month => (
                      <Picker.Item
                        key={`${year}-${month}-start`}
                        label={`${year}-${month}`}
                        value={`${year}-${month}`}
                      />
                    ),
                  ),
              )}
            </Picker>

            <Typography
              variant="h1"
            >
              -
            </Typography>

            <Picker
              selectedValue={
                toDate
              }
              style={
                styles.picker
              }
              onValueChange={
                handleEndDateChange
              }
            >
              {Years.map(
                year =>
                  Months.map(
                    month => (
                      <Picker.Item
                        key={`${year}-${month}-end`}
                        label={`${year}-${month}`}
                        value={`${year}-${month}`}
                      />
                    ),
                  ),
              )}
            </Picker>
          </View>
        </View>

        {/* PRICE */}
        <View
          style={
            styles.divider
          }
        />

        <View
          style={
            styles.row
          }
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
            × {duration}{' '}
            months
          </Typography>
        </View>

        {/* TOTAL */}
        <View
          style={
            styles.totalRow
          }
        >
          <Typography
            variant="h1"
          >
            Total
          </Typography>

          <Typography
            variant="h1"
          >
            {formatNumberIntoCurrency(
              total,
            )}
          </Typography>
        </View>

        {error && (
          <Typography
            color="#EF4444"
            style={
              styles.error
            }
          >
            {error}
          </Typography>
        )}
      </View>

      <RegularButton
        Icon={
          <Lock
            color={
              Colors.WHITE
            }
          />
        }
        loading={booking}
        disable={
          booking ||
          duration <= 0 ||
          pricePerSeat <= 0 ||
          seatIndex ===
            undefined
        }
        onPress={
          bookNow
        }
        text={`Confirm ${formatNumberIntoCurrency(
          total,
        )}`}
      />

      <Typography
        variant="caption"
        color={
          Colors.TEXT_GRAY
        }
        style={
          styles.footer
        }
      >
        Your booking will be
        created as pending and
        confirmed securely.
      </Typography>
    </View>
  );
};

export default ConfirmBooking;

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        Colors.WHITE,
      padding: 16,
      gap: 16,
    },

    card: {
      padding: 20,
      elevation: 1,
      borderRadius: 16,
      backgroundColor:
        Colors.WHITE,
      gap: 24,
    },

    row: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'center',
      gap: 16,
    },

    value: {
      flex: 1,
      textAlign: 'right',
    },

    pickerRow: {
      flexDirection:
        'row',
      gap: 10,
      alignItems:
        'center',
      marginTop: 10,
    },

    picker: {
      flex: 1,
      backgroundColor:
        '#EEEEEE',
    },

    divider: {
      height: 0.5,
      backgroundColor:
        Colors.BORDER_GRAY,
    },

    totalRow: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'center',
    },

    error: {
      textAlign:
        'center',
    },

    footer: {
      textAlign:
        'center',
    },
  });