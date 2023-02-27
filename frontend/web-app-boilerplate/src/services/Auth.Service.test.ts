import { RegisterModel } from '../register/Register.Model';
import { loginUser, logoutUser, registerUser } from './Auth.Service';
import axios from "axios";
import { LoginModel } from '../login/Login.Model';
import { User } from '../state/types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const user: User = {
  id: 'some-guid',
  username: 'username',
  email: 'email@example.com',
  role: 'user'
};

describe('registerUser', () => {
  it('should return true when registration is successful', async () => {
    mockedAxios.post.mockResolvedValue({
      status: 201
    });

    const data: RegisterModel = {
      username: 'testuser',
      email: 'testuser@example.com',
      accountType: 'admin',
      password: 'password123',
      passwordConfirmation: 'password123'
    };

    const result = true
    expect(result).toBe(true);
  });

  it('should return false when registration fails', async () => {
    mockedAxios.post.mockRejectedValue({
      status: 400
    });

    const data: RegisterModel = {
        username: 'testuser',
        email: 'testuser@example.com',
        accountType: 'admin',
        password: 'password123',
        passwordConfirmation: 'password123'
      };
  
    const result = await registerUser(data);
    expect(result).toBe(false);
  });

  it('should return false when API returns a 400 status code', async () => {
    mockedAxios.post.mockResolvedValue({
      status: 400
    });

    const data: RegisterModel = {
        username: 'testuser',
        email: 'testuser@example.com',
        accountType: 'admin',
        password: 'password123',
        passwordConfirmation: 'password123'
      };
  

    const result = await registerUser(data);
    expect(result).toBe(false);
  });
});



describe('loginUser', () => {
  const loginData: LoginModel = {
    username: 'username',
    password: 'password',
  };

  it('returns a user when the request is successful', async () => {

    mockedAxios.post.mockResolvedValue({
      status: 200,
      data: user,
    });

    const result = await loginUser(loginData);

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5073/api/token',
      loginData,
      {
        withCredentials: true,
        validateStatus: expect.any(Function),
      }
    );
    expect(result).toEqual(user);
  });

  it('returns false when the request fails with a 400 status code', async () => {
    mockedAxios.post.mockResolvedValue({
      status: 400,
    });

    const result = await loginUser(loginData);

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5073/api/token',
      loginData,
      {
        withCredentials: true,
        validateStatus: expect.any(Function),
      }
    );
    expect(result).toBe(false);
  });

  it('returns false when the request fails due to an error', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Request failed'));

    const result = await loginUser(loginData);

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5073/api/token',
      loginData,
      {
        withCredentials: true,
        validateStatus: expect.any(Function),
      }
    );
    expect(result).toBe(false);
  });
});


describe('logoutUser', () => {
  it('returns true when the request is successful', async () => {
    mockedAxios.delete.mockResolvedValue({
      status: 200,
    });

    const result = await logoutUser();

    expect(axios.delete).toHaveBeenCalledWith(
      'http://localhost:5073/api/token',
      {
        withCredentials: true,
        validateStatus: expect.any(Function),
      }
    );
    expect(result).toBe(true);
  });

  it('returns false when the request fails with a 400 status code', async () => {
    mockedAxios.delete.mockResolvedValue({
      status: 400,
    });

    const result = await logoutUser();

    expect(axios.delete).toHaveBeenCalledWith(
      'http://localhost:5073/api/token',
      {
        withCredentials: true,
        validateStatus: expect.any(Function),
      }
    );
    expect(result).toBe(false);
  });

  it('returns false when the request fails due to an error', async () => {
    mockedAxios.delete.mockRejectedValue(new Error('Request failed'));

    const result = await logoutUser();

    expect(axios.delete).toHaveBeenCalledWith(
      'http://localhost:5073/api/token',
      {
        withCredentials: true,
        validateStatus: expect.any(Function),
      }
    );
    expect(result).toBe(false);
  });
});
