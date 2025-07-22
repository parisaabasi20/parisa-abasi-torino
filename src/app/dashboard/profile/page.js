"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Edite from "components/icons/Edite";
import styles from "./Profile.module.css";

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function Profile() {
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("accessToken");
    if (!token) {
      router.push("/");
      return;
    }

    const phone = getCookie("userPhone") || "";
    setUserPhone(phone);
    console.log("userPhone set to:", phone);

    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem("userProfile");
      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile);
          setProfileData(parsedProfile);
          console.log("Loaded from localStorage:", parsedProfile); // لاگ برای دیباگ
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
            localStorage.removeItem("userProfile"); // پاک کردن localStorage
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
        console.log("API response:", data);

        const profile = data?.user || data;
        if (profile && profile.id && profile.mobile) {
          setProfileData(profile);
          if (typeof window !== "undefined") {
            localStorage.setItem("userProfile", JSON.stringify(profile));
            console.log("Saved to localStorage:", profile);
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
  }, [router]);

  const handleEdit = (section) => {
    setError("");
    setSuccess("");
    if (section === "account") {
      setForm({
        mobile: profileData?.mobile || userPhone || "",
        email: profileData?.email || "",
      });
      setIsEditingAccount(true);
    }
    if (section === "personal") {
      setForm({
        firstName: profileData?.firstName || "",
        lastName: profileData?.lastName || "",
        gender: profileData?.gender || "",
        nationalCode: profileData?.nationalCode || "",
        birthDate: profileData?.birthDate || "",
      });
      setIsEditingPersonal(true);
    }
    if (section === "bank") {
      setForm({
        debitCard_code: profileData?.payment?.debitCard_code || "",
        shaba_code: profileData?.payment?.shaba_code || "",
        accountIdentifier: profileData?.payment?.accountIdentifier || "",
      });
      setIsEditingBank(true);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (section) => {
    setError("");
    setSuccess("");
    const token = getCookie("accessToken");
    if (!token) {
      setError("برای مشاهده یا ویرایش اطلاعات باید وارد حساب کاربری شوید.");
      return;
    }
    try {
      const updatedData = { ...profileData };
      if (section === "account") {
        updatedData.mobile = form.mobile;
        updatedData.email = form.email;
      }
      if (section === "personal") {
        updatedData.firstName = form.firstName;
        updatedData.lastName = form.lastName;
        updatedData.gender = form.gender;
        updatedData.nationalCode = form.nationalCode;
        updatedData.birthDate = form.birthDate;
      }
      if (section === "bank") {
        updatedData.payment = {
          debitCard_code: form.debitCard_code,
          shaba_code: form.shaba_code,
          accountIdentifier: form.accountIdentifier,
        };
      }
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
      const data = await res.json();
      console.log("API response after submit:", data);
      const profile = data?.user || data;
      if (profile && profile.id && profile.mobile) {
        setProfileData(profile);
        setIsEditingAccount(false);
        setIsEditingPersonal(false);
        setIsEditingBank(false);
        setSuccess("اطلاعات با موفقیت ذخیره شد.");
        if (typeof window !== "undefined") {
          localStorage.setItem("userProfile", JSON.stringify(profile));
          console.log("Saved to localStorage after submit:", profile);
        }
      } else {
        setError("داده‌های پروفایل از سرور نامعتبر است!");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("خطا در ارتباط با سرور!");
    }
  };

  return (
    <div className={styles.profileWrapper}>
      {isLoading && <div className={styles.loadingMsg}>در حال بارگذاری...</div>}
      {error && <div className={styles.errorMsg}>{error}</div>}
      {success && <div className={styles.successMsg}>{success}</div>}

      {!isLoading && (
        <div className={styles.accountInfo}>
          <h3 className={styles.header}>اطلاعات حساب کاربری</h3>
          {isEditingAccount ? (
            <form
              className={styles.accountInfoForm}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit("account");
              }}
            >
              <div className={styles.accountInfoRow}>
                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  className={styles.accountInfoInput}
                  placeholder="شماره موبایل"
                  disabled
                />
              </div>
              <div className={styles.accountInfoRow}>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={styles.accountInfoInput}
                  placeholder="ایمیل"
                />
              </div>
              <button className={styles.accountInfoBtn} type="submit">
                تایید
              </button>
              <button
                className={styles.accountInfoBtn}
                type="button"
                onClick={() => setIsEditingAccount(false)}
              >
                انصراف
              </button>
            </form>
          ) : (
            <>
              <div className={styles.accountInfoRow}>
                <p className={styles.accountInfoLabel}>شماره موبایل</p>
                <p className={styles.accountInfoValue}>
                  {profileData?.mobile || userPhone || "-"}
                </p>
              </div>
              <div className={styles.accountInfoRow}>
                <p className={styles.accountInfoLabel}>ایمیل</p>
                <p className={styles.accountInfoValue}>
                  {profileData?.email || "-"}
                </p>
                <button
                  className={styles.accountInfoBtn}
                  onClick={() => handleEdit("account")}
                >
                  <Edite />
                  {profileData?.email ? "ویرایش" : "افزودن"}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {!isLoading && (
        <div className={styles.personalInfo}>
          <div className={styles.personalInfoHeader}>
            <h3 className={styles.header}>اطلاعات شخصی</h3>
            {!isEditingPersonal && (
              <button
                className={styles.personalInfoEditBtn}
                onClick={() => handleEdit("personal")}
              >
                <Edite />
                ویرایش اطلاعات
              </button>
            )}
          </div>
          {isEditingPersonal ? (
            <form
              className={styles.personalInfoForm}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit("personal");
              }}
            >
              <div className={styles.personalInfoRow}>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className={styles.personalInfoInput}
                  placeholder="نام"
                />
              </div>
              <div className={styles.personalInfoRow}>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className={styles.personalInfoInput}
                  placeholder="نام خانوادگی"
                />
              </div>
              <div className={styles.personalInfoRow}>
                <input
                  name="nationalCode"
                  value={form.nationalCode}
                  onChange={handleChange}
                  className={styles.personalInfoInput}
                  placeholder="کد ملی"
                />
              </div>
              <div className={styles.personalInfoRow}>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={styles.personalInfoInput}
                >
                  <option value="">جنسیت</option>
                  <option value="male">مرد</option>
                  <option value="female">زن</option>
                </select>
              </div>
              <div className={styles.personalInfoRow}>
                <input
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  className={styles.personalInfoInput}
                  placeholder="تاریخ تولد"
                  type="date"
                />
              </div>
              <button className={styles.personalInfoEditBtn} type="submit">
                تایید
              </button>
              <button
                className={styles.personalInfoEditBtn}
                type="button"
                onClick={() => setIsEditingPersonal(false)}
              >
                انصراف
              </button>
            </form>
          ) : (
            <>
              <div className={styles.personalInfoRow}>
                <p className={styles.personalInfoLabel}>نام و نام خانوادگی</p>
                <p className={styles.personalInfoValue}>
                  {profileData?.firstName || "-"} {profileData?.lastName || ""}
                </p>
              </div>
              <div className={styles.personalInfoRow}>
                <p className={styles.personalInfoLabel}>کد ملی</p>
                <p className={styles.personalInfoValue}>
                  {profileData?.nationalCode || "-"}
                </p>
              </div>
              <div className={styles.personalInfoRow}>
                <p className={styles.personalInfoLabel}>جنسیت</p>
                <p className={styles.personalInfoValue}>
                  {profileData?.gender === "male"
                    ? "مرد"
                    : profileData?.gender === "female"
                    ? "زن"
                    : "-"}
                </p>
              </div>
              <div className={styles.personalInfoRow}>
                <p className={styles.personalInfoLabel}>تاریخ تولد</p>
                <p className={styles.personalInfoValue}>
                  {profileData?.birthDate || "-"}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {!isLoading && (
        <div className={styles.bankInfo}>
          <div className={styles.bankInfoHeader}>
            <h3 className={styles.header}>اطلاعات حساب بانکی</h3>
            {!isEditingBank && (
              <button
                className={styles.bankInfoEditBtn}
                onClick={() => handleEdit("bank")}
              >
                <Edite />
                ویرایش اطلاعات
              </button>
            )}
          </div>
          {isEditingBank ? (
            <form
              className={styles.bankInfoForm}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit("bank");
              }}
            >
              <div className={styles.bankInfoRow}>
                <input
                  name="debitCard_code"
                  value={form.debitCard_code}
                  onChange={handleChange}
                  className={styles.bankInfoInput}
                  placeholder="شماره کارت"
                />
              </div>
              <div className={styles.bankInfoRow}>
                <input
                  name="accountIdentifier"
                  value={form.accountIdentifier}
                  onChange={handleChange}
                  className={styles.bankInfoInput}
                  placeholder="شماره حساب"
                />
              </div>
              <div className={styles.bankInfoRow}>
                <input
                  name="shaba_code"
                  value={form.shaba_code}
                  onChange={handleChange}
                  className={styles.bankInfoInput}
                  placeholder="شماره شبا"
                />
              </div>
              <button className={styles.bankInfoEditBtn} type="submit">
                تایید
              </button>
              <button
                className={styles.bankInfoEditBtn}
                type="button"
                onClick={() => setIsEditingBank(false)}
              >
                انصراف
              </button>
            </form>
          ) : (
            <>
              <div className={styles.bankInfoRow}>
                <p className={styles.bankInfoLabel}>شماره کارت</p>
                <p className={styles.bankInfoValue}>
                  {profileData?.payment?.debitCard_code || "-"}
                </p>
              </div>
              <div className={styles.bankInfoRow}>
                <p className={styles.bankInfoLabel}>شماره شبا</p>
                <p className={styles.bankInfoValue}>
                  {profileData?.payment?.shaba_code || "-"}
                </p>
              </div>
              <div className={styles.bankInfoRow}>
                <p className={styles.bankInfoLabel}>شماره حساب</p>
                <p className={styles.bankInfoValue}>
                  {profileData?.payment?.accountIdentifier || "-"}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
