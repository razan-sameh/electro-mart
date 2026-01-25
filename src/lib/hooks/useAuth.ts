"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchMe, loginApi, logout, signupApi } from "../services/auth";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { CART_QUERY_KEY } from "./useCart";
import { WISHLIST_QUERY_KEY } from "./useWishlist";

export function useAuth() {
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchMe,
    retry: 1, // 👈 Avoid infinite retry loops
    staleTime: Infinity,
  });

  const isAuthenticated = !!user;

  return {
    user,
    isAuthenticated,
    isLoading,
    isError,
    refetch,
  };
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginApi,
    onSuccess: async (data) => {
      // Set user data directly in cache
      if (data.success && data.user) {
        queryClient.setQueryData(["auth", "me"], data.user);
        await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
        await queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      }
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signupApi,
    onSuccess: async (data) => {
      if (data.success && data.user) {
        // 1. Set user data in cache
        queryClient.setQueryData(["auth", "me"], data.user);
        await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
        await queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      }
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      queryClient.setQueryData(["auth", "me"], null);
      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });
}
