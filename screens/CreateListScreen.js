import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { commonStyles } from '../theme/commonStyles';
import { useAuth } from '../context/AuthContext';
import { listService } from '../services/listService';

export default function CreateListScreen({ navigation }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Błąd', 'Proszę podać tytuł listy');
      return;
    }

    setLoading(true);
    try {
      await listService.createList(user.id, title, description, isPublic);
      Alert.alert('Sukces', 'Lista została utworzona', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Błąd', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>Nowa Lista</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={commonStyles.inputLabel}>Tytuł</Text>
            <TextInput
              style={commonStyles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Np. Ulubione albumy 2024"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={commonStyles.inputLabel}>Opis (opcjonalnie)</Text>
            <TextInput
              style={[commonStyles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Krótki opis listy..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.switchContainer}>
            <View>
              <Text style={styles.switchLabel}>Lista publiczna</Text>
              <Text style={styles.switchDescription}>
                {isPublic ? 'Wszyscy mogą zobaczyć tę listę' : 'Tylko Ty widzisz tę listę'}
              </Text>
            </View>
            <Switch
              trackColor={{ false: colors.card, true: colors.primaryMedium }}
              thumbColor={isPublic ? colors.primary : colors.textMuted}
              onValueChange={setIsPublic}
              value={isPublic}
            />
          </View>

          <TouchableOpacity 
            style={[commonStyles.primaryButton, loading && styles.disabledButton]}
            onPress={handleCreate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={commonStyles.primaryButtonText}>Utwórz listę</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  textArea: {
    height: 100,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  disabledButton: {
    opacity: 0.7,
  },
});
