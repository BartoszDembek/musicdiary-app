import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { userService } from '../services/userService';
import { followService } from '../services/followService';
import { useAuth } from '../context/AuthContext';
import { colors, commonStyles } from '../theme';
import RecentActivity from '../components/RecentActivity';

const UserProfileScreen = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowed, setIsFollowed] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;
  const { userProfile: currentUserProfile, user, updateUserProfile } = useAuth();

  const checkIfFollowed = () => {
    if (currentUserProfile?.follows?.[0]?.follow && Array.isArray(currentUserProfile.follows[0].follow)) {
      const isUserFollowed = currentUserProfile.follows[0].follow.some(
        item => item.id === userId
      );
      setIsFollowed(isUserFollowed);
    } else {
      setIsFollowed(false);
    }
  };

  const handleFollow = async () => {
    try {
      let updatedProfile;
      const targetUsername = userProfile.username;
      if (isFollowed) {
        updatedProfile = await followService.unfollowUser(user.id, userId);
      } else {
        updatedProfile = await followService.followUser(user.id, userId, targetUsername);
      }
      
      if (updatedProfile) {
        const freshProfileData = await userService.getUserProfile(user.id);
        if (freshProfileData && freshProfileData[0]) {
          await updateUserProfile(freshProfileData[0]);
          setIsFollowed(!isFollowed);
        }
      }
    } catch (error) {
      Alert.alert("Błąd", isFollowed ? "Nie udało się przestać obserwować użytkownika" : "Nie udało się zaobserwować użytkownika");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      loadUserProfile();
    }, [userId])
  );

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const profileData = await userService.getUserProfile(userId);
      if (profileData && profileData[0]) {
        setUserProfile(profileData[0]);
        checkIfFollowed();
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `Joined: ${months[date.getMonth()]} ${date.getFullYear()}`;
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
    if (!userProfile?.followers) {
      return 0;
    }
    return Array.isArray(userProfile.followers) ? userProfile.followers.length : 0;
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
        data = userProfile?.followers || [];
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>User Profile</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>User Profile</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Profile</Text>
          {user?.id !== userId && (
            <Pressable 
              onPress={handleFollow} 
              style={[styles.followButton, isFollowed && styles.followingButton]}
            >
              <Ionicons 
                name={isFollowed ? "checkmark" : "add"} 
                size={18} 
                color={isFollowed ? colors.primary : colors.background} 
              />
              <Text style={[styles.followButtonText, isFollowed && styles.followingText]}>
                {isFollowed ? "Following" : "Follow"}
              </Text>
            </Pressable>
          )}
          {user?.id === userId && <View style={{ width: 40 }} />}
        </View>

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
          <Text style={styles.userName}>{userProfile?.username || 'Unknown'}</Text>
          <Text style={styles.joinDate}>
            {userProfile?.created_at ? formatJoinDate(userProfile.created_at) : ''}
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
  backButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 16,
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
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  followingButton: {
    backgroundColor: colors.surface,
  },
  followButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
  followingText: {
    color: colors.primary,
  },
});

export default UserProfileScreen;
