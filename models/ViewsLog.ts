import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Article } from './Article';

@Entity()
export class ViewsLog {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Article, { nullable: false })
    article: Article;

    @Column({ default: () => 'now()' })
    time: Date;
}