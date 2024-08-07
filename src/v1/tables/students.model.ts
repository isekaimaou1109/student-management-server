import { generate } from "rand-token";
import { uuid as uuidV4 } from 'uuidv4';
import AES from "crypto-js/aes";
import {
  Column,
  Model,
  Table,
  NotNull,
  Unique,
  IsUUID,
  PrimaryKey,
  AllowNull,
  UpdatedAt,
  CreatedAt,
  IsUrl,
  IsDate,
  Default,
  Is,
  IsEmail,
  IsAlphanumeric,
  BeforeCreate,
  BeforeValidate,
  NotEmpty,
  HasMany,
  BelongsToMany
} from "sequelize-typescript";
import { Class } from "./classes.model";
import { StudentClass } from "./junk_tables/students_classes.model";

const EMAIL_REGEXP = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", "g");
const PHONE_REGEXP = new RegExp(
  "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$",
  "g"
);
const PASSWORD_REGEXP = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{12,}$",
  "g"
);

@Table({
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  tableName: "students",
  schema: "public"
})
export class Student extends Model {
  @AllowNull(false)
  @PrimaryKey
  @IsUUID(4)
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

  @AllowNull
  @Unique
  @NotEmpty
  @IsAlphanumeric
  @Column
  phone?: string;

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

  @AllowNull
  @Unique
  @NotEmpty
  @Column
  citizen_identification_number?: string;

  @AllowNull(false)
  @Default(1)
  @Column
  sex: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  password: string;

  @AllowNull(false)
  @Unique
  @Column
  pk_key: string;

  @IsDate
  @CreatedAt
  @Column
  created_at: Date;

  @IsDate
  @UpdatedAt
  @Column
  updated_at: Date;

  @BelongsToMany(() => Class, () => StudentClass, 'class_id')
  classes: Class[];

  @BeforeValidate
  static validateModel(instance: Student) {
    return new Promise((resolve, reject) => {
      if (
        EMAIL_REGEXP.test(instance.email) &&
        PHONE_REGEXP.test(instance.phone) &&
        instance.password.length >= 12 &&
        PASSWORD_REGEXP.test(instance.password) &&
        (instance.sex === 1 || instance.sex === 2)
      ) {
        resolve(true);
      } else {
        reject(new Error("One Field Is Not Match."));
      }
    });
  }

  @BeforeCreate
  static encrypt(instance: Student) {
    instance.id = uuidV4()
    instance.pk_key = generate(64);
    instance.password = AES.encrypt(
      instance.password,
      instance.pk_key
    ).toString();
    instance.email = AES.encrypt(
      instance.email,
      instance.pk_key
    ).toString();
    instance.address = AES.encrypt(
      instance.address,
      instance.pk_key
    ).toString()
    if (instance.citizen_identification_number) {
      instance.citizen_identification_number = AES.encrypt(
        instance.citizen_identification_number,
        instance.pk_key
      ).toString()
    }
    if (instance.phone) {
      instance.phone = AES.encrypt(
        instance.phone,
        instance.pk_key
      ).toString()
    }
  }
}
