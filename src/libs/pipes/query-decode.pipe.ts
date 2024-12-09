import {  Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class QueryDecodePipe implements PipeTransform {
  transform(value: any) {
    return decodeURIComponent(value);
  }
}
