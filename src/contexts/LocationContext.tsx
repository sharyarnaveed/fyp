"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

type LocationContextValue = {
  detectedCity: string | null;
  isLoading: boolean;
  error: string | null;
};

const LocationContext = createContext<LocationContextValue | null>(null);

async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Prepzy/1.0 (Exam Preparation; contact@prepzy.com)" },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    address?: { city?: string; town?: string; village?: string; state?: string; county?: string };
  };
  const addr = data?.address;
  if (!addr) return null;
  const city =
    addr.city ?? addr.town ?? addr.village ?? addr.county ?? addr.state ?? null;
  return city;
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(() => {
    if (typeof window === "undefined" || !navigator?.geolocation) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const city = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude
          );
          setDetectedCity(city);
        } catch {
          setDetectedCity(null);
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setDetectedCity(null);
        setError("denied");
        setIsLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return (
    <LocationContext.Provider value={{ detectedCity, isLoading, error }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  return ctx ?? { detectedCity: null, isLoading: false, error: null };
}
