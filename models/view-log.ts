import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Article } from './article';

@Entity("views_log")
export class ViewLog {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Article, { nullable: false })
    article: Article;

    @Column({ default: () => 'now()' })
    time: Date;
}