import { Expose, Type } from 'class-transformer';

export class QueryOptions {
    public static fromQueryOptions(options: QueryOptions | any): QueryOptions {
        const qo = new QueryOptions();
        if (options != null) {
            qo.end = options._end || options.end;
            qo.order = options._order || options.order;
            qo.sort = options._sort || options.sort;
            qo.start = options._start || options.start;
        }
        return qo;
    }

    @Type(() => Number)
    @Expose({ name: '_end' })
    public end: number;

    @Expose({ name: '_order' })
    public order: string;

    @Expose({ name: '_sort' })
    public sort: string;

    @Type(() => Number)
    @Expose({ name: '_start' })
    public start: number;

    public toMongoQuery() {
        const condition: { skip, take, order } = { skip: undefined, take: undefined, order: undefined };
        if (this.start != null) {
            condition.skip = this.start - 0;
        }
        if (this.start != null && this.end != null) {
            condition.take = this.end - this.start;
        }
        if (this.order != null && this.sort != null) {
            condition.order = { [this.sort]: this.order };
        }
        return condition;
    }
}
