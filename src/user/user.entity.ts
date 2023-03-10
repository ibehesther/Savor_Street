import { Entity , PrimaryGeneratedColumn, Column, DeleteDateColumn, BaseEntity, PrimaryColumn, Index } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

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