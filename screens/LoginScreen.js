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

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert(
        "Błąd",
        "Pole email jest wymagane",
        [{ text: "OK" }]
      );
      return;
    }

    if (!password.trim()) {
      Alert.alert(
        "Błąd",
        "Pole hasło jest wymagane",
        [{ text: "OK" }]
      );
      return;
    }

    // Prosta walidacja formatu email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(
        "Błąd",
        "Wprowadź poprawny adres email",
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
      // Assuming authService.login returns a token
      await signIn(response.token);
    } catch (error) {
      Alert.alert(
        "Błąd",
        "Wystąpił problem podczas logowania. Spróbuj ponownie.",
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
          <Header subtitle="Twój osobisty dziennik muzyczny" />
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Wprowadź email"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Hasło</Text>
            <TextInput
              style={styles.input}
              placeholder="Wprowadź hasło"
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
            <Text style={styles.forgotPasswordText}>Zapomniałeś hasła?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Zaloguj się</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Nie masz jeszcze konta? </Text>
            <Link screen="Register" style={styles.registerLink}>Zarejestruj się</Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
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
    fontSize: 16,
    color: '#7AA2F7', // Jasny niebieski
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: '#414868', // Ciemny szary z niebieskim odcieniem
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#ffffff',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#7DCFFF', // Jasny turkusowy
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#BB9AF7', // Fioletowy akcent
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#1E1E2E', // Ciemny granatowy
    fontSize: 18,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: '#C0CAF5', // Jasny niebieski-szary
    fontSize: 14,
  },
  registerLink: {
    color: '#BB9AF7', // Fioletowy akcent
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;