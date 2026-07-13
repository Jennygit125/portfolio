import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  ManyToOne, 
  JoinColumn,
  Index
} from "typeorm";
import { User } from "./userEntity";
import { Vehicle } from "./vehicleEntity";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata.js";

@Entity("reviews")
export class Review {
    @PrimaryGeneratedColumn("uuid")
    id!: string; //red is very ugly so had to tell typescript with ! that this is a neccesary field i suspect there is a mor efficent way for this ?

    @Column({ type: "int" })
    rating!: number; 
    // dto would be 1 to 5 for stars, default of 1 is expected might implement 0 star
    @Column({ type: "text", nullable: true })
    comment?: string; 
    //query cause not needed if you like don't comment
   @Column({ type: "uuid" })
   userId!: string;
   //imagine a user without id frightening right ?
   @ManyToOne(() => User, { onDelete: "CASCADE"})
   @JoinColumn({ name: "userId" })
   user!: User;
   //imagine no user lol immediate crash cause who are you 
   @Column({ type: "uuid" })
   vehicleId!: string;
   //catch vehicle and trace back to poster yes you this is your car i don't like it
   @ManyToOne(() => Vehicle,
   { onDelete: "CASCADE" })
   @JoinColumn({ name: "vehicleId" })
   vehicle!: Vehicle;
   // comment without a car ? atrocious
   @CreateDateColumn()
   createdAt!: Date;
   //Judge on july 43 2006 the defendant commented on a car lease site, how do i know ? it's in the db
}