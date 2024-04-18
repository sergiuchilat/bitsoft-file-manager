import { Test, TestingModule } from '@nestjs/testing';
import { ClassicAuthService } from './classic-auth.service';

describe('ClassicAuthService', () => {
  let service: ClassicAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassicAuthService],
    }).compile();

    service = module.get<ClassicAuthService>(ClassicAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
