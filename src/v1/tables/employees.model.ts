import { v4 } from "uuid";
import {
  Column,
  Model,
  Table,
  Unique,
  IsUUID,
  PrimaryKey,
  AllowNull,
  UpdatedAt,
  CreatedAt,
  IsUrl,
  IsDate,
  Default,
  IsAlphanumeric,
  BeforeCreate,
  NotEmpty,
  BelongsToMany
} from "sequelize-typescript";
// import bcrypt from "bcryptjs";
var bcrypt = require('bcryptjs')

import { Subject } from "@models/v1/subjects.model";
import { SubjectedTeacher } from "@models/v1/junk_tables/subjected_teachers.model";

const EMAIL_REGEXP = new RegExp(
  "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
  "g"
);
const PHONE_REGEXP = new RegExp(
  "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s.0-9]*$",
  "g"
);
const PASSWORD_REGEXP = new RegExp(
  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$",
  "g"
);

@Table({
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  tableName: "employees",
  schema: "public"
})
export class Employee extends Model {
  @PrimaryKey
  @IsUUID(4)
  @AllowNull(false)
  @Column
  id: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  first_name: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  last_name: string;

  @AllowNull(false)
  @Unique
  @NotEmpty
  @IsAlphanumeric
  @Column
  phone: string;

  @AllowNull(false)
  @Unique
  @NotEmpty
  @Column
  email: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  address: string;

  @AllowNull
  @NotEmpty
  @IsUrl
  @Column
  avatar_url?: string;

  @AllowNull(false)
  @NotEmpty
  @Unique
  @Column
  tax_id: string;

  @AllowNull(false)
  @Unique
  @NotEmpty
  @Column
  citizen_identification_number: string;

  @AllowNull(false)
  @Default(1)
  @Column
  sex: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  password: string;

  @AllowNull(false)
  @Column
  salary: string;

  @AllowNull(false)
  @Column
  position: string;

  @AllowNull(false)
  @Unique
  @Column
  salt: string;

  @IsDate
  @CreatedAt
  @Column
  created_at: Date;

  @IsDate
  @UpdatedAt
  @Column
  updated_at: Date;

  @BelongsToMany(
    () => Subject,
    () => SubjectedTeacher,
    "subject_id"
  )
  specialist_subjects: Subject[];

  @BeforeCreate
  static encryptData(instance) {
    if (
      EMAIL_REGEXP.test(instance.email) &&
      PHONE_REGEXP.test(instance.phone) &&
      instance.password.length >= 12 &&
      PASSWORD_REGEXP.test(instance.password) &&
      (instance.sex === 1 || instance.sex === 2)
    ) {
      instance.id = v4();
      instance.salt = bcrypt.genSaltSync(16);
      instance.password = bcrypt.hashSync(
        instance.password,
        instance.salt
      );
      instance.email = bcrypt.hashSync(
        instance.email,
        instance.salt
      );
      instance.tax_id = bcrypt.hashSync(
        instance.tax_id,
        instance.salt
      );
      instance.citizen_identification_number =
        bcrypt.hashSync(
          instance.citizen_identification_number,
          instance.salt
        );
      instance.address = bcrypt.hashSync(
        instance.address,
        instance.salt
      );
      instance.phone = bcrypt.hashSync(
        instance.phone,
        instance.salt
      );
    }
  }
}
