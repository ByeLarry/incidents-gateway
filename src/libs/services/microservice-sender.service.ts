import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MicroserviceResponseStatus } from '../dto';
import { firstValueFrom } from 'rxjs';
import { MsgAuthEnum, MsgCategoriesEnum, MsgMarksEnum } from '../enums';
import { ClientProxy } from '@nestjs/microservices';
import { throwErrorIfExists, TIMEOUT_ERROR_MESSAGE } from '../utils';
import { AppLoggerService, handleTimeoutAndErrors } from '../helpers';

type AsyncFunction<T> = () => Promise<T>;

@Injectable()
export class MicroserviceSenderService {
  constructor(private readonly logger: AppLoggerService) {}

  private async handleAsyncOperation<T>(
    operation: AsyncFunction<T>,
  ): Promise<T | MicroserviceResponseStatus> {
    try {
      return await operation();
    } catch (error) {
      this.logger.error(`Message - ${error.message}`);
      if (error.message === TIMEOUT_ERROR_MESSAGE)
        throw new HttpException(error.message, HttpStatus.REQUEST_TIMEOUT);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async send<T, U>(
    client: ClientProxy,
    pattern: MsgMarksEnum | MsgCategoriesEnum | MsgAuthEnum,
    data: T,
  ) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom<U>(
        client.send(pattern, data).pipe(handleTimeoutAndErrors()),
      );
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    return result;
  }
}
