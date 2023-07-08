import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user';
import { Category } from './category';
import { Tag } from './tag';

@Entity("articles")
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { nullable: false })
    author: User;

    @ManyToOne(() => Category, (category) => category.articles)
    category: Category;

    @Column({ nullable: false, length: 256 })
    title: string;

    @Column({ nullable: false, length: 256 })
    short_description: string;

    @Column({ nullable: false, length: 40000 })
    content: string;

    @Column({ nullable: false, length: 256 })
    thumbnail_url: string;

    @Column({ default: false })
    is_premium: boolean;

    @Column({default: null, nullable: true})
    date_published: Date;

    @ManyToMany(() => Tag)
    @JoinTable()
    tags: Tag[]
}