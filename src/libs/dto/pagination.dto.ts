import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsPositive()
  readonly page: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsPositive()
  readonly limit: number;

  @IsNotEmpty()
  @IsString()
  readonly sort: string;
}
