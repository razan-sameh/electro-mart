"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "../services/auth";

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

    // staleTime: 1000 * 60 * 5, // 5 minutes
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
