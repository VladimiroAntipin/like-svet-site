export function getStoreId() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const parts = apiUrl.split("/"); // divide http://localhost:3000/api/689ee540a309d28eaaddf017
  return parts[parts.length - 1]; // prende l'ultimo segmento = storeId
}