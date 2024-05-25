import PaginatorConfigInterface from '@/database/interfaces/paginator-config.interface';
import PaginateMetaResponseDto from '@/app/response/dto/paginate-meta-response.dto';

export class PaginateResponseDto<Entity> {
  readonly data: Entity[];
  readonly meta: PaginateMetaResponseDto;

  constructor(paginator: PaginatorConfigInterface, response: [Entity[], number]) {
    [this.data] = response;
    this.meta = new PaginateMetaResponseDto(paginator, response);
  }
}
