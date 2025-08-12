"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Edite from "components/icons/Edite";
import styles from "./Profile.module.css";
import { getCookie } from "../../../../core/utils/cookie";

const accountSchema = yup.object({
  mobile: yup
    .string()
    .matches(/^09\d{9}$/, "شماره موبایل باید با 09 شروع شود و 11 رقم باشد")
    .required("شماره موبایل الزامی است"),
  email: yup.string().email("ایمیل معتبر نیست").required("ایمیل الزامی است"),
});

const personalSchema = yup.object({
  firstName: yup
    .string()
    .min(2, "نام باید حداقل 2 کاراکتر باشد")
    .required("نام الزامی است"),
  lastName: yup
    .string()
    .min(2, "نام خانوادگی باید حداقل 2 کاراکتر باشد")
    .required("نام خانوادگی الزامی است"),
  gender: yup
    .string()
    .oneOf(["male", "female"], "لطفاً جنسیت را انتخاب کنید")
    .required("جنسیت الزامی است"),
  nationalCode: yup
    .string()
    .matches(/^\d{10}$/, "کد ملی باید 10 رقم باشد")
    .required("کد ملی الزامی است"),
  birthDate: yup.string().required("تاریخ تولد الزامی است"),
});

const bankSchema = yup.object({
  debitCard_code: yup
    .string()
    .matches(/^\d{16}$/, "شماره کارت باید 16 رقم باشد")
    .required("شماره کارت الزامی است"),
  shaba_code: yup
    .string()
    .matches(/^IR\d{24}$/, "شماره شبا باید با IR شروع شود و 26 کاراکتر باشد")
    .required("شماره شبا الزامی است"),
  accountIdentifier: yup
    .string()
    .min(5, "شناسه حساب باید حداقل 5 کاراکتر باشد")
    .required("شناسه حساب الزامی است"),
});

function Profile() {
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const accountForm = useForm({
    resolver: yupResolver(accountSchema),
    mode: "onChange",
  });

  const personalForm = useForm({
    resolver: yupResolver(personalSchema),
    mode: "onChange",
  });

  const bankForm = useForm({
    resolver: yupResolver(bankSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const token = getCookie("accessToken");
    const phone = getCookie("userPhone") || "";
    setUserPhone(phone);

    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem("userProfile");
      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile);
          setProfileData(parsedProfile);
        } catch (err) {
          console.error("Error parsing localStorage userProfile:", err);
          setError("خطا در بارگذاری اطلاعات ذخیره‌شده!");
        }
      }
    }

    setIsLoading(true);
    fetch("http://localhost:6500/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          setError("دسترسی غیرمجاز! لطفاً دوباره وارد شوید.");
          if (typeof window !== "undefined") {
            localStorage.removeItem("userProfile");
          }
          return null;
        }
        if (!res.ok) {
          setError("خطا در دریافت اطلاعات پروفایل! لطفاً دوباره تلاش کنید.");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        const profile = data?.user || data;
        if (profile && profile.id && profile.mobile) {
          setProfileData(profile);
          if (typeof window !== "undefined") {
            localStorage.setItem("userProfile", JSON.stringify(profile));
          }
        } else {
          setError("داده‌های پروفایل از سرور نامعتبر است!");
          if (typeof window !== "undefined") {
            localStorage.removeItem("userProfile");
          }
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setError(
          "خطا در ارتباط با سرور! لطفاً اتصال اینترنت خود را بررسی کنید."
        );
        setIsLoading(false);
      });
  }, []);

  const handleEdit = (section) => {
    if (section === "account") {
      setIsEditingAccount(true);
      accountForm.reset({
        mobile: profileData?.mobile || "",
        email: profileData?.email || "",
      });
    } else if (section === "personal") {
      setIsEditingPersonal(true);
      personalForm.reset({
        firstName: profileData?.firstName || "",
        lastName: profileData?.lastName || "",
        gender: profileData?.gender || "",
        nationalCode: profileData?.nationalCode || "",
        birthDate: profileData?.birthDate || "",
      });
    } else if (section === "bank") {
      setIsEditingBank(true);
      bankForm.reset({
        debitCard_code: profileData?.payment?.debitCard_code || "",
        shaba_code: profileData?.payment?.shaba_code || "",
        accountIdentifier: profileData?.payment?.accountIdentifier || "",
      });
    }
  };

  const handleCancel = (section) => {
    if (section === "account") {
      setIsEditingAccount(false);
      accountForm.reset();
    } else if (section === "personal") {
      setIsEditingPersonal(false);
      personalForm.reset();
    } else if (section === "bank") {
      setIsEditingBank(false);
      bankForm.reset();
    }
  };

  const onSubmitAccount = async (data) => {
    setError("");
    setSuccess("");
    const token = getCookie("accessToken");
    if (!token) {
      setError("برای مشاهده یا ویرایش اطلاعات باید وارد حساب کاربری شوید.");
      return;
    }
    try {
      const updatedData = { ...profileData };
      updatedData.mobile = data.mobile;
      updatedData.email = data.email;

      const res = await fetch("http://localhost:6500/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (res.status === 401 || res.status === 403) {
        setError("دسترسی غیرمجاز! لطفاً دوباره وارد شوید.");
        if (typeof window !== "undefined") {
          localStorage.removeItem("userProfile");
        }
        return;
      }
      if (!res.ok) {
        setError("خطا در ذخیره اطلاعات!");
        return;
      }
      const responseData = await res.json();
      const profile = responseData?.user || responseData;
      if (profile) {
        setProfileData(profile);
        if (typeof window !== "undefined") {
          localStorage.setItem("userProfile", JSON.stringify(profile));
        }
        setSuccess("اطلاعات با موفقیت ذخیره شد!");
        handleCancel("account");
      }
    } catch (error) {
      setError("خطا در ذخیره اطلاعات!");
    }
  };

  const onSubmitPersonal = async (data) => {
    setError("");
    setSuccess("");
    const token = getCookie("accessToken");
    if (!token) {
      setError("برای مشاهده یا ویرایش اطلاعات باید وارد حساب کاربری شوید.");
      return;
    }
    try {
      const updatedData = { ...profileData };
      updatedData.firstName = data.firstName;
      updatedData.lastName = data.lastName;
      updatedData.gender = data.gender;
      updatedData.nationalCode = data.nationalCode;
      updatedData.birthDate = data.birthDate;

      const res = await fetch("http://localhost:6500/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (res.status === 401 || res.status === 403) {
        setError("دسترسی غیرمجاز! لطفاً دوباره وارد شوید.");
        if (typeof window !== "undefined") {
          localStorage.removeItem("userProfile");
        }
        return;
      }
      if (!res.ok) {
        setError("خطا در ذخیره اطلاعات!");
        return;
      }
      const responseData = await res.json();
      const profile = responseData?.user || responseData;
      if (profile) {
        setProfileData(profile);
        if (typeof window !== "undefined") {
          localStorage.setItem("userProfile", JSON.stringify(profile));
        }
        setSuccess("اطلاعات با موفقیت ذخیره شد!");
        handleCancel("personal");
      }
    } catch (error) {
      setError("خطا در ذخیره اطلاعات!");
    }
  };

  const onSubmitBank = async (data) => {
    setError("");
    setSuccess("");
    const token = getCookie("accessToken");
    if (!token) {
      setError("برای مشاهده یا ویرایش اطلاعات باید وارد حساب کاربری شوید.");
      return;
    }
    try {
      const updatedData = { ...profileData };
      updatedData.payment = {
        debitCard_code: data.debitCard_code,
        shaba_code: data.shaba_code,
        accountIdentifier: data.accountIdentifier,
      };

      const res = await fetch("http://localhost:6500/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (res.status === 401 || res.status === 403) {
        setError("دسترسی غیرمجاز! لطفاً دوباره وارد شوید.");
        if (typeof window !== "undefined") {
          localStorage.removeItem("userProfile");
        }
        return;
      }
      if (!res.ok) {
        setError("خطا در ذخیره اطلاعات!");
        return;
      }
      const responseData = await res.json();
      const profile = responseData?.user || responseData;
      if (profile) {
        setProfileData(profile);
        if (typeof window !== "undefined") {
          localStorage.setItem("userProfile", JSON.stringify(profile));
        }
        setSuccess("اطلاعات با موفقیت ذخیره شد!");
        handleCancel("bank");
      }
    } catch (error) {
      setError("خطا در ذخیره اطلاعات!");
    }
  };

  if (isLoading) {
    return <div>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      {success && <div className={styles.success}>{success}</div>}

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>اطلاعات حساب کاربری</h2>
          {!isEditingAccount && (
            <button
              className={styles.EditeBtn}
              onClick={() => handleEdit("account")}
            >
              <Edite />
              افزودن
            </button>
          )}
        </div>
        {isEditingAccount ? (
          <form
            onSubmit={accountForm.handleSubmit(onSubmitAccount)}
            className={styles.editForm}
          >
            <input
              type="text"
              placeholder="شماره موبایل"
              {...accountForm.register("mobile")}
            />
            {accountForm.formState.errors.mobile && (
              <span className={styles.error}>
                {accountForm.formState.errors.mobile.message}
              </span>
            )}
            <input
              type="email"
              placeholder="ایمیل"
              {...accountForm.register("email")}
            />
            {accountForm.formState.errors.email && (
              <span className={styles.error}>
                {accountForm.formState.errors.email.message}
              </span>
            )}
            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={styles.btnsS}
                disabled={accountForm.formState.isSubmitting}
              >
                {accountForm.formState.isSubmitting
                  ? "در حال ذخیره..."
                  : "ذخیره"}
              </button>
              <button
                type="button"
                className={styles.btns}
                onClick={() => handleCancel("account")}
              >
                انصراف
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.info}>
            <p>
              <span>شماره موبایل</span>
              <span>{profileData?.mobile || "-"}</span>
            </p>
            <p>
              <span>ایمیل</span>
              <span>{profileData?.email || "-"}</span>
            </p>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>اطلاعات شخصی</h2>
          {!isEditingPersonal && (
            <button
              className={styles.EditeBtn}
              onClick={() => handleEdit("personal")}
            >
              <Edite />
              ویرایش اطلاعات
            </button>
          )}
        </div>
        {isEditingPersonal ? (
          <form onSubmit={personalForm.handleSubmit(onSubmitPersonal)}>
            <div className={styles.editForm}>
              <input
                type="text"
                placeholder="نام"
                {...personalForm.register("firstName")}
              />
              {personalForm.formState.errors.firstName && (
                <span className={styles.error}>
                  {personalForm.formState.errors.firstName.message}
                </span>
              )}
              <input
                type="text"
                placeholder="نام خانوادگی"
                {...personalForm.register("lastName")}
              />
              {personalForm.formState.errors.lastName && (
                <span className={styles.error}>
                  {personalForm.formState.errors.lastName.message}
                </span>
              )}
              <select {...personalForm.register("gender")}>
                <option value="">انتخاب جنسیت</option>
                <option value="male">مرد</option>
                <option value="female">زن</option>
              </select>
              {personalForm.formState.errors.gender && (
                <span className={styles.error}>
                  {personalForm.formState.errors.gender.message}
                </span>
              )}
              <input
                type="text"
                placeholder="کد ملی"
                {...personalForm.register("nationalCode")}
              />
              {personalForm.formState.errors.nationalCode && (
                <span className={styles.error}>
                  {personalForm.formState.errors.nationalCode.message}
                </span>
              )}
              <input
                type="date"
                placeholder="تاریخ تولد"
                {...personalForm.register("birthDate")}
              />
              {personalForm.formState.errors.birthDate && (
                <span className={styles.error}>
                  {personalForm.formState.errors.birthDate.message}
                </span>
              )}
            </div>
            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={styles.btnsS}
                disabled={personalForm.formState.isSubmitting}
              >
                {personalForm.formState.isSubmitting
                  ? "در حال ذخیره..."
                  : "ذخیره"}
              </button>
              <button
                type="button"
                className={styles.btns}
                onClick={() => handleCancel("personal")}
              >
                انصراف
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.info}>
            <p>
              <span>نام</span>
              <span>{profileData?.firstName || "-"}</span>
            </p>
            <p>
              <span>نام خانوادگی</span>
              <span>{profileData?.lastName || "-"}</span>
            </p>
            <p>
              <span>جنسیت</span>
              <span>{profileData?.gender || "-"}</span>
            </p>
            <p>
              <span>کد ملی</span>
              <span>{profileData?.nationalCode || "-"}</span>
            </p>
            <p>
              <span>تاریخ تولد</span>
              <span>{profileData?.birthDate || "-"}</span>
            </p>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>اطلاعات بانکی</h2>
          {!isEditingBank && (
            <button
              className={styles.EditeBtn}
              onClick={() => handleEdit("bank")}
            >
              <Edite />
              ویرایش اطلاعات
            </button>
          )}
        </div>
        {isEditingBank ? (
          <form onSubmit={bankForm.handleSubmit(onSubmitBank)}>
            <div className={styles.editForm}>
              <input
                type="text"
                placeholder="شماره کارت"
                {...bankForm.register("debitCard_code")}
              />
              {bankForm.formState.errors.debitCard_code && (
                <span className={styles.error}>
                  {bankForm.formState.errors.debitCard_code.message}
                </span>
              )}
              <input
                type="text"
                placeholder="شماره شبا"
                {...bankForm.register("shaba_code")}
              />
              {bankForm.formState.errors.shaba_code && (
                <span className={styles.error}>
                  {bankForm.formState.errors.shaba_code.message}
                </span>
              )}
              <input
                type="text"
                placeholder="شناسه حساب"
                {...bankForm.register("accountIdentifier")}
              />
              {bankForm.formState.errors.accountIdentifier && (
                <span className={styles.error}>
                  {bankForm.formState.errors.accountIdentifier.message}
                </span>
              )}
            </div>
            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={styles.btnsS}
                disabled={bankForm.formState.isSubmitting}
              >
                {bankForm.formState.isSubmitting ? "در حال ذخیره..." : "ذخیره"}
              </button>
              <button
                type="button"
                className={styles.btns}
                onClick={() => handleCancel("bank")}
              >
                انصراف
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.info}>
            <p>
              <span>شماره کارت</span>
              <span>{profileData?.payment?.debitCard_code || "-"}</span>
            </p>
            <p>
              <span>شماره شبا</span>
              <span>{profileData?.payment?.shaba_code || "-"}</span>
            </p>
            <p>
              <span>شناسه حساب</span>
              <span>{profileData?.payment?.accountIdentifier || "-"}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
