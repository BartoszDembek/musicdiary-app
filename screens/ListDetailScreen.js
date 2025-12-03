import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { commonStyles } from '../theme/commonStyles';
import { listService } from '../services/listService';

export default function ListDetailScreen({ route, navigation }) {
  const { listId, title } = route.params;
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [localItems, setLocalItems] = useState([]);

  useEffect(() => {
    loadListDetails();
  }, [listId]);

  const loadListDetails = async () => {
    try {
      const data = await listService.getListDetails(listId);

      // Sort items by position
      if (data.list_items) {
        data.list_items.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
      }

      setList(data);
      setEditTitle(data.title);
      setEditDescription(data.description || '');
      setLocalItems(data.list_items || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load list details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Update list details
      await listService.updateList(listId, {
        title: editTitle,
        description: editDescription,
        isPublic: list.isPublic // Preserve existing visibility
      });

      // Update items order if changed
      // Note: This assumes the backend supports reordering via this endpoint
      // If not, we might need to implement a different strategy
      if (JSON.stringify(localItems) !== JSON.stringify(list.list_items)) {
         // Assuming updateListItemsOrder takes list of items with their new positions
         // We might need to map to just IDs or full objects depending on backend
         await listService.updateListItemsOrder(listId, localItems);
      }

      setIsEditing(false);
      loadListDetails(); // Reload to get fresh data
      Alert.alert('Success', 'List updated successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
    }
  };

  const moveItem = (index, direction) => {
    const newItems = [...localItems];
    if (direction === 'up' && index > 0) {
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    } else if (direction === 'down' && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    }
    setLocalItems(newItems);
  };

  const handleDeleteList = () => {
    Alert.alert(
      'Delete List',
      'Are you sure you want to delete this list? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await listService.deleteList(listId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemPosition}>{index + 1}</Text>
      {item.cover ? (
        <Image source={{ uri: item.cover }} style={styles.itemImage} />
      ) : (
        <View style={styles.itemIcon}>
          <Ionicons 
            name={item.type === 'album' ? 'disc' : item.type === 'artist' ? 'person' : 'musical-note'} 
            size={24} 
            color={colors.primary} 
          />
        </View>
      )}
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.item_name}</Text>
        <Text style={styles.itemSubtext}>{item.artist_name || item.type}</Text>
      </View>
      {isEditing && (
        <View style={styles.reorderControls}>
          <TouchableOpacity 
            onPress={() => moveItem(index, 'up')} 
            disabled={index === 0}
            style={[styles.moveButton, index === 0 && styles.disabledButton]}
          >
            <Ionicons name="chevron-up" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => moveItem(index, 'down')} 
            disabled={index === localItems.length - 1}
            style={[styles.moveButton, index === localItems.length - 1 && styles.disabledButton]}
          >
            <Ionicons name="chevron-down" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const handleCancel = () => {
    setEditTitle(list.title);
    setEditDescription(list.description || '');
    setLocalItems(list.list_items || []);
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <TouchableOpacity onPress={() => isEditing ? handleCancel() : navigation.goBack()}>
          <Ionicons name={isEditing ? "close" : "arrow-back"} size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        
        {isEditing ? (
          <TextInput
            style={[commonStyles.headerTitle, styles.headerInput]}
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder="List Title"
            placeholderTextColor={colors.textSecondary}
          />
        ) : (
          <Text style={commonStyles.headerTitle} numberOfLines={1}>{list?.title || title}</Text>
        )}

        <View style={styles.headerActions}>
          {isEditing ? (
            <TouchableOpacity onPress={handleSave}>
              <Ionicons name="checkmark" size={24} color={colors.primary} />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.actionButton}>
                <Ionicons name="create-outline" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteList}>
                <Ionicons name="trash-outline" size={24} color={colors.tertiary} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.content}>
        {isEditing ? (
          <View style={styles.descriptionContainer}>
            <TextInput
              style={styles.descriptionInput}
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="List Description (optional)"
              placeholderTextColor={colors.textSecondary}
              multiline
            />
          </View>
        ) : (
          list?.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>{list.description}</Text>
            </View>
          ) : null
        )}

        <FlatList
          data={isEditing ? localItems : (list?.list_items || [])}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>This list is empty</Text>
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
  descriptionInput: {
    color: colors.textPrimary,
    fontSize: 16,
    fontStyle: 'italic',
    minHeight: 40,
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
  itemPosition: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    minWidth: 20,
    textAlign: 'center',
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
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: colors.cardDark,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 15,
  },
  headerInput: {
    flex: 1,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingBottom: 2,
  },
  reorderControls: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  moveButton: {
    padding: 4,
  },
  disabledButton: {
    opacity: 0.3,
  },
});
