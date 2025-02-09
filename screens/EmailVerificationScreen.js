import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { authService } from '../services/authService'; // Zakładam, że masz taki serwis

const EmailVerificationScreen = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  // Funkcja sprawdzająca status weryfikacji
  const checkVerificationStatus = async () => {
    try {
      const response = await authService.checkEmailVerification();
      setIsVerified(response.isVerified);
      
      if (response.isVerified) {
        // Przekierowanie do głównej aplikacji po weryfikacji
        navigation.replace('MainApp');
      }
    } catch (error) {
      Alert.alert(
        "Błąd",
        "Nie udało się sprawdzić statusu weryfikacji",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Funkcja do ponownego wysłania maila weryfikacyjnego
  const handleResendEmail = async () => {
    try {
      setLoading(true);
      await authService.resendVerificationEmail();
      Alert.alert(
        "Sukces",
        "Email weryfikacyjny został wysłany ponownie",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert(
        "Błąd",
        "Nie udało się wysłać emaila weryfikacyjnego",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Pierwsze sprawdzenie przy załadowaniu
    checkVerificationStatus();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#BB9AF7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Zweryfikuj swój email</Text>
        <Text style={styles.description}>
          Wysłaliśmy link weryfikacyjny na Twój adres email.
          Sprawdź swoją skrzynkę i kliknij w link, aby aktywować konto.
        </Text>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            Status: {isVerified ? 'Zweryfikowano' : 'Oczekuje na weryfikację'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResendEmail}
          disabled={loading}
        >
          <Text style={styles.resendButtonText}>
            Wyślij ponownie email weryfikacyjny
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={checkVerificationStatus}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>
            Odśwież status
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1B26',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#BB9AF7',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#C0CAF5',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  statusContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  statusText: {
    fontSize: 16,
    color: '#7AA2F7',
    textAlign: 'center',
  },
  resendButton: {
    backgroundColor: '#BB9AF7',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
  },
  resendButtonText: {
    color: '#1E1E2E',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#BB9AF7',
  },
  refreshButtonText: {
    color: '#BB9AF7',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default EmailVerificationScreen;