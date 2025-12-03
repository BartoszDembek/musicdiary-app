import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { commonStyles } from '../theme/commonStyles';
import { useAuth } from '../context/AuthContext';
import { listService } from '../services/listService';

export default function ListsScreen({ navigation }) {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('my-lists'); // 'my-lists' | 'search'
  const [searchQuery, setSearchQuery] = useState('');
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadMyLists = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const userLists = await listService.getUserLists(user.id);
      setLists(userLists);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const searchLists = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const results = await listService.searchLists(searchQuery);
      setLists(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (viewMode === 'my-lists') {
        loadMyLists();
      }
    }, [user?.id, viewMode])
  );

  const onRefresh = () => {
    setRefreshing(true);
    if (viewMode === 'my-lists') {
      loadMyLists();
    } else {
      searchLists();
    }
  };

  const toggleSearch = () => {
    if (viewMode === 'my-lists') {
      setViewMode('search');
      setLists([]);
    } else {
      setViewMode('my-lists');
      setSearchQuery('');
      loadMyLists();
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.listCard}
      onPress={() => navigation.navigate('ListDetail', { listId: item.id, title: item.title })}
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
      <View style={styles.listFooter}>
        <Text style={styles.itemCount}>
          {item.items ? item.items.length : 0} elementów
        </Text>
        {item.username && (
          <Text style={styles.authorName}>by {item.username}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        {viewMode === 'search' ? (
          <View style={styles.searchContainer}>
            <TouchableOpacity onPress={toggleSearch}>
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Szukaj list..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={searchLists}
              autoFocus
            />
            <TouchableOpacity onPress={searchLists}>
              <Ionicons name="search" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={commonStyles.headerTitle}>Listy</Text>
            <TouchableOpacity onPress={toggleSearch} style={styles.iconButton}>
              <Ionicons name="search" size={24} color={colors.primary} />
            </TouchableOpacity>
          </>
        )}
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
              <Text style={styles.emptyText}>
                {viewMode === 'search' 
                  ? (searchQuery ? 'Brak wyników wyszukiwania' : 'Wpisz frazę aby wyszukać') 
                  : 'Nie masz jeszcze żadnych list'}
              </Text>
            </View>
          }
        />
      )}

      {viewMode === 'my-lists' && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => navigation.navigate('CreateList')}
        >
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    padding: 8,
    color: colors.textPrimary,
    fontSize: 16,
  },
  iconButton: {
    padding: 8,
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
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCount: {
    fontSize: 12,
    color: colors.textMuted,
  },
  authorName: {
    fontSize: 12,
    color: colors.primary,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
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
