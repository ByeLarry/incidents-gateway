import { HttpStatusExtends } from '../enums';

export interface MicroserviceResponseStatus {
  status: HttpStatusExtends;
  message?: string;
}
