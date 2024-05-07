import { IsArray, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PageOptionsDto {
  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @ApiPropertyOptional({})
  @IsOptional()
  @IsString()
  readonly orderBy?: string;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly per_page?: number = 10;

  get skip(): number {
    return ((this.page || 1) - 1) * this.per_page;
  }

  getPaginationData(): { take?: number; skip?: number } {
    return {
      take: this.per_page,
      skip: this.skip,
    };
  }
}

export interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}

export class PageMetaDto {
  @ApiProperty()
  readonly current_page: number;

  @ApiProperty()
  readonly per_page: number;

  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly last_page: number;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.current_page = pageOptionsDto.page;
    this.per_page = pageOptionsDto.per_page;
    this.total = itemCount;
    this.last_page = Math.ceil(this.total / this.per_page);
  }
}

export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
