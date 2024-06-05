import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { UploadFileRequestDto } from '@/app/modules/file-manager/dtos/upload-file.request.dto';

@Controller("/files")
export class FileManagerController {

  @Post()
  @ApiCreatedResponse({
    description: "" //todo
  })
  uploadFile(@Body() dto: UploadFileRequestDto) {

  }
}