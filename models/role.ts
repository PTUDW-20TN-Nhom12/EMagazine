import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './category';

@Entity("roles")
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false  })
    name: string;

    @Column({ nullable: false })
    description: string;

    @ManyToOne(() => Category, { nullable: true })
    category: Category;

    @Column({ default: false })
    is_enabled: boolean;
}
