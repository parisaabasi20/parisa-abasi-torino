"use client";
import ContactGray from "components/icons/ContactGray";
import styles from "./Basket.module.css";
import { DatePicker } from "zaman";
import { useState, useEffect } from "react";
import { getCookie } from "core/utils/cookie";
import { useRouter } from "next/navigation";

function Basket() {
  const [formData, setFormData] = useState({
    fullName: "",
    nationalCode: "",
    birthDate: "",
    gender: "",
  });
  const [tour, setTour] = useState(null);

  useEffect(() => {
    const fetchBasket = async () => {
      const token = getCookie("accessToken");
      const res = await fetch("http://localhost:6500/basket", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTour(data[0]);
        } else if (data && typeof data === "object") {
          setTour(data);
        } else {
          setTour(null);
        }
      } else {
        setTour(null);
      }
    };
    fetchBasket();
  }, []);

  const router = useRouter();
  const handleOrder = async () => {
    if (
      !formData.fullName ||
      !formData.nationalCode ||
      !formData.birthDate ||
      !formData.gender
    ) {
      alert("لطفاً همه فیلدها را کامل کنید.");
      return;
    }
    const token = getCookie("accessToken");

    const res = await fetch("http://localhost:6500/order", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/order?paymentLink=${encodeURIComponent(data.paymentLink)}`);
    } else {
      const errorText = await res.text();
      alert("خطا در ثبت سفارش یا توکن نامعتبر است.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => {
      const updated = { ...prev, birthDate: date };
      return updated;
    });
  };

  const formatPrice = (price) => {
    if (!price) return "";
    const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let priceStr = price.toString();
    priceStr = priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    for (let i = 0; i < 10; i++) {
      priceStr = priceStr.replace(
        new RegExp(englishNumbers[i], "g"),
        persianNumbers[i]
      );
    }
    return priceStr;
  };

  const getDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const nights = diffDays - 1;
    return `${diffDays} روز و ${nights} شب`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h3>
          <ContactGray />
          مشخصات مسافر
        </h3>
        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="نام و نام خانوادگی"
        />
        <input
          name="nationalCode"
          value={formData.nationalCode}
          onChange={handleChange}
          placeholder="کد ملی"
        />

        <DatePicker
          inputClass={styles.dateInput}
          value={formData.birthDate}
          onChange={handleDateChange}
          round="x2"
          locale="fa"
          style={{ width: "100%" }}
          inputAttributes={{ placeholder: "تاریخ تولد" }}
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          placeholder="جنسیت"
          style={{ width: "100%", margin: "10px 0" }}
        >
          <option value="">جنسیت</option>
          <option value="male">مرد</option>
          <option value="female">زن</option>
        </select>
      </div>
      <div className={styles.buyInfo}>
        {tour ? (
          <>
            <div>
              <h3>{tour.title}</h3>
              <p>{getDuration(tour.startDate, tour.endDate)}</p>
            </div>
            <div>
              <p>قیمت نهایی</p>
              <p>{formatPrice(tour.price)}</p>
            </div>
            <button onClick={handleOrder}>ثبت و خرید نهایی</button>
          </>
        ) : (
          <div>loading...</div>
        )}
      </div>
    </div>
  );
}

export default Basket;
