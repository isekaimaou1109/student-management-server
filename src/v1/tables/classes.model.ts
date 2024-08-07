import {
  Column,
  Model,
  Table,
  NotNull,
  Unique,
  AllowNull,
  PrimaryKey,
  NotEmpty,
  AutoIncrement,
  CreatedAt,
  IsDate,
  UpdatedAt
} from "sequelize-typescript";

@Table({
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  tableName: "classes",
  schema: "public"
})
export class Class extends Model {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

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
}
