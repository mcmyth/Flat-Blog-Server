import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert} from 'typeorm'
import {DateFormatter} from '../lib/Utils'

const uuid = require('uuid')

@Entity()
export class Comment {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  post_id: number;

  @Column()
  user_id: number;

  @Column()
  content: string;

  @Column()
  reply_id: number;

  @Column({
    type: 'datetime',
    default: () => "'" + DateFormatter(new Date()) + "'"
  })
  comment_date: string;

  @BeforeInsert()
  UpdateDate() {
    this.comment_date =  DateFormatter(new Date())
    this.uuid = uuid.v1()
  }

}
