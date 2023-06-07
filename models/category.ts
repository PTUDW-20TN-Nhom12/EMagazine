import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Article } from './article';
import { Role } from './role';

@Entity("categories")
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 25 })
    name: string;

    @Column({ nullable: false, length: 256 })
    description: string;

    @ManyToOne(() => Category, (category) => category.children)
    parent: Category

    @OneToMany(() => Category, (category) => category.parent, {cascade: true})
    children: Category[]

    @OneToMany(() => Article, (article) => article.category, {cascade: true})
    articles: Article[]

    @OneToMany(() => Role, (role) => role.category, {cascade: true})
    roles: Role[]
}