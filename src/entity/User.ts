import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert} from 'typeorm'
import {DateFormatter} from '../lib/Utils'

const uuid = require('uuid')

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  username: string;

  @Column({select: false})
  password: string;

  @Column()
  email: string;

  @Column()
  email_verified: number;

  @Column()
  nickname: string;

  @Column({type: "datetime"})
  register_date: string;

  @BeforeInsert()
  setDefaultData() {
    this.register_date =  DateFormatter(new Date())
    this.uuid = uuid.v1()
    this.email_verified = 0
  }
}
