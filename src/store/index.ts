import { Faculty, User } from "@/types";
import { create } from "zustand";

type SessionStoreType = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  faculty?: Faculty;
  error: string | null;
  updateAccessToken: (token: string) => void;
  updateRefreshToken: (token: string) => void;
  updateUser: (user: User) => void;
  updateError: (error: string) => void;
  update: (session: {
    accessToken?: string | null;
    refreshToken?: string | null;
    user?: User | null;
    error?: string | null;
    faculty?:Faculty
  }) => void;
}; 

export const useSessionStore = create<SessionStoreType>()((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  faculty:undefined,
  error: null,
  updateAccessToken: (token) => set({ accessToken: token }),
  updateRefreshToken: (token) => set({ refreshToken: token }),
  updateUser: (user) => set({ user }),
  updateError: (error) => set({ error }),
  update: (session) => set({ ...session }),
}));
