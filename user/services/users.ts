import apiService from '@/shared/services/apiService';

// User data interface based on backend model
export interface UserData {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string;
}

export default class UserService {
  static async getUserById(userId: number): Promise<UserData> {
    return await apiService.get(`/users/${userId}`) as unknown as UserData;
  }
}


