
export class CodeItemEntity {
    constructor(partial: Partial<CodeItemEntity>) {
        Object.assign(this, partial);
    }

    code?: string;
    value?: string;
}