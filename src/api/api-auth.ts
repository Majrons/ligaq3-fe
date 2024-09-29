import axiosInstance from './axioxConfig';

export const loginUser = async (username: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', { username, password });
    return response.data;
};
