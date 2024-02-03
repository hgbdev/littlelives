import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { ConfigModule } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import { CheckDuplicateFileMiddleware } from './file.middleware';

@Module({
  imports: [ConfigModule],
  controllers: [FileController],
  providers: [FileService, UserService, PrismaService],
})
export class FileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckDuplicateFileMiddleware)
      .forRoutes({ path: 'upload', method: RequestMethod.POST });
  }
}
