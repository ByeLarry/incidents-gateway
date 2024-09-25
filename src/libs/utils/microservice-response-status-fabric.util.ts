import { MicroserviceResponseStatus } from '../dto';
import { HttpStatusExtends } from '../enums';

export class MicroserviceResponseStatusFabric {
  static create(
    status: HttpStatusExtends,
    message?: string,
  ): MicroserviceResponseStatus {
    return {
      status,
      message,
    };
  }
}
