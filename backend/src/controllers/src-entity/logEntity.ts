import {
  Entity,
  Column,
  CreateDateColumn,
  Index
} from 'typeorm';




// i have no ideas what ts means by no signature

@Entity('logActivity')
export class LogActivity {
 @Column({type: 'text', array: true, default: '{}'})
  action!: string;
 //sus nigga

@Column({ type: "uuid"})
   userId?: number | null;  //your id so i can call you it's fine if you hide it but if it's there i would catch it


@Column({ type: 'numeric', precision: 12, scale: 2 })
  ipAdress?: string; //in case you hide it somehow

@Column({type: 'text', array: true, default: '{}'})
  metaData!: string;

@Index({ unique: true }) // Fast external tracking & verification checks
@Column({ type: 'varchar', unique: true })
  reference?: string; 

@CreateDateColumn()
  createdAt!: Date;
}