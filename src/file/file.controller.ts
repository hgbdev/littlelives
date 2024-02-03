import {
  BadRequestException,
  ConflictException,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/user.guard';
import { UserService } from 'src/user/user.service';
import { businessResponse } from 'src/utils/helpers';

@ApiTags('file')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly userService: UserService,
  ) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file,
    @Req() req: any,
  ) {
    if (!file) {
      throw new NotFoundException('File not found');
    }

    const username = req.user.username;
    const quota = await this.userService.checkQuota(file.size, username);
    if (!quota) {
      throw new BadRequestException('Quota exceeded');
    }

    const fileExists = await this.fileService.getPublicFile(
      file.originalname,
      username,
    );
    if (fileExists) {
      throw new ConflictException('File already exists');
    }

    const uploadResult = await this.fileService.uploadPublicFile(
      file.buffer,
      file.originalname,
      username,
      file.size,
    );
    if (!uploadResult) {
      throw new BadRequestException('Failed to upload file, please try again');
    }

    await this.userService.increaseUsage(username, file.size);

    return businessResponse('Upload file success', 201, uploadResult);
  }

  @Get('/list')
  async getListPublicFile(@Req() req: any) {
    const username = req.user.username;
    const files = await this.fileService.getListPublicFile(username);
    return businessResponse('Get list file success', 200, files);
  }

  @Get('/:filename')
  async getPublicFile(@Param('filename') filename: string, @Req() req: any) {
    const username = req.user.username;
    const file = await this.fileService.getPublicFile(filename, username);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    return businessResponse('Get file success', 200, file);
  }

  @Delete('/:filename')
  async deleteFile(@Param('filename') filename: string, @Req() req: any) {
    const username = req.user.username;
    const file = await this.fileService.deletePublicFile(filename, username);
    if (!file) {
      throw new NotFoundException('Failed to delete file, file not found');
    }

    await this.userService.decreaseUsage(username, file.size);

    return businessResponse('Delete file success', 200, file);
  }
}
