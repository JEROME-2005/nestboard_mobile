import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import React, {
  useEffect,
  useState,
} from 'react';

import ScreenWrapper
  from './components/ScreenWrapper';

import PropertyDetailsScreen
  from './components/PropertyDetailsScreen';

import {
  PropertyAPI,
} from '../../../api/properties';

import {
  FavouriteAPI,
} from '../../../api/favourites';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  RootState,
} from '../../../store/store';

import Skeleton
  from '../../../components/ui/Skeleton';

import {
  SCREEN_HEIGHT,
} from '../../../constant/dimentions';

import {
  Colors,
} from '../../../constant/colors';

import {
  saveProperty,
  saveRoomTypes,
} from '../../../store/propertySlice';

import {
  Heart,
} from 'lucide-react-native';

const PropertyDetails = () => {
  const route: any =
    useRoute();

  const nav: any =
    useNavigation();

  const dispatch =
    useDispatch();

  const currentProperty =
    useSelector(
      (state: RootState) =>
        state.property.currentProperty,
    );

  const roomTypes =
    useSelector(
      (state: RootState) =>
        state.property.roomType,
    );

  const [
    favouriteSaved,
    setFavouriteSaved,
  ] = useState(false);

  const [
    favouriteLoading,
    setFavouriteLoading,
  ] = useState(false);

  /*
   * Load property + room types
   */
  useEffect(() => {
    const loadProperty =
      async () => {
        try {
          const data =
            await PropertyAPI.getSingleProperty(
              route.params.pid,
            );

          dispatch(
            saveProperty(data),
          );

          setFavouriteSaved(
            data.saved ?? false,
          );
        } catch (error) {
          console.error(
            'Failed to load property:',
            error,
          );
        }
      };

    const loadRoomTypes =
      async () => {
        try {
          const data =
            await PropertyAPI.getPropertyRoomTypes(
              route.params.pid,
            );

          dispatch(
            saveRoomTypes(data),
          );
        } catch (error) {
          console.error(
            'Failed to load room types:',
            error,
          );
        }
      };

    loadProperty();
    loadRoomTypes();
  }, [
    dispatch,
    route.params.pid,
  ]);

  /*
   * Favourite toggle
   */
  const handleFavourite =
    async () => {
      if (favouriteLoading) {
        return;
      }

      const previous =
        favouriteSaved;

      setFavouriteSaved(
        !previous,
      );

      setFavouriteLoading(
        true,
      );

      try {
        const response =
          await FavouriteAPI.toggleFavourite(
            route.params.pid,
          );

        const nextSaved =
          response.saved ??
          !previous;

        setFavouriteSaved(
          nextSaved,
        );
      } catch (error) {
        console.error(
          'Favourite error:',
          error,
        );

        setFavouriteSaved(
          previous,
        );

        Alert.alert(
          'Error',
          'Unable to update favourite.',
        );
      } finally {
        setFavouriteLoading(
          false,
        );
      }
    };

  if (!currentProperty) {
    return (
      <ScreenWrapper>
        <Skeleton
          height={
            SCREEN_HEIGHT * 0.55
          }
          style={{
            marginTop: '90%',
          }}
          width="100%"
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View
        style={
          styles.container
        }
      >
        {/* Favourite button */}
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={
            favouriteLoading
          }
          onPress={
            handleFavourite
          }
          style={
            styles.favouriteButton
          }
        >
          {favouriteLoading ? (
            <ActivityIndicator
              size="small"
              color="#EF4444"
            />
          ) : (
            <Heart
              size={24}
              color={
                favouriteSaved
                  ? '#EF4444'
                  : Colors.ICON_GRAY
              }
              fill={
                favouriteSaved
                  ? '#EF4444'
                  : 'transparent'
              }
            />
          )}
        </TouchableOpacity>

        <PropertyDetailsScreen
          title={
            currentProperty.title
          }
          address={
            currentProperty.address
          }
          badges={[
            ...currentProperty.amenities,
          ]}
          stats={{
            seatsAvailable: 10,
            minStayMonths:
              currentProperty.minStay,
            priceFrom: 'LKR 15K',
          }}
          rooms={
            roomTypes ?? []
          }
          onViewRooms={(
            id,
            name,
          ) => {
            nav.navigate(
              'RoomTypeDetails',
              {
                roomTypeId: id,
                roomTypeName: name,
                location:
                  currentProperty.address,
              },
            );
          }}
        />
      </View>
    </ScreenWrapper>
  );
};

export default PropertyDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  favouriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor:
      'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    elevation: 5,
  },
});