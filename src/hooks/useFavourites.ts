import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  FavouriteAPI,
} from '../api/favourites';

import {
  Property,
} from '../types/properties';

export const useFavourites = (
  enabled = true,
) => {
  const [
    favourites,
    setFavourites,
  ] = useState<Property[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const [
    updatingId,
    setUpdatingId,
  ] = useState<string | null>(
    null,
  );

  const fetchFavourites =
    useCallback(async () => {
      if (!enabled) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data =
          await FavouriteAPI.getMyFavourites();

        setFavourites(data);
      } catch {
        setError(
          'Unable to load your favourites.',
        );
      } finally {
        setLoading(false);
      }
    }, [enabled]);

  useEffect(() => {
    fetchFavourites();
  }, [fetchFavourites]);

  const removeFavourite =
    useCallback(
      async (
        propertyId: string,
      ) => {
        setUpdatingId(propertyId);

        try {
          await FavouriteAPI.removeFavourite(
            propertyId,
          );

          setFavourites(
            current =>
              current.filter(
                property =>
                  property.id !==
                  propertyId,
              ),
          );

          return true;
        } catch {
          return false;
        } finally {
          setUpdatingId(null);
        }
      },
      [],
    );

  const toggleFavourite =
    useCallback(
      async (
        propertyId: string,
        currentlySaved: boolean,
      ) => {
        setUpdatingId(propertyId);

        try {
          const response =
            await FavouriteAPI.toggleFavourite(
              propertyId,
            );

          const saved =
            response.saved ??
            !currentlySaved;

          if (!saved) {
            setFavourites(
              current =>
                current.filter(
                  property =>
                    property.id !==
                    propertyId,
                ),
            );
          }

          return saved;
        } catch {
          return currentlySaved;
        } finally {
          setUpdatingId(null);
        }
      },
      [],
    );

  return {
    favourites,
    loading,
    error,
    updatingId,
    refetch: fetchFavourites,
    removeFavourite,
    toggleFavourite,
  };
};