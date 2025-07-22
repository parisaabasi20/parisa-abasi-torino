"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import OTPInput from "react18-input-otp";
import api from "../../core/config/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./LoginModal.module.css";
import Back from "components/icons/Back";
import Close from "components/icons/Close";
import { setCookie } from "../../core/utils/cookie";

const schema = yup.object({
  mobile: yup
    .string()
    .required("شماره موبایل الزامی است")
    .matches(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
});

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [inputCode, setInputCode] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitMobile = async (data) => {
    try {
      setMobile(data.mobile);
      const res = await api.post("/auth/send-otp", {
        mobile: data.mobile,
      });

      if (res.data.code) {
        toast.success(`کد اعتبارسنجی ارسال شد: ${res.data.code}`);
      } else {
        toast.success("کد اعتبارسنجی ارسال شد");
      }

      setStep(2);
    } catch (error) {
      toast.error("ارسال کد ناموفق بود");
    }
  };

  const onSubmitOtp = async () => {
    try {
      console.log("Submitting OTP:", {
        mobile,
        code: inputCode,
        codeLength: inputCode.length,
      });
      const res = await api.post("/auth/check-otp", {
        mobile,
        code: inputCode,
      });

      setCookie("accessToken", res.data.accessToken, 1);
      setCookie("refreshToken", res.data.refreshToken, 7);
      setCookie("userPhone", mobile, 1);


      try {
        const profileRes = await fetch("http://localhost:6500/user/profile", {
          headers: { Authorization: `Bearer ${res.data.accessToken}` },
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData && profileData.user) {
            localStorage.setItem(
              "userProfile",
              JSON.stringify(profileData.user)
            );
          }
        }
      } catch (e) {}

      toast.success("ورود با موفقیت انجام شد");

      // Call the callback to update Header state
      if (onLoginSuccess) {
        onLoginSuccess(mobile);
      }

      onClose();
      setStep(1);
      setInputCode("");
    } catch (error) {
      toast.error("کد وارد شده اشتباه است");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.modalHeaderIcon}>
            {step === 1 ? (
              <button onClick={onClose} className={styles.iconButton}>
                <Close />
              </button>
            ) : (
              <button
                onClick={() => {
                  setStep(1);
                  setInputCode("");
                }}
                className={styles.iconButton}
              >
                <Back />
              </button>
            )}
          </div>
          {step === 1 && (
            <form onSubmit={handleSubmit(onSubmitMobile)} className={styles.form}>
              <h2 className={styles.title}>ورود به تورینو</h2>
              <p className={styles.textOne}>شماره موبایل خود را وارد کنید</p>
              <input
                type="text"
                placeholder="09122223456"
                {...register("mobile")}
                className={ errors.mobile ? styles.inputError : ""}
              />
              <p className={styles.errorText}>{errors.mobile?.message}</p>
              <button type="submit" className={styles.btnSubmit}>
                ارسال کد تایید
              </button>
            </form>
          )}

          {step === 2 && (
            <div>
              <h2 className={styles.title}>کد تایید را وارد کنید</h2>
              <p>کد ارسال شده: {inputCode.length}/6</p>
              <div
                className={styles.otp}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  direction: "ltr",
                }}
              >
                <OTPInput
                  value={inputCode}
                  onChange={setInputCode}
                  numInputs={6}
                  inputType="number"
                  inputStyle={{
                    width: "40px",
                    height: "40px",
                    margin: "5px 3px",
                    fontSize: "24px",
                    textAlign: "center",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                  renderInput={(props) => (
                    <input
                      {...props}
                      maxLength={1}
                      style={{
                        width: "40px",
                        height: "40px",
                        margin: "5px 3px",
                        fontSize: "24px",
                        textAlign: "center",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        display: "block",
                      }}
                    />
                  )}
                />
              </div>
              <button
                onClick={onSubmitOtp}
                disabled={inputCode.length !== 6}
                className={styles.btnSubmit}
              >
                ورود به تورینو
              </button>
            </div>
          )}
        </div>
      </div>

      <ToastContainer position="top-center" />
    </>
  );
}
