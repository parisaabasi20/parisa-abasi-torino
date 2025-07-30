import styles from "./UserTourCard.module.css";
import Link from "next/link";
import Air from "components/icons/Air";

function UserTourCard({ tour }) {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const persianDays = [
      "یکشنبه",
      "دوشنبه",
      "سه‌شنبه",
      "چهارشنبه",
      "پنج‌شنبه",
      "جمعه",
      "شنبه",
    ];
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

    const day = date.getDate();
    const month = persianMonths[date.getMonth()];
    const year = date.getFullYear();
    const dayOfWeek = persianDays[date.getDay()];

    return `${dayOfWeek} ${day} ${month} ${year}`;
  };

  const getVehicleType = (vehicle) => {
    const vehicleTypes = {
      Bus: "سفر با اتوبوس",
      Van: "سفر با ون",
      SUV: "سفر با شاسی بلند",
      Airplane: "سفر با هواپیما",
    };
    return vehicleTypes[vehicle] || vehicle;
  };

  const generateTourNumber = () => {
    return Math.floor(100000000 + Math.random() * 900000000).toString();
  };

  const getPersianCityName = (cityName) => {
    const cityMap = {
      Tehran: "تهران",
      Sanandaj: "سنندج",
      Sananndaj: "سنندج",
      Madrid: "مادرید",
      Isfahan: "اصفهان",
      sulaymaniyahTour: "سلیمانیه",
      Sulaymaniyah: "سلیمانیه",
      Kurdistan: "کردستان",
      Kermanshah: "کرمانشاه",
      Shiraz: "شیراز",
      Yazd: "یزد",
      Kashan: "کاشان",
      Tabriz: "تبریز",
      Mashhad: "مشهد",
      Qom: "قم",
      Kerman: "کرمان",
      Zahedan: "زاهدان",
      "Bandar Abbas": "بندرعباس",
      Bushehr: "بوشهر",
      Ahvaz: "اهواز",
      Yasuj: "یاسوج",
      Shahrekord: "شهرکرد",
      Arak: "اراک",
      Hamedan: "همدان",
      Zanjan: "زنجان",
      Qazvin: "قزوین",
      Sari: "ساری",
      Gorgan: "گرگان",
      Urmia: "ارومیه",
      Ardabil: "اردبیل",
      Bojnord: "بجنورد",
      Sanandaj: "سنندج",
      Ilam: "ایلام",
      Khorramabad: "خرم‌آباد",
      Borujerd: "بروجرد",
      Malayer: "ملایر",
      Nahavand: "نهاوند",
      Tuyserkan: "تویسرکان",
      Kangavar: "کنگاور",
      Harsin: "هرسین",
      "Gilan-e-Gharb": "گیلان‌غرب",
      Paveh: "پاوه",
      Javanrud: "جوانرود",
      Ravansar: "روانسر",
      Dalahu: "دالاهو",
      "Salas-e-Babajani": "ثلاث باباجانی",
      "Qasr-e-Shirin": "قصرشیرین",
      "Sarpol-e-Zahab": "سرپل ذهاب",
      Dehloran: "دهلران",
      Mehran: "مهران",
      Abdanan: "آبدانان",
      "Darreh Shahr": "دره‌شهر",
      Ivan: "ایوان",
      Badreh: "بدره",
      Dehloran: "دهلران",
      Mehran: "مهران",
      Abdanan: "آبدانان",
      "Darreh Shahr": "دره‌شهر",
      Ivan: "ایوان",
      Badreh: "بدره",
    };

    return cityMap[cityName] || cityName;
  };

  return (
    <div className={styles.card}>
      <div className={styles.status}>
        <span className={styles.statusText}>به اتمام رسیده</span>
      </div>
      <div className={styles.tourInfo}>
        <h3 className={styles.title}>{tour.title}</h3>
        <div className={styles.transportType}>
          <span className={styles.transportIcon}>
            <Air />
          </span>
          <span className={styles.transportText}>
            {getVehicleType(tour.fleetVehicle)}
          </span>
        </div>
      </div>

      <div className={styles.route}>
        <div className={styles.oneWay}>
          <div>
            <span className={styles.origin}>
              {getPersianCityName(tour.origin.name)}
            </span>
            <span className={styles.arrow}> به </span>
            <span className={styles.destination}>
              {getPersianCityName(tour.destination.name)}
            </span>
          </div>
          <div className={styles.dateValue}>{formatDate(tour.startDate)}</div>
        </div>
        <div className={styles.return}>
          <span className={styles.dateLabel}>تاریخ برگشت:</span>
          <span className={styles.dateValue}>{formatDate(tour.endDate)}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.tourNumber}>
          <span className={styles.numberLabel}>شماره تور:</span>
          <span className={styles.numberValue}>{generateTourNumber()}</span>
        </div>
        <div className={styles.priceInfo}>
          <span className={styles.priceLabel}>مبلغ پرداخت شده:</span>
          <span className={styles.priceValue}>
            {formatPrice(tour.price)} تومان
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserTourCard;
