export class UserSignInDto {
    email!: string;
    password!: string;
}

export class UserSignOutDto {
    authToken!: string;
}