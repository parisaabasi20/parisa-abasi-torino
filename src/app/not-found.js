import NotFound from "components/icons/NotFound";
import styles from "./not-found.module.css";

function NotFoundPage() {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <NotFound />
      </div>
      <div className={styles.textContainer}>
        <h3 className={styles.text}>صفحه مورد نظر یافت نشد!</h3>
        <button className={styles.textBtn}>بازگشت به صفحه اصلی</button>
      </div>
    </div>
  );
}

export default NotFoundPage;
