import { IsNotEmpty, IsNumber } from 'class-validator';

export class VerifiedRecvDto {
  @IsNumber()
  @IsNotEmpty()
  verified: number;
}
