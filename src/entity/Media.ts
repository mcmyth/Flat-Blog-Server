import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"
import {DateFormatter} from '../lib/Utils'

const uuid = require('uuid')

@Entity()
export class Media {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: () => "'" + String(uuid.v1()) + "'",
  })
  uuid: string;

  @Column()
  user_id: string;

  @Column()
  filename: string;

  @Column()
  size: string;

  @Column()
  folder: string;

  @Column({
    type: "datetime",
    default: () => "'" + DateFormatter(new Date()) + "'"
  })
  upload_date: string;

}
