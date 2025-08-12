"use client";
import ContactGray from "components/icons/ContactGray";
import styles from "./Basket.module.css";
import { DatePicker } from "zaman";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getCookie } from "core/utils/cookie";
import { useRouter } from "next/navigation";

const basketSchema = yup.object({
  fullName: yup
    .string()
    .min(2, "نام و نام خانوادگی باید حداقل ۲ کاراکتر باشد")
    .required("نام و نام خانوادگی الزامی است"),
  nationalCode: yup
    .string()
    .matches(/^\d{10}$/, "کد ملی باید ۱۰ رقم باشد")
    .required("کد ملی الزامی است"),
  birthDate: yup.string().required("تاریخ تولد الزامی است"),
  gender: yup
    .string()
    .oneOf(["male", "female"], "لطفاً جنسیت را انتخاب کنید")
    .required("جنسیت الزامی است"),
});

function Basket() {
  const [tour, setTour] = useState(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(basketSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const fetchBasket = async () => {
      const token = getCookie("accessToken");
      const res = await fetch("http://localhost:6500/basket", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTour(data[0]);
        } else if (data && typeof data === "object") {
          setTour(data);
        } else {
          setTour(null);
        }
      } else {
        setTour(null);
      }
    };
    fetchBasket();
  }, []);

  const onSubmit = async (formData) => {
    const token = getCookie("accessToken");

    const res = await fetch("http://localhost:6500/order", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/order?paymentLink=${encodeURIComponent(data.paymentLink)}`);
    } else {
      alert("خطا در ثبت سفارش");
    }
  };

  const formatPrice = (price) => {
    if (!price) return "";
    const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let priceStr = price.toString();
    priceStr = priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    for (let i = 0; i < 10; i++) {
      priceStr = priceStr.replace(
        new RegExp(englishNumbers[i], "g"),
        persianNumbers[i]
      );
    }
    return priceStr;
  };

  const getDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const nights = diffDays - 1;
    return `${diffDays} روز و ${nights} شب`;
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        <h3>
          <ContactGray />
          مشخصات مسافر
        </h3>
        <div className={styles.inputsContainer}>
          <input {...register("fullName")} placeholder="نام و نام خانوادگی" />
          {errors.fullName && (
            <span className={styles.error}>{errors.fullName.message}</span>
          )}

          <input {...register("nationalCode")} placeholder="کد ملی" />
          {errors.nationalCode && (
            <span className={styles.error}>{errors.nationalCode.message}</span>
          )}

          <Controller
            name="birthDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                inputClass={styles.dateInput}
                value={field.value ? { value: field.value } : null}
                onChange={(date) => field.onChange(date?.value || "")}
                round="x2"
                locale="fa"
                style={{ width: "80%" }}
                inputAttributes={{ placeholder: "تاریخ تولد" }}
              />
            )}
          />
          {errors.birthDate && (
            <span className={styles.error}>{errors.birthDate.message}</span>
          )}

          <select {...register("gender")} className={styles.selection}>
            <option value="">جنسیت</option>
            <option value="male">مرد</option>
            <option value="female">زن</option>
          </select>
          {errors.gender && (
            <span className={styles.error}>{errors.gender.message}</span>
          )}
        </div>
      </form>

      <div className={styles.buyInfo}>
        {tour ? (
          <>
            <div className={styles.title}>
              <h3>{tour.title}</h3>
              <p>{getDuration(tour.startDate, tour.endDate)}</p>
            </div>
            <div className={styles.price}>
              <p>قیمت نهایی</p>
              <p>
                <span>{formatPrice(tour.price)}</span>
                تومان
              </p>
            </div>
            <button
              className={styles.btn}
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "در حال ثبت..." : "ثبت و خرید نهایی"}
            </button>
          </>
        ) : (
          <div>loading...</div>
        )}
      </div>
    </div>
  );
}

export default Basket;
