import { FeatureDto } from 'src/marks/dto/feature.dto';
import { MarkRecvDto } from 'src/marks/dto/mark-recv.dto';

export function transformToFeatureDto(data: MarkRecvDto[]): FeatureDto[] {
  return data.map((mark) => ({
    id: mark.id.toString(),
    type: 'Feature',
    geometry: {
      coordinates: [mark.lng, mark.lat],
      type: 'Point',
    },
    properties: {
      title: mark.title,
      description: mark.description,
      category: mark.category,
      categoryId: mark.categoryId,
      createdAt: mark.createdAt,
      userId: mark.userId,
      distance: mark.distance,
    },
  }));
}
