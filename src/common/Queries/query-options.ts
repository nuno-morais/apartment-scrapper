import { Expose, Type } from 'class-transformer';

export class QueryOptions {
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
            condition.skip = this.start;
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
