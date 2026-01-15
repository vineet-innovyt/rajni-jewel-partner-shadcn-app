import { UserEntity } from "./user.entity";

export class SignInSuccessEntity {
    accessToken!: string;
    refreshToken!: string;
    user!: UserEntity
}