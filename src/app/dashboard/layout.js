"use client";
import Link from "next/link";
import styles from "./DashboardLayout.module.css";
import { usePathname } from "next/navigation";
import ContactGray from "components/icons/ContactGray";
import Lamp from "components/icons/Lamp";
import Trakonesh from "components/icons/Trakonesh";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  return (
    <div>
      <nav className={styles.menu}>
        <Link
          href="/dashboard/profile"
          className={pathname === "/dashboard/profile" ? styles.active : ""}
        >
          <span className={styles.icon}>
            <ContactGray />
          </span>
          <span className={styles.text}>پروفایل</span>
        </Link>
        <Link
          href="/dashboard/tours"
          className={pathname === "/dashboard/tours" ? styles.active : ""}
        >
          <span className={styles.icon}>
            <Lamp />
          </span>
          <span className={styles.text}>تورهای من</span>
        </Link>
        <Link
          href="/dashboard/transactions"
          className={
            pathname === "/dashboard/transactions" ? styles.active : ""
          }
        >
          <span className={styles.icon}>
            <Trakonesh />
          </span>
          <span className={styles.text}>تراکنش‌ها</span>
        </Link>
      </nav>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
