import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { commonStyles } from '../theme/commonStyles';
import { useAuth } from '../context/AuthContext';
import { listService } from '../services/listService';

export default function UserListsScreen({ navigation, route }) {
  const { user } = useAuth();
  const userId = route.params?.userId || user?.id;
  const isOwnProfile = userId === user?.id;
  const mode = route.params?.mode || 'view';
  const itemToAdd = route.params?.itemToAdd;
  
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLists = async () => {
    try {
      if (userId) {
        const userLists = await listService.getUserLists(userId);
        setLists(userLists);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLists();
    }, [userId])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadLists();
  };

  const handleListPress = async (list) => {
    if (mode === 'select' && itemToAdd) {
      try {
        const currentItems = list.items || list.list_items || [];
        const newItem = { ...itemToAdd, position: currentItems.length };
        
        await listService.addListItem(list.id, newItem);
        Alert.alert('Success', 'Added to list', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    } else {
      navigation.navigate('ListDetail', { listId: list.id, title: list.title });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.listCard}
      onPress={() => handleListPress(item)}
    >
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>{item.title}</Text>
        {item.isPublic ? (
          <Ionicons name="globe-outline" size={20} color={colors.secondary} />
        ) : (
          <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
        )}
      </View>
      {item.description ? (
        <Text style={styles.listDescription} numberOfLines={2}>{item.description}</Text>
      ) : null}
      <Text style={styles.itemCount}>
        {item.list_items ? item.list_items.length : 0} items
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>
          {mode === 'select' ? 'Select List' : 'My Lists'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={lists}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>You have no lists yet</Text>
            </View>
          }
        />
      )}

      {isOwnProfile && mode !== 'select' && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => navigation.navigate('CreateList')}
        >
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
  },
  listCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  listDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  itemCount: {
    fontSize: 12,
    color: colors.textMuted,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
