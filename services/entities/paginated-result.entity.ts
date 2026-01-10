


export class PaginatedResultEntity<T> {
    items!: T[];
    totalCount!: number;
    pageIndex!: number;
    pageSize!: number;
    hasNextPage!: boolean;
}