import WhyTorino from "components/icons/WhyTorino";
import styles from "./ContactUs.module.css";
import Image from "next/image";
import Phone from "components/icons/Phone";
import WhyTorinoL from "components/icons/WhyTorinoL";

function ContactUs() {
  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <h3 className={styles.bannerTitle}>
          خرید تلفنی از <span className={styles.bannerTitleTorino}>تورینو</span>
        </h3>
        <p className={styles.bannerDescription}>به هرکجا که میخواهید!</p>
        <div className={styles.bannerIconL}>
          <WhyTorinoL />
        </div>
        <div className={styles.bannerIcon}>
          <WhyTorino />
        </div>
      </div>
      <div className={styles.contactUs}>
        <p className={styles.number}>
          <span>021-1840</span>
          <Phone />
        </p>
        <button className={styles.btn}>اطلاعات بیشتر</button>
      </div>
    </div>
  );
}

export default ContactUs;
