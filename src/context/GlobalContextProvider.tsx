import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type TGlobalContextProvider = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export type TData = {
  vendor_id: string;
  pickup_datetime: string;
  dropoff_datetime: string;
  passenger_count: string;
  trip_distance: string;
  pickup_longitude: string;
  pickup_latitude: string;
  store_and_fwd_flag?: string;
  dropoff_longitude: string;
  dropoff_latitude: string;
  payment_type: string;
  fare_amount: string;
  mta_tax: string;
  tip_amount: string;
  tolls_amount: string;
  total_amount: string;
  imp_surcharge: string;
  rate_code: string;
  trip_time: string;
};

type TGlobalContext = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  data: TData[] | null;
};

const initialState: TGlobalContext = {
  theme: "system",
  setTheme: () => null,
  data: null,
};

const GlobalContext = createContext<TGlobalContext>(initialState);

export function GlobalContextProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: TGlobalContextProvider) {
  const [data, setData] = useState([]);
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const apiFetch = async () => {
    try {
      const response = await fetch(
        "https://analytics-dashboard-backend-pga.vercel.app/api"
      );
      const result = await response.json();
      if (result) setData(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    apiFetch();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    data,
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <GlobalContext.Provider {...props} value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
