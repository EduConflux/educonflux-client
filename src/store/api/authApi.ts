import { apiSlice } from './apiSlice';
import type { User } from '../slices/authSlice';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ActivationRequest {
  token: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    activateAccount: builder.mutation<string, ActivationRequest>({
      query: (data) => ({
        url: '/auth/activate',
        method: 'POST',
        body: data,
      }),
    }),

    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useActivateAccountMutation,
  useChangePasswordMutation,
} = authApi;
