import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TextInput, 
  Pressable, 
  Image, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import useImagePicker from '../components/ImagePicker';
import { colors, commonStyles } from '../theme';

const EditProfileScreen = ({ navigation }) => {
  const { userProfile, updateUserProfile } = useAuth();
  const { showImagePicker } = useImagePicker();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: ''
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        username: userProfile.username || '',
        email: userProfile.email || '',
        avatar: userProfile.avatar || ''
      });
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!formData.username.trim()) {
      Alert.alert('Error', 'Username is required');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    setIsLoading(true);
    
    try {
      // Update profile via userService
      const updatedProfile = await userService.updateProfile(userProfile.id, {
        username: formData.username.trim(),
        email: formData.email.trim(),
        avatar: formData.avatar && formData.avatar !== "NULL" ? formData.avatar : null
      });

      // Update context
      await updateUserProfile();
      
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleImageSelect = (base64String) => {
    setFormData(prev => ({ ...prev, avatar: base64String }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable 
            style={styles.backButton}
            onPress={handleCancel}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <Pressable 
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </Pressable>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {formData.avatar && formData.avatar !== "NULL" && formData.avatar !== "" ? (
              <Image 
                source={{ uri: formData.avatar }} 
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>
                {formData.username ? formData.username[0].toUpperCase() : '?'}
              </Text>
            )}
          </View>
          <Pressable style={styles.changeAvatarButton} onPress={() => showImagePicker(handleImageSelect)}>
            <Ionicons name="camera-outline" size={20} color={colors.primary} />
            <Text style={styles.changeAvatarText}>Change Photo</Text>
          </Pressable>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.textInput}
              value={formData.username}
              onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
              placeholder="Enter your username"
              placeholderTextColor={colors.textSecondary}
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.textInput, styles.disabledInput]}
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarText: {
    fontSize: 40,
    color: colors.primary,
    fontWeight: 'bold',
  },
  changeAvatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  changeAvatarText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  formSection: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    minHeight: 48,
  },
  disabledInput: {
    backgroundColor: colors.border,
    color: colors.textSecondary,
    opacity: 0.6,
  },
});

export default EditProfileScreen;