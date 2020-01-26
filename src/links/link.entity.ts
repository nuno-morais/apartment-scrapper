import { IsNotEmpty, IsUrl } from 'class-validator';
import { Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Link {
    // tslint:disable-next-line: variable-name
    public _id: ObjectID;

    @ObjectIdColumn()
    public id: ObjectID;

    @IsNotEmpty()
    @IsUrl()
    @Column()
    public url: string;

    @Column()
    public provider: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column()
    public userId: string;
}
