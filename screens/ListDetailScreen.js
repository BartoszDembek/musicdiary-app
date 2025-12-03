import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { commonStyles } from '../theme/commonStyles';
import { listService } from '../services/listService';

export default function ListDetailScreen({ route, navigation }) {
  const { listId, title } = route.params;
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListDetails();
  }, [listId]);

  const loadListDetails = async () => {
    try {
      const data = await listService.getListDetails(listId);
      setList(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Błąd', 'Nie udało się pobrać szczegółów listy');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteList = () => {
    Alert.alert(
      'Usuń listę',
      'Czy na pewno chcesz usunąć tę listę? Tej operacji nie można cofnąć.',
      [
        { text: 'Anuluj', style: 'cancel' },
        { 
          text: 'Usuń', 
          style: 'destructive',
          onPress: async () => {
            try {
              await listService.deleteList(listId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Błąd', error.message);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemIcon}>
        <Ionicons 
          name={item.type === 'album' ? 'disc' : item.type === 'artist' ? 'person' : 'musical-note'} 
          size={24} 
          color={colors.primary} 
        />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.item_name}</Text>
        <Text style={styles.itemSubtext}>{item.artist_name || item.type}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle} numberOfLines={1}>{title}</Text>
        <TouchableOpacity onPress={handleDeleteList}>
          <Ionicons name="trash-outline" size={24} color={colors.tertiary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {list?.description ? (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{list.description}</Text>
          </View>
        ) : null}

        <FlatList
          data={list?.list_items || []}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Ta lista jest pusta</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  descriptionContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.cardDark,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 16,
    fontStyle: 'italic',
  },
  listContainer: {
    padding: 20,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  itemSubtext: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});
