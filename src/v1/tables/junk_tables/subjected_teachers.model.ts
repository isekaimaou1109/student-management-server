import {
  Column,
  Model,
  Table,
  NotNull,
  Unique,
  IsUUID,
  PrimaryKey,
  NotEmpty,
  IsDate, 
  CreatedAt,
  UpdatedAt,
  AutoIncrement,
  DataType,
  ForeignKey,
  BelongsTo,
  AllowNull,
  BelongsToMany,
  HasMany
} from "sequelize-typescript";

import { Subject } from "@models/v1/subjects.model";
import { Employee } from "@models/v1/employees.model";

@Table({
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  tableName: "subjects",
  schema: "public"
})
export class SubjectedTeacher extends Model {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.UUIDV4
  })
  subject_id: string;

  @ForeignKey(() => Employee)
  @Column({
    type: DataType.UUIDV4
  })
  teacher_id: string;
}
