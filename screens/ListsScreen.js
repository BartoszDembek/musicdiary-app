import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { commonStyles } from '../theme/commonStyles';
import { useAuth } from '../context/AuthContext';
import { listService } from '../services/listService';

export default function ListsScreen({ navigation }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my'); // 'my' | 'search'
  const [searchQuery, setSearchQuery] = useState('');
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadMyLists = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const userLists = await listService.getUserLists(user.id);
      console.log('Loaded user lists:', userLists);
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
      if (activeTab === 'my') {
        loadMyLists();
      } else {
        setLists([]);
        setSearchQuery('');
      }
    }, [user?.id, activeTab])
  );

  const onRefresh = () => {
    setRefreshing(true);
    if (activeTab === 'my') {
      loadMyLists();
    } else {
      searchLists();
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
          {(item.items || item.list_items || []).length} items
        </Text>
        {item.username && (
          <Text style={styles.authorName}>by {item.username}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Lists</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'my' && styles.activeTab]} 
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>My Lists</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'search' && styles.activeTab]} 
          onPress={() => setActiveTab('search')}
        >
          <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>Search</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'search' && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search lists..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchLists}
          />
          <TouchableOpacity onPress={searchLists} style={styles.searchButton}>
            <Ionicons name="search" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}

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
                {activeTab === 'search' 
                  ? (searchQuery ? 'No search results' : 'Type to search') 
                  : 'You have no lists yet'}
              </Text>
            </View>
          }
        />
      )}

      {activeTab === 'my' && (
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
  tabContainer: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    padding: 12,
    color: colors.textPrimary,
    fontSize: 16,
  },
  searchButton: {
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
