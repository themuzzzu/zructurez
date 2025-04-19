
import { SearchResult } from "./search";

export interface BusinessSearchResult extends SearchResult {
  type: 'business';
  contact?: string;
  hours?: string;
  rating?: number;
  reviews?: number;
  location?: string;
}

