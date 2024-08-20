import { FeatureDto } from 'src/marks/dto/feature.dto';
import { MarkRecvDto } from 'src/marks/dto/mark-recv.dto';

export class FeatureTransformer {
  static transformToFeatureDto(
    data: MarkRecvDto[] | MarkRecvDto,
  ): FeatureDto[] | FeatureDto {
    if (!Array.isArray(data)) {
      const test = this.transformMarkToFeature(data as MarkRecvDto);
      return test;
    }
    return data.map((mark) => this.transformMarkToFeature(mark));
  }

  static transformMarkToFeature(mark: MarkRecvDto): FeatureDto {
    return {
      id: mark.id.toString(),
      type: 'Feature',
      geometry: {
        coordinates: [mark.lng, mark.lat],
        type: 'Point',
      },
      properties: {
        color: mark.color,
        title: mark.title,
        description: mark.description,
        categoryId: mark.categoryId,
        createdAt: mark.createdAt,
        userId: mark.userId,
        distance: mark.distance,
      },
    };
  }
}
