import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// export const useAuthStore = create(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,
//       isAuthenticated: false,

//       login: (userData, token) => set({
//         user: userData,
//         token,
//         isAuthenticated: true,
//       }),

//       logout: () => {
//         localStorage.removeItem(import.meta.env.VITE_TOKEN_KEY)
//         set({ user: null, token: null, isAuthenticated: false })
//       },

//       updateUser: (updates) =>
//         set((state) => ({ user: { ...state.user, ...updates } })),
//     }),
//     {
//       name: 'hrms-auth',
//       partialize: (state) => ({
//         user: state.user,
//         token: state.token,
//         isAuthenticated: state.isAuthenticated,
//       }),
//     }
//   )
// )

export const useAuthStore = create(
  persist(
    (set) => ({
      user: { name: 'Mac John', designation: 'Admin', role: 'ADMIN' },
      // user: { name: 'Rajan Mehta', designation: 'HR', role: 'HR' },
      // user: { name: 'Mark Parker', designation: 'Employee', role: 'EMPLOYEE' },
      token: 'dev-token',
      isAuthenticated: true,

      login: (userData, token) => set({ user: userData, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
    }),
    {
      name: 'hrms-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)