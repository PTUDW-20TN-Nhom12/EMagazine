import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';
import { Article } from './article';

@Entity("comments")
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { nullable: false })
    commenter: User;

    @ManyToOne(() => Article, { nullable: false })
    article: Article;

    @Column({ nullable: false, length: 1024 })
    content: string;

    @Column({ default: () => 'now()' })
    date_created: Date;
}