import { ApiProperty } from '@nestjs/swagger';

export class UserPayload {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string;
}

export class AuthResponseDto {
  @ApiProperty()
  access_token!: string;

  @ApiProperty()
  refresh_token?: string;

  @ApiProperty({ type: UserPayload })
  user!: UserPayload;
}
