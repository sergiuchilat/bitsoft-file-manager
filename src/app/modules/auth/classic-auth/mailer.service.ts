import { Injectable } from '@nestjs/common';
import fs from 'node:fs';
import parse from 'node-html-parser';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MailerService {
  async sendActivationEmail (
    email: string,
    activationLink: string,
    name = ''
  ) {
    const notifyServiceUrl = process.env.NOTIFY_SERVICE_URL;
    const notifyServiceApiKey = process.env.NOTIFY_SERVICE_KEY;
    const notifyServiceTemplate = 'registration-confirmation';

    const templateData = fs.readFileSync (`src/data/email-templates/${ notifyServiceTemplate }/en.html`, 'utf8');

    const emailBody = templateData
      .replaceAll ('{PROJECT_NAME}', process.env.PROJECT_NAME)
      .replaceAll ('{LOGO_URL}', process.env.PROJECT_LOGO_URL)
      .replaceAll ('{USER_FULL_NAME}', name)
      .replaceAll ('{CONFIRM_LINK}', activationLink)
      .replaceAll ('{PROJECT_URL}', process.env.PROJECT_URL);

    try {
      const notifySendUrl = `${ notifyServiceUrl }`;
      await this.httpService.axiosRef.post (notifySendUrl, {
        'subject': parse (emailBody).querySelector ('title').text,
        'body': parse (emailBody).querySelector ('body').innerHTML,
        'language': 'en',
        'receivers': [email]
      }, {
        headers: {
          'x-api-key': `${ notifyServiceApiKey }`
        }
      })
        .then (response => {
          console.log ('response', response.data);
          return response.data;
        })
        .catch (error => {
          console.error ('error', error);
          return error;
        });
    } catch (e) {
      console.error (e);
    }

    return emailBody;
  }

  constructor(
    private readonly httpService: HttpService
  ) {}

  async sendResetPasswordEmail (
    email: string,
    name = '',
    resetPasswordLink: string
  ){
    return 'sendPasswordResetEmail';
  }
}
