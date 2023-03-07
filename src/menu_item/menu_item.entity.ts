import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("menu_items")
export class MenuItem extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    name: string;

    @Column({
        type: "longtext"
    })
    description: string;

    @Column()
    price: number;

    @Column()
    image_link: string;
}