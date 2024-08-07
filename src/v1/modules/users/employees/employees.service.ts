import AES from "crypto-js/aes";
import CryptoJS from "crypto-js";

import { formLoginDTO } from "@schemas/v1/form.schema";
import { Employee } from "@models/v1/employees.model";

export default class EmployeeService {
  public static async ProcessLoginForEmployee(form, services, callback) {
    try {
      const { encrypted_username, encrypted_password, token } = form

      const isValidToken =
        await services.jwt.verifyAsync(
          token,
          services.config.get("env.secret")
        );

        if (isValidToken) {
          const username = AES.decrypt(
            encrypted_username,
            token
          ).toString(CryptoJS.enc.Utf8);
          const password = AES.decrypt(
            encrypted_password,
            token
          ).toString(CryptoJS.enc.Utf8);
  
          const employee = await Employee.findOne({
            where: {
              username,
              password
            }
          });
  
          if (employee && employee.id) {
            await callback(employee.id)
          }
        }
    } catch (error) {
      throw new Error('Unvalid')
    }
  }

  public static async ProcessRegisterNewEmployee() {
    // try {
    //   const {
    //     encrypted_username,
    //     encrypted_password,
    //     token
    //   }: formLoginDTO<string> = JSON.parse(
    //     AES.decrypt(
    //       data,
    //       services.config.get("env.secret")
    //     ).toString(CryptoJS.enc.Utf8)
    //   );
    // } catch (error) {

    // }
  }
}