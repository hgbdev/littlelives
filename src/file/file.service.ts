import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FileService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  bucketName = this.configService.get('AWS_BUCKET_NAME');
  s3 = new S3({
    accessKeyId: this.configService.get('AWS_ACCESS_ID'),
    secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
  });

  async uploadPublicFile(
    dataBuffer: Buffer,
    filename: string,
    username: string,
    size: number,
  ) {
    try {
      const uploadResult = await this.s3
        .upload({
          Bucket: this.bucketName,
          Body: dataBuffer,
          Key: `${username}/${filename}`,
          ACL: 'public-read',
          ContentDisposition: 'inline',
        })
        .promise();

      const user = await this.userService.getUser(username);

      const file = await this.prisma.file.create({
        data: {
          filename,
          size,
          s3Url: uploadResult.Location,
          userId: user.id,
        },
      });

      return file;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async getListPublicFile(username: string) {
    const user = await this.userService.getUser(username);

    const files = await this.prisma.file.findMany({
      where: {
        userId: user.id,
      },
    });

    return files;
  }

  async getPublicFile(filename: string, username: string) {
    const user = await this.userService.getUser(username);

    const file = await this.prisma.file.findFirst({
      where: {
        filename,
        userId: user.id,
      },
    });

    return file;
  }

  async deletePublicFile(filename: string, username: string) {
    try {
      await this.s3
        .deleteObject({
          Bucket: this.bucketName,
          Key: `${username}/${filename}`,
        })
        .promise();

      const user = await this.userService.getUser(username);

      const file = await this.prisma.file.findFirst({
        where: {
          filename,
          userId: user.id,
        },
      });
      if (!file) {
        return null;
      }

      await this.prisma.file.delete({
        where: {
          id: file.id,
        },
      });

      return file;
    } catch (error) {
      console.log(error);

      return null;
    }
  }
}
