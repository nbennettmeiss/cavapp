
export enum WineType {
  RED = 'Red',
  WHITE = 'White',
  ROSE = 'Rosé',
  SPARKLING = 'Sparkling',
  FORTIFIED = 'Fortified'
}

export interface FlavorProfile {
  body: number; // 1-5
  tannins: number; // 1-5
  acidity: number; // 1-5
  sweetness: number; // 1-5
}

export interface Wine {
  id: string;
  name: string;
  winery: string;
  region: string;
  country: string;
  year: number;
  type: WineType;
  grapes: string;
  bottles: number;
  price?: number;
  purchaseDate: string;
  windowStart: number;
  windowEnd: number;
  location: string;
  notes: string;
  image?: string;
  createdAt: number;
  tastingNotes?: string[];
  pairings?: string[];
  flavorProfile?: FlavorProfile;
}

export interface ConsumptionLog {
  id: string;
  wineId: string;
  wineName: string;
  date: string;
  notes?: string;
}

export type ViewType = 'home' | 'inventory' | 'stats' | 'history' | 'add' | 'scan' | 'detail' | 'concierge';
