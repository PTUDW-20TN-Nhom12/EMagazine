import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Category } from './Category';

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { nullable: false })
    author: User;

    @ManyToOne(() => Category, { nullable: false })
    category: Category;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false, length: 256 })
    short_description: string;

    @Column({ nullable: false, length: 40000 })
    content: string;

    @Column({ nullable: false, length: 256 })
    thumbnail_url: string;

    @Column({ default: () => 'now()' })
    date_created: Date;

    @Column({ default: 0 })
    status: number;

    @Column({ default: false })
    is_premium: boolean;
}