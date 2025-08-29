import axios from 'axios';
import type { ScreeningResults, ApiSearchResponse } from '../types/screeing';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const SEARCH_ENDPOINT = `${API_BASE_URL}/search`;

/**
 * Actúa como un adaptador: obtiene los datos consolidados del backend y los transforma
 * a la estructura requerida por los componentes del frontend.
 * @param entityName El nombre del proveedor a buscar.
 * @param token El JWT para la autorización.
 * @returns Una Promise que resuelve a un objeto con tres arrays separados.
 */
export const fetchScreeningResults = async (entityName: string, token: string): Promise<ScreeningResults> => {
  const config = {
    headers: { Authorization: `Bearer ${token}`, 'X-Api-Key': import.meta.env.VITE_API_KEY },
    params: { entityName }
  };

  try {
    // 1. Obtener la respuesta "cruda" del backend
    const response = await axios.get<ApiSearchResponse>(SEARCH_ENDPOINT, config);

    // 2. Preparar el contenedor con la estructura final que necesita el frontend
    const processedResults: ScreeningResults = {
      offshoreLeaks: [],
      worldBank: [],
      ofac: [],
    };

    // 3. Procesar y adaptar cada elemento de la respuesta
    // Usamos .reduce() para una transformación funcional y limpia
    return response.data.results.reduce((acc, hit, index) => {
      const rawData = hit.data;

      switch (hit.source) {
        case "The World Bank":
          acc.worldBank.push({
            id: index, // Nota: Usamos el índice como ID temporal para la DataGrid. Lo ideal sería que la API proveyera un ID único.
            firmName: rawData["Firm Name"],
            address: rawData["Address"],
            country: rawData["Country"],
            fromDate: rawData["From Date"],
            toDate: rawData["To Date"],
            grounds: rawData["Grounds"],
          });
          break;

        case "OFAC Sanctions List":
          acc.ofac.push({
            id: index,
            name: rawData["Name"],
            address: rawData["Address"],
            type: rawData["Type"],
            program: rawData["Program(s)"],
            list: rawData["List"],
            // Transformación de tipo: Convertimos el string 'Score' a un número.
            // El '|| 0' es un fallback seguro en caso de que parseInt devuelva NaN.
            score: parseInt(rawData["Score"], 10) || 0,
          });
          break;

        case "Offshore Leaks Database":
          // Mapeo de campos para Offshore Leaks
          acc.offshoreLeaks.push({
            id: index,
            entity: rawData["Entity"],
            jurisdiction: rawData["Jurisdiction"],
            linkedTo: rawData["Linked To"],
            dataFrom: rawData["Data From"],
          });
          break;
      }

      return acc; // Devolvemos el acumulador para la siguiente iteración
    }, processedResults); // El valor inicial de nuestro acumulador es el contenedor vacío

  } catch (error) {
    console.error("Error en la capa de adaptación de screening:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Fallo en la comunicación con la API de screening: ${error.message}`);
    }
    throw new Error("Ocurrió un error inesperado durante el procesamiento de los resultados.");
  }
};