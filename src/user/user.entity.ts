import { Entity , PrimaryGeneratedColumn, Column, BaseEntity, } from "typeorm";

@Entity('users')
export class User extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    browser: string;

    @Column()
    browser_version: string;

    @Column()
    os: string;

    @Column()
    os_version: string;


}