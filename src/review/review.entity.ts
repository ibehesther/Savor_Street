
import { IsOptional } from "class-validator";
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("reviews")
export class Review extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'uuid'
    })
    user_id: string;

    @Column({
        type: "enum",
        enum: [1, 2, 3, 4, 5],
    })
    rating: number;

    @Column({
        type: 'longtext'
    })
    @IsOptional()
    review: string;

    @UpdateDateColumn()
    review_date_time: Date;
}