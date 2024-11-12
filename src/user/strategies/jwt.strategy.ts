import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../../interfaces';
import { AUTH_SERVICE_TAG, throwErrorIfExists } from '../../libs/utils';
import { ClientProxy } from '@nestjs/microservices';
import { MsgAuthEnum } from '../../libs/enums';
import { JwtAuthDto, UserDto } from '../dto';
import { firstValueFrom } from 'rxjs';
import { MicroserviceResponseStatus } from '../../libs/dto';
import { handleTimeoutAndErrors } from '../../libs/helpers';

export const JWT_STRATEGY_NAME = 'jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(AUTH_SERVICE_TAG) private client: ClientProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: IJwtPayload) {
    if (!payload)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    const dto: JwtAuthDto = {
      id: payload.id,
      email: payload.email,
      roles: payload.roles,
    };
    const user = await firstValueFrom(
      this.client
        .send<UserDto | MicroserviceResponseStatus>(MsgAuthEnum.JWT_AUTH, dto)
        .pipe(handleTimeoutAndErrors()),
    );
    if (!user) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    throwErrorIfExists(user as MicroserviceResponseStatus);
    return user as UserDto;
  }
}
