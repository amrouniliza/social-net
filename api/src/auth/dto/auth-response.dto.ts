import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {
    @ApiProperty({
        example: 'Operation successful',
        description: 'The message of the response',
    })
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}