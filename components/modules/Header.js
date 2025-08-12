"use client";
import HamburgerMenu from "components/icons/HamburgerMenu";
import styles from "./Header.module.css";
import LoginMobile from "components/icons/LoginaMobile";
import Link from "next/link";

import { useState, useEffect } from "react";
import LoginModal from "../modules/LoginModal";
import { Suspense } from "react";
import HomeMenu from "components/icons/HomeMenu";
import KhadamatMenu from "components/icons/KhadamatMenu";
import AboutMenu from "components/icons/AboutMenu";
import PhoneMenu from "components/icons/PhoneMenu";
import Contact from "components/icons/Contact";
import Down from "components/icons/Down";
import { getCookie, setCookie } from "../../core/utils/cookie";
import { useRouter } from "next/navigation";
import TorinoMark from "components/icons/TorinoMark";
import Exit from "components/icons/Exit";
import ContactGray from "components/icons/ContactGray";

function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    const phone = getCookie("userPhone");

    if (accessToken && phone) {
      setUser({ phone });
    } else {
      setUser(null);
    }
  }, []);

  const openLoginModal = () => {
    setIsOpen(true);
  };

  const closeLoginModal = () => {
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const closeUserDropdown = () => {
    setIsUserDropdownOpen(false);
  };

  const handleDropdownLinkClick = (href) => {
    closeUserDropdown();
    setTimeout(() => {
      router.push(href);
    }, 150);
  };

  const handleLogout = () => {
    setCookie("accessToken", "", 0);
    setCookie("userPhone", "", 0);
    if (typeof window !== "undefined") {
      localStorage.removeItem("userProfile");
    }
    setUser(null);
    setIsUserDropdownOpen(false);
    router.push("/");
  };

  const handleLoginSuccess = (phoneNumber) => {
    closeLoginModal();

    setUser({ phone: phoneNumber });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isUserDropdownOpen &&
        !event.target.closest(`.${styles.userProfile}`)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.desktopOnly}>
          <Link href="/" className={styles.logoSection}>
            <TorinoMark />
          </Link>
          <nav className={styles.desktopNav}>
            <Link href="/" className={styles.desktopNavLink}>
              صفحه اصلی
            </Link>
            <Link href="/services" className={styles.desktopNavLink}>
              خدمات گردشگری
            </Link>
            <Link href="/about" className={styles.desktopNavLink}>
              درباره ما
            </Link>
            <Link href="/contact" className={styles.desktopNavLink}>
              تماس با ما
            </Link>
          </nav>
          {user ? (
            <div className={styles.userProfile}>
              <button
                className={styles.userButton}
                onClick={toggleUserDropdown}
              >
                <span className={styles.userIcon}>
                  <Contact />
                </span>
                <span className={styles.userPhone}>{user.phone}</span>
                <span className={styles.icon}>
                  <Down />
                </span>
              </button>
              {isUserDropdownOpen && (
                <div className={styles.userDropdown}>
                  <div className={styles.dropdownItem}>
                    <span className={styles.dropdownPhone}>{user.phone}</span>
                  </div>
                  <div className={styles.dropdownItem}>
                    <button
                      onClick={() => handleDropdownLinkClick("/dashboard")}
                    >
                      <span>اطلاعات حساب کاربری</span>
                    </button>
                  </div>
                  <div
                    className={`${styles.dropdownItem} ${styles.logoutItem}`}
                    onClick={handleLogout}
                  >
                    <span className={styles.logoutIcon}>
                      <Exit />
                    </span>
                    <span>خروج از حساب کاربری</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className={styles.desktopLoginBtn} onClick={openLoginModal}>
              <Contact />
              <span style={{ marginLeft: 8 }}>ورود | ثبت نام</span>
            </button>
          )}
        </div>

        <div
          className={styles.mobileOnly}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button className={styles.button} onClick={toggleMenu}>
            <HamburgerMenu />
          </button>
          {user ? (
            <div className={styles.userProfile}>
              <button
                className={styles.userButton}
                onClick={toggleUserDropdown}
              >
                <span className={styles.userIcon}>
                  <Contact />
                </span>
                <span className={styles.userPhone}>{user.phone}</span>
                <span className={styles.icon}>
                  <Down />
                </span>
              </button>
              {isUserDropdownOpen && (
                <div className={styles.userDropdown}>
                  <div className={styles.dropdownItem}>
                    <span className={styles.dropdownPhone}>
                      <ContactGray />
                      {user.phone}
                    </span>
                  </div>
                  <div className={styles.dropdownItem}>
                    <button
                      onClick={() => handleDropdownLinkClick("/dashboard")}
                    >
                      <span>
                        <ContactGray />
                      </span>
                      <span className={styles.info}>اطلاعات حساب کاربری</span>
                    </button>
                  </div>
                  <div
                    className={`${styles.dropdownItem} ${styles.logoutItem}`}
                    onClick={handleLogout}
                  >
                    <span className={styles.logoutIcon}>
                      <Exit />
                    </span>
                    <span>خروج از حساب کاربری</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className={styles.button} onClick={openLoginModal}>
              <LoginMobile />
            </button>
          )}

          <div
            className={styles.menu + (isMenuOpen ? " " + styles.menuOpen : "")}
          >
            <div className={styles.menuContent}>
              <nav className={styles.nav}>
                <ul className={styles.menuList}>
                  <li className={styles.menuItem}>
                    <Link href="/" className={styles.menuLink}>
                      <HomeMenu />
                      <span className={styles.home}>صفحه اصلی</span>
                    </Link>
                  </li>
                  <li className={styles.menuItem}>
                    <Link href="/services" className={styles.menuLink}>
                      <KhadamatMenu />
                      خدمات گردشگری
                    </Link>
                  </li>
                  <li className={styles.menuItem}>
                    <Link href="/about" className={styles.menuLink}>
                      <AboutMenu />
                      درباره ما
                    </Link>
                  </li>
                  <li className={styles.menuItem}>
                    <Link href="/contact" className={styles.menuLink}>
                      <PhoneMenu />
                      تماس با ما
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <Suspense fallback={null}>
          <LoginModal
            isOpen={isOpen}
            onClose={closeLoginModal}
            onLoginSuccess={handleLoginSuccess}
          />
        </Suspense>
        {(isMenuOpen || isUserDropdownOpen) && !isOpen && (
          <div
            className={styles.backdrop}
            onClick={() => {
              closeMenu();
              closeUserDropdown();
            }}
          ></div>
        )}
      </div>
    </header>
  );
}

export default Header;
