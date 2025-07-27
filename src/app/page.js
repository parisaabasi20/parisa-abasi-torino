import HomePage from "components/templates/HomePage";

async function getTours() {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "tour", { 
      cache: "no-store",
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
