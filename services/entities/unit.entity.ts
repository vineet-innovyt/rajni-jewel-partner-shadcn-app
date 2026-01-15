
export class UnitEntity {
    constructor(partial: Partial<UnitEntity>) {
        Object.assign(this, partial);
    }


    unit!: string;//gram, kg, milligram


    value!: string;
}