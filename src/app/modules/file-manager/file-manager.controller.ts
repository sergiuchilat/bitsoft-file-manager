import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiCreatedResponse } from '@nestjs/swagger';
import { UploadFileRequestDto } from '@/app/modules/file-manager/dtos/upload-file.request.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller("/files")
export class FileManagerController {

  @Post()
  @ApiCreatedResponse({
    description: "" //todo
  })
  @ApiBody({
    description: 'File upload',
    type: UploadFileRequestDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('content'))
  uploadFile(@Body() dto: UploadFileRequestDto, @UploadedFile() content: Express.Multer.File) {
    console.log(dto, content);
  }

  @Post("/test")
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('content'))
  uploadFileTest(@UploadedFile() content: Express.Multer.File) {
    console.log(content);
  }
}