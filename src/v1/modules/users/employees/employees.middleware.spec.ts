import { EmployeesMiddleware } from './employees.middleware';

describe('EmployeesMiddleware', () => {
  it('should be defined', () => {
    expect(new EmployeesMiddleware()).toBeDefined();
  });
});
