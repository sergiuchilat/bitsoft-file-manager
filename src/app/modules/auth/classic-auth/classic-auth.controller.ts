import { Response } from 'express';
import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClassicAuthService } from './classic-auth.service';
import ClassicAuthRegisterPayloadDto from './dto/classic-auth-register.payload.dto';
import ClassicAuthLoginPayloadDto from './dto/classic-auth-login.payload.dto';

@ApiTags ('Auth: Classic')
@Controller ({
  version: '1',
  path: 'auth/classic',

})
export class ClassicAuthController {
  constructor (
    private readonly classicAuthService: ClassicAuthService,
  ) {
  }

  @ApiOperation ({summary: 'User login with email and password'})
  @Post ('login')
  async login (
    @Body() classicAuthLoginPayloadDto: ClassicAuthLoginPayloadDto,
    @Res () response: Response,
  ) {
    response
      .status (HttpStatus.OK)
      .send (await this.classicAuthService.login (classicAuthLoginPayloadDto));
  }

  @ApiOperation ({summary: 'User registration with email and password'})
  @Post ('register')
  async register (
    @Body() classicAuthRegisterPayloadDto: ClassicAuthRegisterPayloadDto,
    @Res () response: Response,
  ) {
    response
      .status (HttpStatus.CREATED)
      .send (await this.classicAuthService.register (classicAuthRegisterPayloadDto));
  }

  @ApiOperation ({summary: 'Activate user account'})
  @Patch ('activate/:token')
  async activate (
    @Res () response: Response,
    @Param ('token', ParseUUIDPipe) token: string,
  ) {
    response
      .status (HttpStatus.OK)
      .send (await this.classicAuthService.activate (token));
  }

  @ApiOperation ({summary: 'Resend activation email(---! needs to be implemented)'})
  @Post ('activate/resend')
  resendActivationEmail () {
    return 'resendActivationEmail';
  }

  @ApiOperation ({summary: 'Request password reset(---! needs to be implemented)'})
  @Post ('password/reset/request')
  resetPasswordStart () {
    return 'resetPassword';
  }

  @ApiOperation ({summary: 'Confirm password reset(---! needs to be implemented)'})
  @Patch ('password/reset/confirm')
  resetPasswordConfirm () {
    return 'resetPassword';
  }

  @ApiOperation ({summary: 'Change password(---! needs to be implemented)'})
  @Patch ('password/change')
  changePassword () {
    return 'changePassword';
  }

  @ApiOperation ({summary: 'Logout user'})
  @Delete ('logout')
  logout () {
    return 'logout';
  }

  @ApiOperation ({summary: 'Update email(---! needs to be implemented)'})
  @Patch ('email/update')
  updateEmail() {
    return 'updateEmail';
  }



}
