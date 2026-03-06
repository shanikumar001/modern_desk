import { useEffect, useState } from "react";

interface BackendStatus {
  isOnline: boolean;
  isChecking: boolean;
  lastChecked: number | null;
  error: string | null;
}

export function useBackendStatus() {
  const [status, setStatus] = useState<BackendStatus>({
    isOnline: true,
    isChecking: true,
    lastChecked: null,
    error: null,
  });

  const checkStatus = async () => {
    setStatus((prev) => ({ ...prev, isChecking: true, error: null }));

    try {
      // Get API base URL from environment
      const apiBase = import.meta.env.VITE_API_URL || "";
      const healthUrl = `${apiBase}/api/health`;

      const response = await fetch(healthUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        setStatus({
          isOnline: true,
          isChecking: false,
          lastChecked: Date.now(),
          error: null,
        });
      } else {
        setStatus((prev) => ({
          ...prev,
          isOnline: false,
          isChecking: false,
          error: `Server returned ${response.status}`,
        }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Connection failed";
      setStatus({
        isOnline: false,
        isChecking: false,
        lastChecked: Date.now(),
        error: errorMessage,
      });
    }
  };

  useEffect(() => {
    // Check immediately on mount
    checkStatus();

    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return { ...status, checkStatus };
}

