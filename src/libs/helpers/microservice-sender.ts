import { HttpException, HttpStatus } from '@nestjs/common';
import { MicroserviceResponseStatus } from '../dto';
import { firstValueFrom } from 'rxjs';
import { MsgCategoriesEnum, MsgMarksEnum } from '../enums';
import { ClientProxy } from '@nestjs/microservices';
import { throwErrorIfExists } from '../utils';

type AsyncFunction<T> = () => Promise<T>;

export class MicroserviceSender {
  private static async handleAsyncOperation<T>(
    operation: AsyncFunction<T>,
  ): Promise<T | MicroserviceResponseStatus> {
    try {
      return await operation();
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public static async send<T, U>(
    client: ClientProxy,
    pattern: MsgMarksEnum | MsgCategoriesEnum,
    data: T,
  ) {
    const result = await this.handleAsyncOperation(async () => {
      return await firstValueFrom<U>(client.send(pattern, data));
    });
    throwErrorIfExists(result as MicroserviceResponseStatus);
    return result;
  }
}
