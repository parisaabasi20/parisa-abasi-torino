import TourDetail from "../../../../components/tour/TourDetail";

async function getTour(id) {
  try {
    const response = await fetch("http://localhost:6500/tour");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const allTours = await response.json();
    console.log("Tours data:", allTours);

    if (!allTours || allTours.length === 0) {
      return { success: false, error: "No tours available" };
    }

    const tourIndex = parseInt(id) - 1;

    if (tourIndex < 0 || tourIndex >= allTours.length) {
      return {
        success: false,
        error: `Tour index ${tourIndex} out of range. Available tours: ${allTours.length}`,
      };
    }

    const tour = allTours[tourIndex];
    return { success: true, tour };
  } catch (error) {
    console.error("API Error details:", error);
    return {
      success: false,
      error: `API Error: ${error.message}`,
    };
  }
}

export default async function TourPage({ params }) {
  const result = await getTour(params.id);

  if (!result.success) {
    return (
      <div
        style={{
          padding: "20px",
          fontSize: "16px",
          color: "#333",
        }}
      >
        <h2>Error:</h2>
        <p>Tour ID requested: {params.id}</p>
        <p>Error: {result.error}</p>
      </div>
    );
  }

  return (
    <div>
      <TourDetail tour={result.tour} />
    </div>
  );
}
