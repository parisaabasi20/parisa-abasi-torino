
import "./globals.css";
import Header from "components/modules/Header";
import Footer from "components/modules/Footer";
import { Suspense } from "react";

export const metadata = {
  title: "تورینو - برگزار کننده بهترین تورهای داخلی و خارجی",
  description: "تورینو، ارائه دهنده تورهای مسافرتی داخلی و خارجی با بهترین قیمت و کیفیت",
  keywords: "تور مسافرتی, تور داخلی, تور خارجی, رزرو تور",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <Header />
        <Suspense fallback={null}>
          {children}
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}
