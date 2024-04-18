import { Response } from 'express';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClassicAuthService } from '../services/classic-auth.service';
import ClassicAuthRegisterPayloadDto from '../dto/classic-auth-register.payload.dto';
import ClassicAuthLoginPayloadDto from '../dto/classic-auth-login.payload.dto';

@ApiTags ('Classic Auth')
@Controller ({
  version: '1',
  path: 'auth/classic',

})
export class ClassicAuthController {
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
