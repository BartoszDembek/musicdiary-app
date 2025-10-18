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
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Link } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { authService } from '../services/authService';
import Header from '../components/Auth/Header';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { colors, commonStyles } from '../theme';

const RegisterScreen = ({navigation}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Step 1: Email and Password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Step 2: Username
  const [username, setUsername] = useState('');
  
  // Step 3: Avatar
  const [avatar, setAvatar] = useState('');
  
  const { signIn } = useAuth();

  // Step validation functions
  const validateStep1 = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Email field is required", [{ text: "OK" }]);
      return false;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Password field is required", [{ text: "OK" }]);
      return false;
    }
    if (password.trim().length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters", [{ text: "OK" }]);
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords must match", [{ text: "OK" }]);
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address", [{ text: "OK" }]);
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!username.trim()) {
      Alert.alert("Error", "Username field is required", [{ text: "OK" }]);
      return false;
    }
    return true;
  };

  // Step navigation functions
  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkipAvatar = () => {
    handleRegister();
  };

  // Avatar selection functions
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const base64Data = result.assets[0].base64;
        
        if (base64Data.length > 700000) {
          Alert.alert('Image Too Large', 'Please select a smaller image. The image should be less than 500KB.');
          return;
        }
        
        const base64String = `data:image/jpeg;base64,${base64Data}`;
        setAvatar(base64String);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePicture = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const base64Data = result.assets[0].base64;
        
        if (base64Data.length > 700000) {
          Alert.alert('Image Too Large', 'The captured image is too large. Please try again or select a different image.');
          return;
        }
        
        const base64String = `data:image/jpeg;base64,${base64Data}`;
        setAvatar(base64String);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Select Photo',
      'Choose how you want to add your photo',
      [
        { text: 'Camera', onPress: takePicture },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleRegister = async () => {
    setIsLoading(true);
    
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
      
      // If avatar was selected, we could update it here
      // For now, we'll skip avatar implementation as it requires userService update
      
    } catch (error) {
      console.log(error)
      Alert.alert(
        "Error",
        "Registration failed. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Email and Password
  const renderStep1 = () => (
    <>
      <Header subtitle="Join the Music Lovers Community" />
      
      <View style={styles.stepIndicator}>
        <Text style={styles.stepText}>Step 1 of 3</Text>
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
        style={styles.singleButton}
        onPress={handleNext}
      >
        <Text style={styles.registerButtonText}>Next</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <Link screen="Login" style={styles.loginLink}>Sign In</Link>
      </View>
    </>
  );

  // Step 2: Username
  const renderStep2 = () => (
    <>
      <Header subtitle="Choose Your Username" />
      
      <View style={styles.stepIndicator}>
        <Text style={styles.stepText}>Step 2 of 3</Text>
      </View>

      <View style={styles.usernameSection}>
        <Text style={styles.usernameDescription}>
          This will be your unique identifier on the platform
        </Text>
        
        <View style={styles.usernameInputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.usernameInput}
            placeholder="Choose a username"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleNext}
        >
          <Text style={styles.registerButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // Step 3: Avatar Selection
  const renderStep3 = () => (
    <>
      <Header subtitle="Add Your Profile Picture" />
      
      <View style={styles.stepIndicator}>
        <Text style={styles.stepText}>Step 3 of 3</Text>
      </View>

      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>
              {username ? username[0].toUpperCase() : '?'}
            </Text>
          )}
        </View>
        
        <Pressable style={styles.changeAvatarButton} onPress={showImagePicker}>
          <Ionicons name="camera-outline" size={20} color={colors.primary} />
          <Text style={styles.changeAvatarText}>
            {avatar ? 'Change Photo' : 'Add Photo'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.registerButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.innerContainer}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
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
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 54,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  singleButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 20,
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
  stepIndicator: {
    alignItems: 'center',
    marginBottom: 30,
  },
  stepText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginTop: 20,
    gap: 10,
  },
  backButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  skipButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarText: {
    fontSize: 48,
    color: colors.primary,
    fontWeight: 'bold',
  },
  changeAvatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  changeAvatarText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  usernameSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  usernameDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  usernameInputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  usernameInput: {
    ...commonStyles.input,
    fontSize: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    textAlign: 'left',
    minHeight: 58,
  },
});

export default RegisterScreen;