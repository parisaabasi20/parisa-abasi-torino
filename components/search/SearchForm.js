"use client";
import { useState } from "react";
import { DatePicker } from "zaman";
import styles from "./SearchForm.module.css";
import Origin from "components/icons/Origin";
import Destination from "components/icons/Destination";
import Date from "components/icons/Date";

export default function SearchForm({ onSearch }) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const handleSubmit = (e) => {
    e.preventDefault();

    onSearch({
      origin,
      destination,
      startDate: dateRange.from
        ? dateRange.from.toISOString().slice(0, 10)
        : "",
      endDate: dateRange.to ? dateRange.to.toISOString().slice(0, 10) : "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <div className={styles.row}>
        <div className={styles.input}>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className={origin === "" ? styles.placeholder : ""}
          >
            <option value=""> مبدا</option>
            <option value="Tehran">تهران</option>
            <option value="Sanandaj">سنندج</option>
            <option value="Isfahan">اصفهان</option>
          </select>
        </div>
        <div className={styles.input}>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className={destination === "" ? styles.placeholder : ""}
          >
            <option value="">مقصد</option>
            <option value="Mazandaran">مازندران</option>
            <option value="Madrid">مادرید</option>
            <option value="Italy">ایتالیا</option>
            <option value="sulaymaniyahTour">سلیمانیه</option>
            <option value="Hewler">هولر</option>
            <option value="offRoad Center">آفرود</option>
          </select>
        </div>
      </div>
      <div className={styles.date}>
        <DatePicker
          inputClass={styles.dateInput}
          value={dateRange}
          onChange={setDateRange}
          round="x2"
          accentColor="#28a745"
          range={true}
          locale="fa"
          style={{ width: "100%" }}
          inputAttributes={{ placeholder: "تاریخ" }}
        />
      </div>
      <button type="submit" className={styles.btnSubmit}>
        جستجو
      </button>
    </form>
  );
}
