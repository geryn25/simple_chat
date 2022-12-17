import { IsNotEmpty } from "class-validator";

export class CreateChatDto {
    @IsNotEmpty()
    receiver : string

    @IsNotEmpty()
    content : string
}
