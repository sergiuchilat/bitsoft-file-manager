import { Response } from 'express';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClassicAuthService } from '@/app/modules/auth/classic-auth/classic-auth.service';
import ClassicAuthLoginPayloadDto from '@/app/modules/auth/classic-auth/dto/classic-auth-login.payload.dto';
import ClassicAuthRegisterPayloadDto from '@/app/modules/auth/classic-auth/dto/classic-auth-register.payload.dto';

@ApiTags ('Classic Auth')
@Controller ({
  version: '1',
  path: 'classic-auth',

})
export class UsersController {
  constructor (
    private readonly classicAuthService: ClassicAuthService,
  ) {
  }

  @Post ('login')
  async login (
    @Body() classicAuthLoginPayloadDto: ClassicAuthLoginPayloadDto,
    @Res () response: Response,
  ) {
    response
      .status (HttpStatus.OK)
      .send (await this.classicAuthService.login (classicAuthLoginPayloadDto));
  }

  @Post ('register')
  async register (
    @Body() classicAuthRegisterPayloadDto: ClassicAuthRegisterPayloadDto,
    @Res () response: Response,
  ) {
    response
      .status (HttpStatus.CREATED)
      .send (await this.classicAuthService.register (classicAuthRegisterPayloadDto));
  }
}
