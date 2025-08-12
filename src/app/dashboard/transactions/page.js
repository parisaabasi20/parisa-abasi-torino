"use client";

import { useState, useEffect } from "react";
import api from "../../../../core/config/api";
import styles from "./Transactions.module.css";

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await api.get("/user/transactions");
        setTransactions(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("خطا در دریافت تراکنش‌ها");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleString("fa-IR");
  }

  function formatPrice(amount) {
    return amount.toLocaleString("fa-IR");
  }

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
    <div className={styles.tableContainer}>

      {transactions.length === 0 ? (
        <div className={styles.empty}>هیچ تراکنشی یافت نشد.</div>
      ) : (
        <table className={styles.customTable}>
          <thead>
            <tr>
              <th>تاریخ و ساعت</th>
              <th>مبلغ (تومان)</th>
              <th>نوع تراکنش</th>
              <th>شماره سفارش</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{formatDate(t.createdAt)}</td>
                <td>{formatPrice(t.amount)}</td>
                <td>{t.type}</td>
                <td>{t.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
