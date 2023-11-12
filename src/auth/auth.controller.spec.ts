import { Role } from '../user/entities/role.enum';
import { User } from '../user/entities/user.entity';

describe('User', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.id = 1;
    user.email = 'test@example.com';
    user.password = 'password';
    user.firstName = 'John';
    user.lastName = 'Doe';
    user.role = Role.Customer;
    user.cars = [];
    user.assignments = [];
  });

  describe('id', () => {
    it('should return the user id', () => {
      expect(user.id).toEqual(1);
    });
  });

  describe('email', () => {
    it('should return the user email', () => {
      expect(user.email).toEqual('test@example.com');
    });
  });

  describe('password', () => {
    it('should return the user password', () => {
      expect(user.password).toEqual('password');
    });
  });

  describe('firstName', () => {
    it('should return the user first name', () => {
      expect(user.firstName).toEqual('John');
    });
  });

  describe('lastName', () => {
    it('should return the user last name', () => {
      expect(user.lastName).toEqual('Doe');
    });
  });

  describe('role', () => {
    it('should return the user role', () => {
      expect(user.role).toEqual(Role.Customer);
    });
  });

  describe('cars', () => {
    it('should return an empty array of cars', () => {
      expect(user.cars).toEqual([]);
    });
  });

  describe('assignments', () => {
    it('should return an empty array of assignments', () => {
      expect(user.assignments).toEqual([]);
    });
  });
});
