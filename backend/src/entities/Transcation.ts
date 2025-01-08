import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Transaction {
  @PrimaryKey()
  id!: number;

  @Property()
  description!: string;

  @Property()
  amount!: number;

  @Property()
  date!: Date;

  @Property({ nullable: true })
  category?: string;
}


