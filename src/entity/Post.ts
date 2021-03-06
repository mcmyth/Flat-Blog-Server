import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert} from 'typeorm'
import {DateFormatter} from '../lib/Utils'

const uuid = require('uuid')

@Entity()
export class Post {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  user_id: string;

  @Column({select: false})
  title: string;

  @Column("mediumtext")
  content_md: string;

  @Column("mediumtext")
  content_html: string;

  @Column({ nullable: true })
  header_img: string;

  @Column({
    type: "datetime",
    default: () => "'" + DateFormatter(new Date()) + "'"
  })
  post_date: string;

  @Column({
    type: "datetime",
    default: () => "'" + DateFormatter(new Date()) + "'"
  })
  update_date: string;

  @BeforeInsert()
  UpdateDate() {
    this.post_date =  DateFormatter(new Date())
    this.uuid = uuid.v1()
  }
}
