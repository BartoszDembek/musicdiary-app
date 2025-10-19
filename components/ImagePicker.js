import React from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const useImagePicker = () => {
  const pickImage = async (callback) => {
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
        callback(base64String);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePicture = async (callback) => {
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
        callback(base64String);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  const showImagePicker = (callback) => {
    Alert.alert(
      'Select Photo',
      'Choose how you want to add your photo',
      [
        { text: 'Camera', onPress: () => takePicture(callback) },
        { text: 'Photo Library', onPress: () => pickImage(callback) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return {
    pickImage,
    takePicture,
    showImagePicker
  };
};

export default useImagePicker;