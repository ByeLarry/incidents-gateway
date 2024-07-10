export interface MarkRecvDto {
  id: number;
  lat: number;
  lng: number;
  title: string;
  description: string;
  category: {
    id: number;
    name: string;
  };
  categoryId: number;
  createdAt: Date;
  userId: string;
  distance: number;
  verified: number;
  isMyVerify: boolean;
}
