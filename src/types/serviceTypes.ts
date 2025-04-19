
import { SearchResult } from "./search";

export interface ServiceSearchResult extends SearchResult {
  type: 'service';
  provider?: string;
  availabilityStatus?: string;
  rating?: number;
  price?: number;
}

