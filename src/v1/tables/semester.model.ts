import {
  Column,
  Model,
  Table,
  NotNull,
  Unique,
  PrimaryKey,
  AutoIncrement,
  AllowNull
} from "sequelize-typescript";

@Table({
  timestamps: false,
  underscored: true,
  tableName: "semesters",
  schema: "public"
})
export class Semester extends Model {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Unique
  @Column
  from: number;

  @Unique
  @Column
  to: number;
}
