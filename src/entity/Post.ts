import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm'
import {DateFormatter} from '../lib/Utils'

const uuid = require('uuid')

@Entity()
export class Post {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: () => "'" + String(uuid.v1()) + "'",
  })
  uuid: string;

  @Column()
  user_id: string;

  @Column({select: false})
  title: string;

  @Column({length: 5000})
  content_md: string;

  @Column({length: 20000})
  content_html: string;

  @Column()
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

}
