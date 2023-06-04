import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Role } from './role';

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    // @ManyToOne(() => Role, { nullable: false })
    // role: Role;
    @Column({ nullable: false, length: 64 })
    role: string; 

    @Column({ unique: true })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false, length: 64 })
    full_name: string;

    @Column({ default: '1970-01-01' })
    birthday: Date;

    @Column({ default: null, nullable: true })
    pseudonym: string;

    @Column({ default: null, nullable: true })
    premium_expired: Date;

    @Column({ default: () => 'now()' })
    date_created: Date;

    @Column({ default: false })
    is_deleted: boolean;
}