import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert} from 'typeorm'
import {DateFormatter} from '../lib/Utils'

@Entity()
export class Verification {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  type: string;

  @Column()
  code: string;

  @Column()
  generation_date: string;

  @BeforeInsert()
  UpdateDate() {
    this.generation_date =  DateFormatter(new Date())
  }
}
