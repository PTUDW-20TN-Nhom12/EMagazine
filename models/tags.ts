import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class Tags {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({length: 16})
    name!: string
    
    @Column({length: 256})
    description!: string
}