import { PartnerEntity } from "./partner.entity";
import { ClientAppEntity, UserEntity } from "./user.entity";

export class UserContextEntity {
    user!: UserEntity | null;
    clientApp!: ClientAppEntity;
    tenantCode!: string;
    partner!: PartnerEntity;
}
