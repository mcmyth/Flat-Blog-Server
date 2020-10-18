import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert} from "typeorm"
import {DateFormatter} from '../lib/Utils'

const uuid = require('uuid')

@Entity()
export class Media {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  user_id: string;

  @Column()
  filename: string;

  @Column()
  size: string;

  @Column()
  folder: string;

  @Column()
  upload_date: string;

  @BeforeInsert()
  UpdateDate() {
    this.upload_date =  DateFormatter(new Date())
    this.uuid = uuid.v1()
  }
}
