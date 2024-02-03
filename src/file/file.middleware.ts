import { ConflictException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FileService } from './file.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CheckDuplicateFileMiddleware implements NestMiddleware {
  constructor(private readonly fileService: FileService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const { filename } = req.body;

    const jwtService = new JwtService();

    const token = req.headers.authorization;
    if (token) {
      const decoded = jwtService.decode(token.replace('Bearer ', ''));
      if (decoded) {
        (req as any).username = (decoded as object)['username'];
      } else {
        (req as any).username = null;
      }
    }

    const username = (req as any).username;

    const file = this.fileService.getPublicFile(filename, username);

    if (file) {
      throw new ConflictException('File already exists');
    }
    next();
  }
}
