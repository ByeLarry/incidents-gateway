import { FeatureDto } from 'src/marks/dto/feature.dto';
import { MarkRecvDto } from 'src/marks/dto/mark-recv.dto';

export function transformToFeatureDto(
  data: MarkRecvDto[] | MarkRecvDto,
): FeatureDto[] | FeatureDto {
  if (!Array.isArray(data)) {
    const test = transformMarkToFeature(data as MarkRecvDto);
    return test;
  }
  return data.map((mark) => transformMarkToFeature(mark));
}

function transformMarkToFeature(mark: MarkRecvDto): FeatureDto {
  return {
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
  };
}
