import { mockApi } from "@/services/api/mockApi";
import { User, Vehicle } from "@/types/models";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type AppContextValue = {
  isReady: boolean;
  hasSeenOnboarding: boolean;
  isAuthenticated: boolean;
  user: User | null;
  vehicle: Vehicle | null;
  finishOnboarding: () => void;
  login: (payload: { name: string; email: string }) => Promise<void>;
  setVehicle: (vehicle: Vehicle) => void;
  logout: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

const queryClient = new QueryClient();

export function AppProvider({ children }: { children: ReactNode }) {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [vehicle, setVehicleState] = useState<Vehicle | null>(null);

  const value = useMemo<AppContextValue>(
    () => ({
      isReady: true,
      hasSeenOnboarding,
      isAuthenticated,
      user,
      vehicle,
      finishOnboarding: () => setHasSeenOnboarding(true),
      login: async ({ name, email }) => {
        const loggedUser = await mockApi.login({ name, email });
        const currentVehicle = await mockApi.getVehicle();
        setUser(loggedUser);
        setVehicleState(currentVehicle);
        setIsAuthenticated(true);
      },
      setVehicle: (nextVehicle) => setVehicleState(nextVehicle),
      logout: () => {
        setIsAuthenticated(false);
        setUser(null);
      },
    }),
    [hasSeenOnboarding, isAuthenticated, user, vehicle]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={value}>{children}</AppContext.Provider>
    </QueryClientProvider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export { queryClient };
