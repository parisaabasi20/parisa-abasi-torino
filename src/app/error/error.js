"use client";

import NotServer from "components/icons/NotServer";
import styles from "./Error.module.css";

function ErrorPage() {
  return (
    <div className={styles.container}>
      <div>
        <NotServer className={styles.icon} />
      </div>
      <div className={styles.textContainer}>
        <h3 className={styles.text}>اتصال با سرور برقرار نیست!</h3>
        <p>لطفا بعدا دوباره امتحان کنید.</p>
      </div>
    </div>
  );
}

export default ErrorPage;
