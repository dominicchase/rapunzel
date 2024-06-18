// src/hooks/useAuth.ts

import { useEffect, useState } from "react";
import {
  getAccessToken,
  getUserId,
  isTokenExpired,
  refreshTokens,
  removeAuthData,
} from "../utils/auth";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = getAccessToken();
      const storedUserId = getUserId();

      if (accessToken && !isTokenExpired(accessToken)) {
        setIsAuthenticated(true);
        setUserId(storedUserId);
      } else if (await refreshTokens()) {
        setIsAuthenticated(true);
        setUserId(storedUserId);
      } else {
        setIsAuthenticated(false);
        setUserId(null);
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    removeAuthData();
    setIsAuthenticated(false);
    setUserId(null);
  };

  return { isAuthenticated, userId, logout };
};

export default useAuth;
