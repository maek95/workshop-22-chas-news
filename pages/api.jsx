export async function fetchDataByCategory(category, apiKey) {
  try {
    const res = await fetch(
      `https://newsdata.io/api/1/news?apikey=${apiKey}&country=us&language=en&category=${category}`
    );
    const data = await res.json();
    if (res.ok) {
      console.log("ok");
      return data.results;//s
    } else {
      throw new Error(data.error || 'Failed to fetch data');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return null; // Return null to indicate fetching failed
  }
}
