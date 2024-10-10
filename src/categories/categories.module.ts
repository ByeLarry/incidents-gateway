import { Module } from '@nestjs/common';
import { AuthServiceProvide, MarksServiceProvide } from '../libs/utils';
import { GUARDS } from '../guards';
import { CategoriesController } from './categories.controller';

@Module({
  controllers: [CategoriesController],
  providers: [MarksServiceProvide, AuthServiceProvide, ...GUARDS],
})
export class CategoriesModule {}
