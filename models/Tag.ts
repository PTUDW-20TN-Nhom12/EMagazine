import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity("tags")
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 25 })
    name: string;

    @Column({ nullable: false, length: 256 })
    description: string;
}
