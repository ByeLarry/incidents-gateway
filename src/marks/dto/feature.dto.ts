export interface FeatureDto {
  id: string;
  type: string;
  geometry: {
    coordinates: [number, number];
    type: string;
  };
}
