import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './Category';

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: false })
    description: string;

    @ManyToOne(() => Category, { nullable: true })
    category: Category;

    @Column({ default: null, nullable: true })
    category_id: number;

    @Column({ default: false })
    is_enabled: boolean;
}
