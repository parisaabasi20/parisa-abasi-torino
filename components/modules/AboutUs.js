import styles from "./AboutUs.module.css";
import Slider from "./Slider";

function AboutUs() {
  return (
    <div className={styles.container}>
      <div className={styles.description}>
        <h2 className={styles.title}>
          چرا <span className={styles.highlight}>تورینو</span>؟
        </h2>
        <div className={styles.subText}>
          تور طبیعت گردی و تاریخی اگر دوست داشته باشید که یک جاذبه طبیعی را از
          نزدیک ببینید و در دل طبیعت چادر بزنید یا در یک اقامتگاه بوم گردی اتاق
          بگیرید، باید تورهای طبیعت‌گردی را خریداری کنید. اما اگر بخواهید از
          جاذبه‌های گردشگری و آثار تاریخی یک مقصد خاص بازدید کنید، می‌توانید
          تورهای فرهنگی و تاریخی را خریداری کنید.
        </div>
      </div>
      <div className={styles.slider}>
        <Slider />
      </div>
    </div>
  );
}

export default AboutUs;
