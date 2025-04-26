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
  ScrollView,
} from 'react-native';
import { Link } from '@react-navigation/native';
import { authService } from '../services/authService';
import Header from '../components/Auth/Header';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { colors, commonStyles } from '../theme';

const RegisterScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signIn } = useAuth();

  const handleRegister = async () => {
    if (!username.trim()) {
      Alert.alert(
        "Error",
        "Username field is required",
        [{ text: "OK" }]
      );
      return;
    }
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
    if (password.trim().length < 8) {
      Alert.alert(
        "Error",
        "Password must be at least 8 characters",
        [{ text: "OK" }]
      );
      return;
    }

    if (password != confirmPassword) {
      Alert.alert(
        "Error",
        "Passwords must match",
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

    // Jeśli wszystkie walidacje przeszły, kontynuuj rejestrację
    const userData = {
      email,
      username,
      password,
    };
    
    try {
      const registerResponse = await authService.register(userData);
      const loginResponse = await authService.login({
        email,
        password,
      });
      await signIn(loginResponse.token, loginResponse.user);
    } catch (error) {
      console.log(error)
      Alert.alert(
        "Error",
        "Registration failed. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.innerContainer}>
            <Header subtitle="Join the Music Lovers Community" />
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Choose a username"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

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
                placeholder="Minimum 8 characters"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Repeat your password"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
            >
              <Text style={styles.registerButtonText}>Create Account</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Link screen="Login" style={styles.loginLink}>Sign In</Link>
              
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
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
  termsContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  termsText: {
    color: colors.textPrimary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: colors.secondaryLight,
    textDecorationLine: 'underline',
  },
  registerButton: {
    ...commonStyles.primaryButton
  },
  registerButtonText: {
    ...commonStyles.primaryButtonText
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen;