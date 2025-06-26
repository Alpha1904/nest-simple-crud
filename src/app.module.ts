import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { PrismaService } from './prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ProductsModule } from './product/products.module';


@Module({
  imports: [ConfigModule.forRoot(), CategoryModule, PrismaModule, ProductsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
