export default async function sitemap() {
  const baseUrl = 'https://torino.ir';

  try {
    const toursResponse = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "tour", {
      next: { revalidate: 3600 },
    });
    
    let tours = [];
    if (toursResponse.ok) {
      tours = await toursResponse.json();
    }

    const tourUrls = tours.map((tour, index) => ({
      url: `${baseUrl}/tour/${index + 1}`,
      lastModified: new Date(),
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/services`,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
      },
      ...tourUrls,
    ];
  } catch (error) {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
      },
    ];
  }
} 