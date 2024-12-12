import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsNotEmpty,
  Length,
} from 'class-validator';

export class PropertiesDto {
  @ApiProperty({
    description: 'Заголовок свойства. Должен быть строкой от 3 до 100 символов.',
    example: 'Авария на мосту',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @ApiProperty({
    description: 'Описание свойства. Необязательное поле с максимальной длиной 200 символов.',
    example: 'Местоположение аварии на центральном мосту города.',
    required: false,
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  description?: string;

  @ApiProperty({
    description: 'ID категории свойства. Должен быть числом.',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({
    description: 'Дата и время создания свойства.',
    example: '2024-12-12T12:00:00.000Z',
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({
    description: 'ID пользователя, создавшего свойство.',
    example: 'user-123',
  })
  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  userId: string;

  @ApiProperty({
    description: 'Расстояние до точки, связанной с этим свойством. Необязательное поле.',
    example: 15.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  distance?: number;

  @ApiProperty({
    description: 'Цвет, связанный с этим свойством. Необязательное поле, длина не должна превышать 20 символов.',
    example: 'red',
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  color?: string;
}
