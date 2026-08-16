import { apiClient } from './apiClient';
import { Property } from '../types/properties';

export type FavouriteResponse = {
  success?: boolean;
  saved?: boolean;
  message?: string;
};

export const FavouriteAPI = {
  getMyFavourites: async (): Promise<Property[]> => {
    const response =
      await apiClient.get<Property[]>(
        'favourites',
      );

    return response.data;
  },

  toggleFavourite: async (
    propertyId: string,
  ): Promise<FavouriteResponse> => {
    const response =
      await apiClient.post<FavouriteResponse>(
        `favourites/${propertyId}/toggle`,
      );

    return response.data;
  },

  addFavourite: async (
    propertyId: string,
  ): Promise<FavouriteResponse> => {
    const response =
      await apiClient.post<FavouriteResponse>(
        `favourites/${propertyId}`,
      );

    return response.data;
  },

  removeFavourite: async (
    propertyId: string,
  ): Promise<FavouriteResponse> => {
    const response =
      await apiClient.delete<FavouriteResponse>(
        `favourites/${propertyId}`,
      );

    return response.data;
  },
};