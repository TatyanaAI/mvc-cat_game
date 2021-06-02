import { User } from './user.entity';
import {Column, Entity, PrimaryGeneratedColumn, ManyToOne} from "typeorm";

@Entity("cats")
export class  Cat {
    @PrimaryGeneratedColumn() id: number;
    @Column({length: 1000}) name: string;
    @Column() age: number;
    @Column() hungerLevel: number;
    @Column() happinessLevel: number;
    @Column() sleeping: boolean;
    @ManyToOne(type => User, user => user.cats)
    user: User;
}