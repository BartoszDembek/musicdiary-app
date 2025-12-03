import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, Pressable, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { colors, commonStyles } from '../theme';
import RecentActivity from '../components/RecentActivity';

const ProfileScreen = () => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const { signOut, user, userProfile } = useAuth();
  const navigation = useNavigation();

  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `Joined: ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleLogout = async () => {
    await signOut();
    setIsSettingsVisible(false);
  };

  const getFollowsCount = () => {
    if (!userProfile?.follows || !userProfile.follows[0]) {
      return 0;
    }
    return Array.isArray(userProfile.follows[0].follow) ? userProfile.follows[0].follow.length : 0;
  };

  const getReviewsCount = () => {
    return userProfile?.reviews ? userProfile.reviews.length : 0;
  };

  const getFavoritesCount = () => {
    if (!userProfile?.favorites || !userProfile.favorites[0]) {
      return 0;
    }
    return Array.isArray(userProfile.favorites[0].favorite) ? userProfile.favorites[0].favorite.length : 0;
  };

  const getFollowersCount = () => {
    // Mock data - do zaimplementowania w przyszłości
    return 0;
  };

  const handleStatPress = (type) => {
    let data = [];
    let title = '';

    switch (type) {
      case 'reviews':
        data = userProfile?.reviews || [];
        title = 'Reviews';
        break;
      case 'followers':
        // Mock data - do zaimplementowania w przyszłości
        data = [];
        title = 'Followers';
        break;
      case 'following':
        data = userProfile?.follows?.[0]?.follow || [];
        title = 'Following';
        break;
      case 'favorites':
        data = userProfile?.favorites?.[0]?.favorite || [];
        title = 'Favorites';
        break;
    }

    navigation.navigate('StatsDetail', { type, data, title });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Pressable 
            style={styles.settingsButton}
            onPress={() => setIsSettingsVisible(true)}
          >
            <Ionicons name="settings-outline" size={24} color={colors.primary} />
          </Pressable>
        </View>

        {/* Settings Modal */}
        <Modal
          visible={isSettingsVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsSettingsVisible(false)}
          statusBarTranslucent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Settings</Text>
                <Pressable 
                  onPress={() => setIsSettingsVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={colors.primary} />
                </Pressable>
              </View>

              <Pressable 
                style={styles.editProfileButton}
                onPress={() => {
                  setIsSettingsVisible(false);
                  navigation.navigate('EditProfile');
                }}
              >
                <Ionicons name="person-outline" size={24} color={colors.primary} />
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </Pressable>

              <Pressable 
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={24} color={colors.tertiary} />
                <Text style={styles.logoutText}>Sign Out</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarContainer}>
            {userProfile?.avatar && userProfile.avatar !== "NULL" ? (
              <Image 
                source={{ uri: userProfile.avatar }} 
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>
                {userProfile?.username ? userProfile.username[0].toUpperCase() : '?'}
              </Text>
            )}
          </View>
          <Text style={styles.userName}>{userProfile?.username || 'Loading...'}</Text>
          <Text style={styles.userEmail}>{userProfile?.email || 'Loading...'}</Text>
          <Text style={styles.joinDate}>
            {userProfile?.created_at ? formatJoinDate(userProfile.created_at) : 'Loading...'}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Pressable 
            style={styles.statItem}
            onPress={() => handleStatPress('reviews')}
          >
            <Text style={styles.statNumber}>{getReviewsCount()}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </Pressable>
          <Pressable 
            style={styles.statItem}
            onPress={() => handleStatPress('followers')}
          >
            <Text style={styles.statNumber}>{getFollowersCount()}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </Pressable>
          <Pressable 
            style={styles.statItem}
            onPress={() => handleStatPress('following')}
          >
            <Text style={styles.statNumber}>{getFollowsCount()}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </Pressable>
          <Pressable 
            style={styles.statItem}
            onPress={() => handleStatPress('favorites')}
          >
            <Text style={styles.statNumber}>{getFavoritesCount()}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </Pressable>
        </View>

        <View style={styles.actionButtonsContainer}>
          <Pressable 
            style={styles.actionButton}
            onPress={() => navigation.navigate('UserLists', { userId: user?.id })}
          >
            <Ionicons name="list" size={24} color={colors.primary} />
            <Text style={styles.actionButtonText}>My Lists</Text>
          </Pressable>
        </View>

        {/* Recent Activity */}
        <RecentActivity 
          follows={userProfile?.follows}
          reviews={userProfile?.reviews}
          favorites={userProfile?.favorites}
          review_comments={userProfile?.review_comments}
        />
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
    ...commonStyles.header
  },
  headerTitle: {
    ...commonStyles.headerTitle
  },
  settingsButton: {
    padding: 8,
  },
  userInfoContainer: {
    alignItems: 'center',
    padding: 20,
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
  avatarText: {
    fontSize: 40,
    color: colors.primary,
    fontWeight: 'bold',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 24,
    color: colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  actionButtonsContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  actionButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    ...commonStyles.modalOverlay,
    zIndex: 9999,
    elevation: 9999,
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'android' ? 60 : 0,
  },
  modalContent: {
    ...commonStyles.modalContent,
    minHeight: 200,
    zIndex: 10000,
    elevation: 10000,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    maxHeight: '60%',
  },
  modalHeader: {
    ...commonStyles.modalHeader
  },
  modalTitle: {
    ...commonStyles.modalTitle
  },
  closeButton: {
    padding: 5,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.surface,
    borderRadius: 12,
    gap: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editProfileText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.tertiaryLight,
    borderRadius: 12,
    gap: 10,
  },
  logoutText: {
    color: colors.tertiary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
