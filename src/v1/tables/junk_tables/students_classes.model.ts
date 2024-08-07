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
  AllowNull,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  HasMany
} from "sequelize-typescript";

import { Student } from "@models/v1/students.model";
import { Class } from "@models/v1/classes.model";
import { Semester } from "@models/v1/semester.model";

@Table({
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  tableName: "students_classes",
  schema: "public"
})
export class StudentClass extends Model {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Student)
  @Column({
    type: DataType.UUIDV4
  })
  student_id: string;
  @BelongsTo(() => Student, 'student_id')
  student: Student;

  @ForeignKey(() => Class)
  @Column({
    type: DataType.INTEGER
  })
  class_id: number;

  @ForeignKey(() => Semester)
  @Column({
    type: DataType.INTEGER
  })
  semester_id: number;
  @BelongsTo(() => Semester, 'semester_id')
  semester: Semester;
}
