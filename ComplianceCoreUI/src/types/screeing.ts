// --- TIPOS EXISTENTES (PARA EL FRONTEND) ---
// Estos se mantienen igual, son nuestro objetivo.
export interface OffshoreLeakResult {
  id: number;
  entity: string;
  jurisdiction: string;
  linkedTo: string;
  dataFrom: string;
}

export interface WorldBankResult {
  id: number;
  firmName: string;
  address: string;
  country: string;
  fromDate: string;
  toDate: string;
  grounds: string;
}

export interface OfacResult {
  id: number;
  name: string;
  address: string;
  type: string;
  program: string;
  list: string;
  score: number;
}

export interface ScreeningResults {
  offshoreLeaks: OffshoreLeakResult[];
  worldBank: WorldBankResult[];
  ofac: OfacResult[];
}


// --- NUEVOS TIPOS (PARA LA RESPUESTA REAL DE LA API) ---
// Estos tipos describen exactamente lo que recibimos del backend.

// Representa un único resultado dentro del array `results`
export interface ApiHit {
  source: "The World Bank" | "OFAC Sanctions List" | "Offshore Leaks Database";
  data: {
    // Usamos un índice de firma porque las claves tienen espacios y son diferentes para cada fuente
    [key: string]: string;
  };
}

// Representa la respuesta completa de la API
export interface ApiSearchResponse {
  hitCount: number;
  results: ApiHit[];
}