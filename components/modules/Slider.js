"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./Slider.module.css";

const images = [
  "/images/sliderImage/S2.jpg",
  "/images/sliderImage/S1.jpg",
  "/images/sliderImage/S3.jpg",
  "/images/sliderImage/S4.jpg",
];

export default function Slider() {
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.slider}>
        {images.map((src, i) => {
          const className =
            i === index
              ? styles.active
              : i === (index - 1 + images.length) % images.length
              ? styles.previous
              : styles.inactive;

          return (
            <div
              key={i}
              className={`${styles.imageWrapper} ${className}`}
              onClick={next}
            >
              <Image
                src={src}
                alt={`Slide ${i + 1}`}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 390px, 600px"
              />
            </div>
          );
        })}
      </div>

      <div className={styles.controls}>
        <button onClick={prev} className={styles.arrow}>
          &lt;
        </button>
        <span className={styles.counter}>
          {index + 1} / {images.length}
        </span>
        <button onClick={next} className={styles.arrow}>
          &gt;
        </button>
      </div>
    </div>
  );
}
