"use client";
import { getCookie } from "../../core/utils/cookie";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./TourDetail.module.css";
import Contact from "components/icons/Contact";
import DetailsPageIconOne from "components/icons/DetailsPageIconOne";
import TazminSafar from "components/icons/TazminSafar";
import Bus from "components/icons/Bus";
import Contacts from "components/icons/Contacts";
import Bime from "components/icons/Bime";
import ContactGray from "components/icons/ContactGray";
import { useRouter } from "next/navigation";


function TourDetail({ tour }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const tourId = tour?.id;

  const formatPrice = (price) => {
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
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const nights = diffDays - 1;
    return `${diffDays} روز و ${nights} شب`;
  };

  const getVehicleType = (vehicle) => {
    const vehicleTypes = {
      Bus: "اتوبوس",
      Van: "ون",
      SUV: "شاسی بلند",
      Airplane: "پرواز",
    };
    return vehicleTypes[vehicle] || vehicle;
  };

  const handleBooking = async () => {
    setIsLoading(true);
    const token = getCookie("accessToken");
    const res = await fetch(`http://localhost:6500/basket/${tourId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (res.ok) {
      router.push(`/basket`);
    } else {
      const errorText = await res.text();
      alert("خطا در افزودن به سبد خرید یا توکن نامعتبر است.");
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <Image
          src={tour.image}
          alt={tour.title}
          width={1000}
          height={1000}
          className={styles.tourImage}
        />
      </div>

      <div className={styles.tourTitle}>
        <h1>{tour.title}</h1>
        <p className={styles.duration}>
          {getDuration(tour.startDate, tour.endDate)}
        </p>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <span className={styles.detailIcon}>
            <ContactGray />
          </span>
          <span className={styles.detailText}>تورلیدر از مبدا</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailIcon}>
            <DetailsPageIconOne />
          </span>
          <span className={styles.detailText}>برنامه سفر</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailIcon}>
            <TazminSafar />
          </span>
          <span className={styles.detailText}>تضمین کیفیت</span>
        </div>
      </div>

      <div className={styles.detailInfo}>
        <div className={styles.detailItemInfo}>
          <p>
            <span className={styles.detailIcon}>
              <Bus />
            </span>
            <span className={styles.detailText}>حمل و نقل</span>
          </p>
          <p>
            {getVehicleType(tour.fleetVehicle)}
          </p>
        </div>
        <div className={styles.detailItemInfo}>
          <p>
            <span className={styles.detailIcon}>
              <Contacts />
            </span>
            <span className={styles.detailText}>ظرفیت </span>
          </p>
          <p>حداکثر ۳۰ نفر</p>
        </div>
        <div className={styles.detailItemInfo}>
          <p>
            <span className={styles.detailIcon}>
              <Bime />
            </span>
            <span className={styles.detailText}>بیمه</span>
          </p>
          <p> ۵۰ هزار دیناری</p>
        </div>
      </div>

      <div className={styles.bookingSection}>
        <button
          onClick={handleBooking}
          className={styles.bookButton}
          disabled={isLoading}
        >
          {isLoading ? "در حال پردازش..." : "رزرو و خرید"}
        </button>

        <div className={styles.priceInfo}>
          <span className={styles.price}>{formatPrice(tour.price)}</span>
          <span className={styles.currency}>تومان</span>
        </div>
      </div>
    </div>
  );
}

export default TourDetail;
