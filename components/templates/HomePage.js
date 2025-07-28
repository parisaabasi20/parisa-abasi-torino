"use client"
import Image from 'next/image'
import styles from "./HomePage.module.css";
import SearchForm from 'components/search/SearchForm';
import api from "../../core/config/api";
import { useState, useEffect } from "react";
import TourList from 'components/tour/TourList';
import LoginModal from 'components/modules/LoginModal';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactUs from 'components/modules/ContactUs';
import AboutUs from 'components/modules/AboutUs';

function HomePage({ initialTours = [], redirectPath, showExpiredMessage }) {
  const [tours, setTours] = useState(initialTours);
  const [searched, setSearched] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);


  useEffect(() => {
    if (showExpiredMessage) {
      toast.error("جلسه شما منقضی شده است. لطفاً دوباره وارد شوید.");
    }
    
    if (redirectPath) {
      toast.info("برای دسترسی به این صفحه، لطفاً وارد حساب کاربری خود شوید.");
    }
  }, [showExpiredMessage, redirectPath]);

  const handleSearch = async (filters) => {
    if (!filters.origin && !filters.destination && !filters.date) {
      setTours(initialTours);
      setSearched(false);
      return;
    }
    const res = await api.get("/tour");
    let filtered = res.data;
    if (filters.origin) {
      filtered = filtered.filter(t => t.origin.name.toLowerCase() === filters.origin.toLowerCase());
    }
    if (filters.destination) {
      filtered = filtered.filter(t => t.destination.name.toLowerCase() === filters.destination.toLowerCase());
    }
    if (filters.date) {
      filtered = filtered.filter(t => t.startDate.startsWith(filters.date));
    }
    setTours(filtered);
    setSearched(true);
  };

  return (
    <div>
      <div className={styles.bannerWrapper}>
        <Image
          src="/images/banner.png"
          alt="بنر"
          fill
          className={styles.banner}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <h1 className={styles.title}>تورینو برگزار کننده بهترین تور های داخلی و خارجی</h1>
      <SearchForm onSearch={handleSearch}/>
      <TourList tours={tours} openLoginModal={openLoginModal} />
      <ContactUs />
      {/* <AboutUs /> */}
      <LoginModal isOpen={isLoginOpen} onClose={closeLoginModal} />
      <ToastContainer position="top-center" rtl />
    </div>
  )
}

export default HomePage