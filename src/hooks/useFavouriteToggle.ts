import {
  useCallback,
  useState,
} from 'react';

import {
  FavouriteAPI,
} from '../api/favourites';

export const useFavouriteToggle = (
  initialSaved = false,
) => {
  const [saved, setSaved] =
    useState<boolean>(
      initialSaved,
    );

  const [loading, setLoading] =
    useState(false);

  const toggle =
    useCallback(
      async (
        propertyId: string,
      ): Promise<boolean> => {
        if (loading) {
          return saved;
        }

        const previous = saved;

        setSaved(!previous);
        setLoading(true);

        try {
          const response =
            await FavouriteAPI.toggleFavourite(
              propertyId,
            );

          const nextSaved =
            response.saved ??
            !previous;

          setSaved(nextSaved);

          return nextSaved;
        } catch {
          setSaved(previous);

          return previous;
        } finally {
          setLoading(false);
        }
      },
      [loading, saved],
    );

  return {
    saved,
    loading,
    toggle,
  };
};