import { Entity, PrimaryGeneratedColumn, Column, Tree, TreeParent, TreeChildren } from 'typeorm';

@Entity()
@Tree("closure-table")
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @TreeParent()
    parent: Category

    @TreeChildren()
    children: Category[]

    @Column({ unique: true })
    name: string;

    @Column({ nullable: false })
    description: string;
}