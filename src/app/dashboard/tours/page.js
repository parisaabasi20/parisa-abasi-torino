"use client";

import { useState, useEffect } from "react";
import api from "core/config/api";
import UserTourCard from "../../../../components/modules/UserTourCard";
import styles from "./Tours.module.css";

export default function Tours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserTours = async () => {
      try {
        setLoading(true);
        const response = await api.get("/user/tours");
        setTours(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching user tours:", err);
        setError("خطا در دریافت تورهای شما");
      } finally {
        setLoading(false);
      }
    };

    fetchUserTours();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>در حال بارگذاری...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>تورهای من</h1>

      {tours.length === 0 ? (
        <div className={styles.empty}>
          <p>شما هنوز هیچ توری رزرو نکرده‌اید.</p>
        </div>
      ) : (
        <div className={styles.toursGrid}>
          {tours.map((tour) => (
            <UserTourCard key={tour.id} tour={tour} />
          ))}
        </div>
      )}
    </div>
  );
}
