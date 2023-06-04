import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';
import { Article } from './article';

@Entity("comments-as-guest")
export class CommentAsGuest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, length: 24 })
    commenter: string;

    @ManyToOne(() => Article, { nullable: false })
    article: Article;

    @Column({ nullable: false, length: 1024 })
    content: string;

    @Column({ default: () => 'now()' })
    date_created: Date;
}