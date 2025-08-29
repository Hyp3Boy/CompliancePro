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


export interface ApiHit {
  source: "The World Bank" | "OFAC Sanctions List" | "Offshore Leaks Database";
  data: {
    [key: string]: string;
  };
}

export interface ApiSearchResponse {
  hitCount: number;
  results: ApiHit[];
}