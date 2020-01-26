import { Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn, UpdateDateColumn } from 'typeorm';
import { ApartmentMetadata } from './apartment-metada';

@Entity()
export class Apartment {
    // tslint:disable-next-line: variable-name
    public _id: ObjectID;

    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    public image: string;

    @Column()
    public title: string;

    @Column()
    public price: string;

    @Column(type => ApartmentMetadata)
    public ads: ApartmentMetadata[];

    @Column({ default: false })
    public isHidden: boolean;

    @Column({ default: false })
    public isFavorite: boolean;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column()
    public userId: string;
}
