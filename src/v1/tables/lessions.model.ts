import {
  AllowNull,
  Column,
  Model,
  Table,
  NotNull,
  IsUUID,
  PrimaryKey,
  ForeignKey,
  BelongsTo
} from "sequelize-typescript";

import { Semester } from "@models/v1/semester.model";
import { Class } from "@models/v1/classes.model";
import { Subject } from "@models/v1/subjects.model";

@Table({
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  tableName: "lessions",
  schema: "public"
})
export class Lession extends Model {
  @AllowNull(false)
  @PrimaryKey
  @IsUUID(4)
  @Column
  id: string;

  @ForeignKey(() => Semester)
  @Column
  semester_id: number;
  @BelongsTo(() => Semester, 'semester_id')
  semester: Semester;

  @ForeignKey(() => Class)
  @Column
  class_id: number;
  @BelongsTo(() => Class, 'class_id')
  class: Class;

  @ForeignKey(() => Subject)
  @Column
  subject_id: string;
  @BelongsTo(() => Subject, 'subject_id')
  subject: Subject;

  @Column
  date: number;

  @Column
  week: number;

  @Column
  month: number;

  @Column
  period: number;
}
