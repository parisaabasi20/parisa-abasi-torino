"use client";
import { useState, useEffect } from "react";
import Down from "components/icons/Down";
import TourCard from "./TourCard";
import styles from "./TourList.module.css";

function TourList({ tours, openLoginModal }) {
  const [showAll, setShowAll] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const displayedTours = isDesktop ? tours : (showAll ? tours : tours.slice(0, 4));

  const handleShowMore = () => {
    setShowAll(true);
  };

  return (
    <div>
      <h1 className={styles.header}>همه تورها</h1>
      <div className={styles.container}>
        {displayedTours.map((t, index) => (
          <TourCard key={t.id} data={t} index={index} openLoginModal={openLoginModal} />
        ))}
      </div>
      {!isDesktop && !showAll && tours.length > 4 && (
        <div className={styles.btnMore}>
          <button className={styles.btn} onClick={handleShowMore}>
            بیشتر
            <Down />
          </button>
        </div>
      )}
    </div>
  );
}

export default TourList;
