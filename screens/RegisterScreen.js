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
import {
  useNavigation,
} from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signIn } = useAuth();

  const handleRegister = async () => {
    if (!username.trim()) {
      Alert.alert(
        "Błąd",
        "Pole nazwa użytkownika jest wymagane",
        [{ text: "OK" }]
      );
      return;
    }
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
      if (password.trim().length < 8) {
        Alert.alert(
          "Błąd",
          "Hasło ma mniej niż 8",
          [{ text: "OK" }]
        );
        return;
      }

      if (password != confirmPassword) {
        Alert.alert(
          "Błąd",
          "Hasła musze być takie same",
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
  
      // Jeśli wszystkie walidacje przeszły, kontynuuj rejestrację
      const userData = {
        email,
        username,
        password,
      };
      
      try {
        const registerResponse = await authService.register(userData);
        // Po udanej rejestracji, zaloguj użytkownika
        const loginResponse = await authService.login({
          email,
          password,
        });
        // Zapisz token i przejdź do głównej aplikacji
        await signIn(loginResponse.token);
        // Nie nawigujemy do EmailVerification, bo użytkownik jest już zalogowany
      } catch (error) {
        console.log(error)
        Alert.alert(
          "Błąd",
          "Wystąpił problem podczas rejestracji. Spróbuj ponownie.",
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
            <Header subtitle="Dołącz do społeczności melomanów" />
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nazwa użytkownika</Text>
              <TextInput
                style={styles.input}
                placeholder="Wybierz nazwę użytkownika"
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
                placeholder="Minimum 8 znaków"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Potwierdź hasło</Text>
              <TextInput
                style={styles.input}
                placeholder="Powtórz hasło"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                Rejestrując się, akceptujesz nasze{' '}
                <Text style={styles.termsLink}>Warunki użytkowania</Text>
                {' '}oraz{' '}
                <Text style={styles.termsLink}>Politykę prywatności</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
            >
              <Text style={styles.registerButtonText}>Utwórz konto</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Masz już konto? </Text>
              <Link screen="Login" style={styles.loginLink}>Zaloguj się</Link>
              
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    fontSize: 16,
    color: '#7AA2F7',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: '#414868',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#ffffff',
  },
  termsContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  termsText: {
    color: '#C0CAF5',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: '#7DCFFF',
    textDecorationLine: 'underline',
  },
  registerButton: {
    backgroundColor: '#BB9AF7',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#1E1E2E',
    fontSize: 18,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#C0CAF5',
    fontSize: 14,
  },
  loginLink: {
    color: '#BB9AF7',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen;