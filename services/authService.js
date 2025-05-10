// services/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  const { token, user } = res.data;

  // Save token locally
  await AsyncStorage.setItem('token', token);
  return user;
};
