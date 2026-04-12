import { readJson, writeJson } from "@/lib/persistence";
import { mockApi } from "@/services/api/mockApi";
import { User, Vehicle } from "@/types/models";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

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
const APP_STORAGE_KEY = "autoplano.app-state";

type PersistedAppState = {
  hasSeenOnboarding: boolean;
  isAuthenticated: boolean;
  user: User | null;
  vehicle: Vehicle | null;
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [vehicle, setVehicleState] = useState<Vehicle | null>(null);

  useEffect(() => {
    const persistedState = readJson<PersistedAppState | null>(APP_STORAGE_KEY, null);
    if (persistedState) {
      setHasSeenOnboarding(persistedState.hasSeenOnboarding);
      setIsAuthenticated(persistedState.isAuthenticated);
      setUser(persistedState.user);
      setVehicleState(persistedState.vehicle);
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    writeJson(APP_STORAGE_KEY, {
      hasSeenOnboarding,
      isAuthenticated,
      user,
      vehicle,
    } satisfies PersistedAppState);
  }, [hasSeenOnboarding, isAuthenticated, isReady, user, vehicle]);

  const value = useMemo<AppContextValue>(
    () => ({
      isReady,
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
        setVehicleState(null);
      },
    }),
    [hasSeenOnboarding, isAuthenticated, isReady, user, vehicle]
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
