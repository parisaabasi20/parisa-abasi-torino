"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Edite from "components/icons/Edite";
import styles from "./Profile.module.css";
import { getCookie } from "../../../../core/utils/cookie";

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
      setForm({
        mobile: profileData?.mobile || "",
        email: profileData?.email || "",
      });
    } else if (section === "personal") {
      setIsEditingPersonal(true);
      setForm({
        firstName: profileData?.firstName || "",
        lastName: profileData?.lastName || "",
        gender: profileData?.gender || "",
        nationalCode: profileData?.nationalCode || "",
        birthDate: profileData?.birthDate || "",
      });
    } else if (section === "bank") {
      setIsEditingBank(true);
      setForm({
        debitCard_code: profileData?.payment?.debitCard_code || "",
        shaba_code: profileData?.payment?.shaba_code || "",
        accountIdentifier: profileData?.payment?.accountIdentifier || "",
      });
    }
  };

  const handleCancel = (section) => {
    if (section === "account") {
      setIsEditingAccount(false);
    } else if (section === "personal") {
      setIsEditingPersonal(false);
    } else if (section === "bank") {
      setIsEditingBank(false);
    }
    setForm({});
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
      const profile = data?.user || data;
      if (profile) {
        setProfileData(profile);
        if (typeof window !== "undefined") {
          localStorage.setItem("userProfile", JSON.stringify(profile));
        }
        setSuccess("اطلاعات با موفقیت ذخیره شد!");
        handleCancel(section);
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
          <div className={styles.editForm}>
            <input
              type="text"
              placeholder="شماره موبایل"
              value={form.mobile || ""}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            />
            <input
              type="email"
              placeholder="ایمیل"
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <div className={styles.buttonGroup}>
              <button
                className={styles.btnsS}
                onClick={() => handleSubmit("account")}
              >
                ذخیره
              </button>
              <button
                className={styles.btns}
                onClick={() => handleCancel("account")}
              >
                انصراف
              </button>
            </div>
          </div>
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
          <div>
            <div className={styles.editForm}>
              <input
                type="text"
                placeholder="نام"
                value={form.firstName || ""}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="نام خانوادگی"
                value={form.lastName || ""}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
              <select
                value={form.gender || ""}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="">انتخاب جنسیت</option>
                <option value="male">مرد</option>
                <option value="female">زن</option>
              </select>
              <input
                type="text"
                placeholder="کد ملی"
                value={form.nationalCode || ""}
                onChange={(e) =>
                  setForm({ ...form, nationalCode: e.target.value })
                }
              />
              <input
                type="date"
                placeholder="تاریخ تولد"
                value={form.birthDate || ""}
                onChange={(e) =>
                  setForm({ ...form, birthDate: e.target.value })
                }
              />
            </div>
            <div className={styles.buttonGroup}>
              <button
                className={styles.btnsS}
                onClick={() => handleSubmit("personal")}
              >
                ذخیره
              </button>
              <button
                className={styles.btns}
                onClick={() => handleCancel("personal")}
              >
                انصراف
              </button>
            </div>
          </div>
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
          <div>
            <div className={styles.editForm}>
              <input
                type="text"
                placeholder="شماره کارت"
                value={form.debitCard_code || ""}
                onChange={(e) =>
                  setForm({ ...form, debitCard_code: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="شماره شبا"
                value={form.shaba_code || ""}
                onChange={(e) =>
                  setForm({ ...form, shaba_code: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="شناسه حساب"
                value={form.accountIdentifier || ""}
                onChange={(e) =>
                  setForm({ ...form, accountIdentifier: e.target.value })
                }
              />
            </div>
            <div className={styles.buttonGroup}>
              <button
                className={styles.btnsS}
                onClick={() => handleSubmit("bank")}
              >
                ذخیره
              </button>
              <button
                className={styles.btns}
                onClick={() => handleCancel("bank")}
              >
                انصراف
              </button>
            </div>
          </div>
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
