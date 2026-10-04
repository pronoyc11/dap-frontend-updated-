"use client";
import { create } from "zustand";
import type { User } from "@/lib/types";
import { markSession } from "@/lib/session";

interface AuthState { user: User | null; setUser: (user: User | null) => void; }
export const useAuthStore = create<AuthState>((set) => ({ user: null, setUser: (user) => { if (user) markSession(user.role); set({ user }); } }));
