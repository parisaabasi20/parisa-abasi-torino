"use client";
import { useSearchParams } from "next/navigation";

export default function Order() {
  const searchParams = useSearchParams();
  const paymentLink = searchParams.get("paymentLink");

  return (
    <div>
      <h2>پرداخت سفارش</h2>
      {paymentLink ? (
        <a href={paymentLink} target="_blank" rel="noopener noreferrer">
          رفتن به صفحه پرداخت
        </a>
      ) : (
        <p >لینک پرداخت یافت نشد.</p>
      )}
    </div>
  );
}