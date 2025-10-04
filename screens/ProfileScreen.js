import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { colors, commonStyles } from '../theme';
import RecentActivity from '../components/RecentActivity';

const ProfileScreen = () => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const { signOut, user, userProfile } = useAuth();

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
    console.log(userProfile?.reviews);
    return userProfile?.reviews ? userProfile.reviews.length : 0;
  };

  const getFavoritesCount = () => {
    if (!userProfile?.favorites || !userProfile.favorites[0]) {
      return 0;
    }
    return Array.isArray(userProfile.favorites[0].favorite) ? userProfile.favorites[0].favorite.length : 0;

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
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{getReviewsCount()}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{getFollowsCount()}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{getFavoritesCount()}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <RecentActivity 
          follows={userProfile?.follows}
          reviews={userProfile?.reviews}
          favorites={userProfile?.favorites}
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
  modalOverlay: {
    ...commonStyles.modalOverlay
  },
  modalContent: {
    ...commonStyles.modalContent,
    minHeight: 200,
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
