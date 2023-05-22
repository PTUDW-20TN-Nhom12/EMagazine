import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Article } from './Article';
import { User } from './User';

@Entity()
export class ArticleStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Article, { nullable: false })
    article: Article;

    @ManyToOne(() => User, { nullable: false })
    performer: User;

    @Column({ default: 0 })
    status: number;

    @Column({ default: null, nullable: true })
    note: string;

    @Column({ default: () => 'now()' })
    time: Date;
}