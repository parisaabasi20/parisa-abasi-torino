import Footer1 from "components/icons/Footer1";
import Footer2 from "components/icons/Footer2";
import Footer3 from "components/icons/Footer3";
import Footer4 from "components/icons/Footer4";
import Footer5 from "components/icons/Footer5";
import TorinoMark from "components/icons/TorinoMark";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div>
          <h3>تورینو</h3>
          <p>درباره ما</p>
          <p>تماس با ما</p>
          <p>چرا تورینو</p>
          <p>بیمه مسافرتی</p>
        </div>
        <div>
          <h3>خدمات مشتریان</h3>
          <p>پشتیبانی آنلاین</p>
          <p>راهنمای خرید</p>
          <p>راهنمای استرداد</p>
          <p>پرسش و پاسخ</p>
        </div>
      </div>
      <div className={styles.subContainerEnd}>
        <div className={styles.icons}>
          <Footer1 />
          <Footer2 />
          <Footer3 />
          <Footer4 />
          <Footer5 />
        </div>
        <div className={styles.torino}>
          <TorinoMark />
          <p>تلفن پشتیبانی:021-8574</p>
        </div>
      </div>
      <p className={styles.text}>کلیه حقوق این وب سایت متعلق به تورینو میباشد.</p>
    </div>
  );
}

export default Footer;
