import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Article } from './Article';
import { Tag } from './Tag';

@Entity()
export class ArticleTag {

}