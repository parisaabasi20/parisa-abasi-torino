import HomePage from "components/templates/HomePage";

export const metadata = {
  title: "تورینو - برگزار کننده بهترین تورهای داخلی و خارجی",
  description: "تورینو، ارائه دهنده تورهای مسافرتی داخلی و خارجی با بهترین قیمت و کیفیت",
  keywords: "تور مسافرتی, تور داخلی, تور خارجی, رزرو تور",
};

async function getTours() {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "tour", {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!res.ok) {
      console.error('Failed to fetch tours:', res.status);
      return [];
    }
  return await res.json();
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}

export default async function Home({ searchParams }) {
  const tours = await getTours();
  
  const redirect = searchParams?.redirect;
  const expired = searchParams?.expired;
  
  return (
    <main>
      <HomePage 
        initialTours={tours} 
        redirectPath={redirect}
        showExpiredMessage={expired === 'true'}
      />
    </main>
  );
}
