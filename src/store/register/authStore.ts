import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StringColorProps } from 'types/password';

interface AuthState {
  showPassword: boolean;
  level: StringColorProps | undefined;
  toggleShowPassword: () => void;
  setLevel: (level: StringColorProps) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      showPassword: false,
      level: undefined,
      toggleShowPassword: () =>
        set((state) => ({ showPassword: !state.showPassword })),
      setLevel: (level) => set({ level }),
      reset: () => set({ showPassword: false, level: undefined })
    }),
    {
      name: 'auth-store', // storage key
      partialize: (state) => ({ showPassword: state.showPassword }) // optional
    }
  )
);
