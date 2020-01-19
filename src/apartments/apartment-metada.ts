import { Column, Entity, ObjectIdColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class ApartmentMetadata {
    @ObjectIdColumn()
    // tslint:disable-next-line:variable-name
    public id: string;

    @Column()
    public title: string;

    @Column()
    public url: string;

    @Column()
    public price: string;

    @Column()
    public img: string;

    @CreateDateColumn()
    public createdAt: string;

    @Column()
    public provider: string;

    constructor(data: Partial<ApartmentMetadata> = null) {
        if (data) {
            for (const key in data) {
                if (data[key] != null) {
                    this[key] = data[key];
                }
            }
        }
    }
}
