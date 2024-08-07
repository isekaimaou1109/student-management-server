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
  AllowNull,
  BelongsToMany
} from "sequelize-typescript";
import { Employee } from "@models/v1/employees.model";
import { SubjectedTeacher } from "@models/v1/junk_tables/subjected_teachers.model";

@Table({
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  tableName: "subjects",
  schema: "public"
})
export class Subject extends Model {
  @AllowNull(false)
  @PrimaryKey
  @IsUUID(4)
  @Column
  id: string;

  @Unique
  @AllowNull(false)
  @NotEmpty
  @Column
  name: string;

  @IsDate
  @CreatedAt
  @Column
  created_at: Date;

  @IsDate
  @UpdatedAt
  @Column
  updated_at: Date;

  @BelongsToMany(() => Employee, () => SubjectedTeacher, 'teacher_id')
  teachers: Employee[];
}
