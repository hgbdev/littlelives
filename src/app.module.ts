import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
