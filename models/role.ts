import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './category';

export enum UserRole {
    ADMIN = "admin",
    EDITOR = "editor",
    WRITER = "writer",
    SUBSCRIBER = "subscriber",
    READER = "reader"
}

@Entity("roles")
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.READER
    })
    name: UserRole;

    @Column({ nullable: false, length: 256  })
    description: string;

    @ManyToOne(() => Category, { nullable: true })
    category: Category;

    @Column({ default: false })
    is_enabled: boolean;
}
