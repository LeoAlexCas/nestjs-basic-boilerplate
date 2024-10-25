import { IsNotEmpty, IsString, Matches } from "class-validator";

export class AuthCredentialesDto {
    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: "====Dto de pass===" })
    password: string;
};