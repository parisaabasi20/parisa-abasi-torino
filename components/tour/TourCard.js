import styles from "./TourCard.module.css";
import Image from "next/image";
import Link from "next/link";

function TourCard({ data, index, openLoginModal }) {
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

  const getPersianMonth = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth();
    const persianMonths = [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ];
    return persianMonths[month];
  };

  const getDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} روزه`;
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

  const getHotelLevel = (price) => {
    if (price < 50000) return "هتل دو ستاره";
    if (price < 150000) return "هتل سه ستاره";
    if (price < 300000) return "هتل چهار ستاره";
    return "هتل پنج ستاره";
  };

  const tourInfo = `${getPersianMonth(data.startDate)}.${getDuration(
    data.startDate,
    data.endDate
  )}-${getVehicleType(data.fleetVehicle)}-${getHotelLevel(data.price)}`;

  const tourId = index + 1;

  return (
    <div className={styles.card}>
      <Image
        src={data.image}
        alt={data.title}
        width={327}
        height={159}
        className={styles.img}
      />
      <h2 className={styles.title}>{data.title}</h2>
      <p className={styles.info}>{tourInfo}</p>
      <hr className={styles.hr} />
      <div className={styles.btnContainer}>
        <Link href={`/tour/${tourId}`} className={styles.btn}>
          رزرو
        </Link>
        <p className={styles.price}>
          <span className={styles.priceNumber}>{formatPrice(data.price)} </span>
          تومان
        </p>
      </div>
    </div>
  );
}

export default TourCard;
