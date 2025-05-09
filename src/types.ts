export interface CropVariety {
  id: string;
  cropName: string;
  varietyName: string;
  expectedYield: number;
  estimatedHarvestDate: string;
  healthRating: number;
}

export interface FilterOptions {
  search: string;
  healthRating: number | null;
  minYield: number;
  maxYield: number;
  sortBy: 'yield-asc' | 'yield-desc' | 'harvest-asc' | 'harvest-desc';
} 