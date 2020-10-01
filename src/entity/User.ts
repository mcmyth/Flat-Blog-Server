import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {DateFormatter} from '../lib/Date'
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({ select: false })
    password: string;

    @Column()
    email: string;

    @Column()
    nickname: string;

    @Column()
    avatar: string;

    @Column()
    header_img: string;

    @Column({
        type: "datetime",
        default: () => "'" + DateFormatter(new Date()) +"'"
    })
    register_date: Date;

}
