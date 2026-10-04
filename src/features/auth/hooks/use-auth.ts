"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { queryKeys } from "@/lib/query-keys";
import type { GoogleLoginInput, LoginInput, RegisterInput, VerifyEmailInput } from "../types/auth.types";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: authApi.currentUser,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
      await queryClient.fetchQuery({ queryKey: queryKeys.auth.me(), queryFn: authApi.currentUser });
    },
  });
}

export function useGoogleLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: GoogleLoginInput) => authApi.googleLogin(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
      await queryClient.fetchQuery({ queryKey: queryKeys.auth.me(), queryFn: authApi.currentUser });
    },
  });
}

export function useRegister() {
  return useMutation({ mutationFn: (input: RegisterInput) => authApi.register(input) });
}

export function useVerifyEmail() {
  return useMutation({ mutationFn: (input: VerifyEmailInput) => authApi.verifyEmail(input) });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: async () => {
      await queryClient.cancelQueries();
      queryClient.removeQueries({ queryKey: queryKeys.auth.root });
      queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== "health" });
    },
  });
}
