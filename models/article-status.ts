import {BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import {Article} from './article';
import {User} from './user';

export enum StatusList {
    DRAFT = "draft",
    NEED_REVIEW = "need_review",
    UNDER_REVIEW = "under_review",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}

@Entity("articles_status")
export class ArticleStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Article, { nullable: false })
    article: Article;

    @ManyToOne(() => User, { nullable: false })
    performer: User;

    @Column({
        type: "enum",
        enum: StatusList,
        default: StatusList.DRAFT
    })
    status: StatusList;

    @Column({ default: null, nullable: true })
    note: string;

    @Column({ default: () => 'now()' })
    time: Date;
}