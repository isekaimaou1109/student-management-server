export interface formLoginDTO<T> {
  encrypted_username: T;
  encrypted_password: T;
  token: T;
}

// export interface formSignupDTO<T extends String> {
//   encrypted_username: T;
//   encrypted_password: T;
//   encrypted_email: T,
//   encrypted_phone: T,
//   encrypted_first_name: T;
//   encrypted_last_name: T,
//   encrypted_phone: T,
//   encrypted_first_name: T;
// }