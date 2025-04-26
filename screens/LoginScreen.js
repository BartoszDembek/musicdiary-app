import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Link } from '@react-navigation/native';
import Header from '../components/Auth/Header';
import { authService } from '../services/authService';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, commonStyles } from '../theme';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert(
        "Error",
        "Email field is required",
        [{ text: "OK" }]
      );
      return;
    }

    if (!password.trim()) {
      Alert.alert(
        "Error",
        "Password field is required",
        [{ text: "OK" }]
      );
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(
        "Error",
        "Please enter a valid email address",
        [{ text: "OK" }]
      );
      return;
    }

    // Jeśli wszystkie walidacje przeszły, kontynuuj logowanie
    const userData = {
      email,
      password,
    };
    
    try {
      const response = await authService.login(userData);
      // Now passing both token and user data to signIn
      await signIn(response.token, response.user);
    } catch (error) {
      Alert.alert(
        "Error",
        "Login failed. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <>
    <StatusBar style="light" />
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.innerContainer}>
          <Header subtitle="Your Personal Music Journal" />
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => console.log('Forgot password')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <Link screen="Register" style={styles.registerLink}>Sign Up</Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    ...commonStyles.inputLabel
  },
  input: {
    ...commonStyles.input
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: colors.secondaryLight,
    fontSize: 14,
  },
  loginButton: {
    ...commonStyles.primaryButton
  },
  loginButtonText: {
    ...commonStyles.primaryButtonText
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  registerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;