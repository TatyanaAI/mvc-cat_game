import bcrypt from "bcrypt";
import {BeforeInsert, Column, Entity, PrimaryGeneratedColumn, Unique, OneToMany} from "typeorm";
import { Cat } from './cat.entity';


@Entity("users")
@Unique(["username", "email"])
export class User {
    @PrimaryGeneratedColumn() id: number;
    @Column({length: 16, nullable: false}) username: string;
    @Column({nullable: false}) password: string;
    @Column({nullable: false}) email: string;
    @OneToMany(type => Cat, cat => cat.user)
    cats: Cat[];


    @BeforeInsert()
    hashPassword = async () => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
    };
}