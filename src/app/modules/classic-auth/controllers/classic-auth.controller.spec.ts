import { Test, TestingModule } from '@nestjs/testing';
import { ClassicAuthController } from './classic-auth.controller';

describe('ClassicAuthController', () => {
  let controller: ClassicAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassicAuthController],
    }).compile();

    controller = module.get<ClassicAuthController>(ClassicAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
