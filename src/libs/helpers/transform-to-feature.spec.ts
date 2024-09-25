import { FeatureTransformer } from '.';
import { FeatureDto, MarkRecvDto } from '../../marks/dto';

describe('FeatureTransformer', () => {
  describe('transformToFeatureDto', () => {
    it('should be defined', () => {
      expect(FeatureTransformer).toBeDefined();
    });

    it('should transform a single MarkRecvDto to FeatureDto', () => {
      const mark: MarkRecvDto = {
        id: 1,
        lng: 10,
        lat: 20,
        color: 'red',
        title: 'Test Mark',
        description: 'Test Description',
        categoryId: 1,
        createdAt: new Date(),
        userId: 'user1',
        distance: 100,
      };

      const result = FeatureTransformer.transformToFeatureDto(mark);

      const expected: FeatureDto = {
        id: '1',
        type: 'Feature',
        geometry: {
          coordinates: [10, 20],
          type: 'Point',
        },
        properties: {
          color: 'red',
          title: 'Test Mark',
          description: 'Test Description',
          categoryId: 1,
          createdAt: mark.createdAt,
          userId: 'user1',
          distance: 100,
        },
      };
      expect(result).toBeDefined();
      expect(result).toEqual(expected);
    });

    it('should transform an array of MarkRecvDto to an array of FeatureDto', () => {
      const marks: MarkRecvDto[] = [
        {
          id: 1,
          lng: 10,
          lat: 20,
          color: 'red',
          title: 'Test Mark 1',
          description: 'Test Description 1',
          categoryId: 1,
          createdAt: new Date(),
          userId: 'user1',
          distance: 100,
        },
        {
          id: 2,
          lng: 15,
          lat: 25,
          color: 'blue',
          title: 'Test Mark 2',
          description: 'Test Description 2',
          categoryId: 1,
          createdAt: new Date(),
          userId: 'user2',
          distance: 150,
        },
      ];

      const result = FeatureTransformer.transformToFeatureDto(marks);

      const expected: FeatureDto[] = [
        {
          id: '1',
          type: 'Feature',
          geometry: {
            coordinates: [10, 20],
            type: 'Point',
          },
          properties: {
            color: 'red',
            title: 'Test Mark 1',
            description: 'Test Description 1',
            categoryId: 1,
            createdAt: marks[0].createdAt,
            userId: 'user1',
            distance: 100,
          },
        },
        {
          id: '2',
          type: 'Feature',
          geometry: {
            coordinates: [15, 25],
            type: 'Point',
          },
          properties: {
            color: 'blue',
            title: 'Test Mark 2',
            description: 'Test Description 2',
            categoryId: 1,
            createdAt: marks[1].createdAt,
            userId: 'user2',
            distance: 150,
          },
        },
      ];
      expect(result).toBeDefined();
      expect(result).toEqual(expected);
    });
  });

  describe('transformMarkToFeature', () => {
    it('should throw an error if mark data is invalid', () => {
      expect(() =>
        FeatureTransformer.transformMarkToFeature({} as MarkRecvDto),
      ).toThrow('Invalid mark data');
    });

    it('should transform valid MarkRecvDto to FeatureDto', () => {
      const mark: MarkRecvDto = {
        id: 1,
        lng: 10,
        lat: 20,
        color: 'red',
        title: 'Test Mark',
        description: 'Test Description',
        categoryId: 1,
        createdAt: new Date(),
        userId: 'user1',
        distance: 100,
      };

      const result = FeatureTransformer.transformMarkToFeature(mark);

      const expected: FeatureDto = {
        id: '1',
        type: 'Feature',
        geometry: {
          coordinates: [10, 20],
          type: 'Point',
        },
        properties: {
          color: 'red',
          title: 'Test Mark',
          description: 'Test Description',
          categoryId: 1,
          createdAt: mark.createdAt,
          userId: 'user1',
          distance: 100,
        },
      };
      expect(result).toBeDefined();
      expect(result).toEqual(expected);
    });
  });
});
