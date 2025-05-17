import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Platform,
  Image,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { useTheme } from '../context/themeContext';
import AuthContext from '../context/authContext';

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
    logoOpacity.value = withTiming(1, { duration: 1000 });
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = () => {
    setError('');
    if (!validateEmail(email)) {
      return setError('Please enter a valid email address.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (email === 'teacher@example.com' && password === 'password123') {
        login({ email });
      } else {
        setError('Invalid email or password.');
      }
    }, 1500);
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.Image
        source={require('../assets/splash.png')}
        style={[styles.logo, logoAnimatedStyle]}
        resizeMode="contain"
      />

      <Text style={[styles.title, { color: colors.primary }]}>Teacher Login</Text>

      <TextInput
        style={[styles.input, { 
          borderColor: colors.border, 
          backgroundColor: colors.card,
          color: colors.text 
        }]}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={[styles.passwordContainer, { 
        borderColor: colors.border, 
        backgroundColor: colors.card 
      }]}>
        <TextInput
          style={[styles.passwordInput, { color: colors.text }]}
          placeholder="Password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color={colors.textSecondary}
          />
        </Pressable>
      </View>

      {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <Pressable
          onPress={handleLogin}
          android_ripple={{ color: colors.ripple }}
          style={({ pressed }) => [
            styles.loginButton,
            { backgroundColor: colors.primary },
            pressed && Platform.OS === 'ios' && styles.loginButtonPressed,
          ]}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>
      )}

      <Pressable
        onPress={() => alert('Password reset link sent to your email (mock).')}
      >
        <Text style={[styles.forgot, { color: colors.textSecondary }]}>Forgot Password?</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default LoginScreen;

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
  },
  error: {
    marginBottom: 10,
    textAlign: 'center',
  },
  loginButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  loginButtonPressed: {
    opacity: 0.9,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgot: {
    marginTop: 12,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});