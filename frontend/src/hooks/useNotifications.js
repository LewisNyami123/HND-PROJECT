import { useEffect, useState } from "react";
import { getNotifications } from "../services/notificationService";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // prevents state update after unmount

    const fetchData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
          if (isMounted) setError("NO_TOKEN");
          return;
        }

        const data = await getNotifications(token);

        if (isMounted) {
          setNotifications(data);
          setError(null);
        }

      } catch (err) {
        console.error("Notification fetch error:", err);

        if (isMounted) {
          setError("FETCH_ERROR");
        }

      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { notifications, loading, error };
};