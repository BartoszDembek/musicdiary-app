import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Modal, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
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
    return `Joined ${months[date.getMonth()]} ${date.getFullYear()}`;
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
        // Mock data - do zaimplementowania w przyszłości
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

  const stats = [
    { label: 'Reviews', value: getReviewsCount() },
    { label: 'Followers', value: getFollowersCount() },
    { label: 'Following', value: getFollowsCount() },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainContainer}>
          {/* Glass Card */}
          <View style={styles.glassCard}>
            {/* Gradient Background */}
            <LinearGradient
              colors={['rgba(224, 170, 255, 0.6)', 'rgba(187, 178, 255, 0.4)', 'rgba(157, 77, 221, 0.3)']}
              style={styles.gradientBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />

            {/* Content */}
            <View style={styles.cardContent}>
              {/* Header with Avatar and Info */}
              <View style={styles.headerRow}>
                {/* Avatar */}
                <LinearGradient
                  colors={colors.gradientHero.split(', ')}
                  style={styles.avatarContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
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
                </LinearGradient>

                {/* User Info */}
                <View style={styles.userInfo}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {userProfile?.username || 'Loading...'}
                  </Text>
                  <Text style={styles.userMeta}>
                    {userProfile?.created_at ? formatJoinDate(userProfile.created_at) : 'Loading...'}
                  </Text>
                </View>

                {/* Settings Button */}
                <Pressable 
                  testID="settings-button"
                  style={styles.settingsButton}
                  onPress={() => setIsSettingsVisible(true)}
                >
                  <Ionicons name="settings-outline" size={18} color={colors.primary} />
                </Pressable>
              </View>

              {/* Stats Grid */}
              <View style={styles.statsGrid}>
                {stats.map((stat) => (
                  <View key={stat.label} style={styles.statCard}>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Recent Activity Section */}
          <RecentActivity 
            follows={userProfile?.follows}
            reviews={userProfile?.reviews}
            favorites={userProfile?.favorites}
            review_comments={userProfile?.review_comments}
          />
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
  contentContainer: {
    paddingVertical: 40,
  },
  mainContainer: {
    maxWidth: 768, // max-w-3xl ≈ 768px
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  glassCard: {
    backgroundColor: 'rgba(36, 23, 70, 0.85)', // glass effect
    borderRadius: 24, // rounded-3xl
    padding: 24, // p-6
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  gradientBackground: {
    position: 'absolute',
    top: -96, // -top-24
    right: -96, // -right-24
    width: 288, // size-72 = 288px
    height: 288,
    borderRadius: 144, // circular
    opacity: 0.6,
  },
  cardContent: {
    position: 'relative',
    zIndex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20, // gap-5
  },
  avatarContainer: {
    width: 80, // size-20
    height: 80,
    borderRadius: 40, // rounded-full
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    fontSize: 24, // text-2xl (zmniejszone z 30)
    color: colors.mauve || colors.primary,
    fontFamily: 'Fraunces_700Bold',
  },
  userInfo: {
    flex: 1,
    minWidth: 0, // min-w-0
  },
  userName: {
    fontSize: 24, // text-2xl (zmniejszone z 30)
    color: colors.textPrimary,
    fontFamily: 'Fraunces_700Bold',
    marginBottom: 4,
  },
  userMeta: {
    fontSize: 14, // text-sm
    color: colors.textSecondary,
    marginTop: 4,
  },
  settingsButton: {
    width: 40, // size-10
    height: 40,
    borderRadius: 20, // rounded-full
    backgroundColor: 'rgba(36, 23, 70, 0.6)', // glass
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  bioText: {
    marginTop: 24, // mt-6
    fontSize: 14, // zmniejszone z 16
    color: colors.textPrimary,
    lineHeight: 20, // zmniejszony lineHeight
    maxWidth: 384, // max-w-xl
    opacity: 0.9,
  },
  statsGrid: {
    marginTop: 28, // mt-7
    flexDirection: 'row',
    gap: 12, // gap-3
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(139, 92, 246, 0.4)', // bg-secondary/40
    borderRadius: 16, // rounded-2xl
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)', // border-border/50
    paddingHorizontal: 12, // px-3 (zmniejszone)
    paddingVertical: 12, // py-3 (zmniejszone)
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20, // zmniejszone z 24
    color: colors.primary, // text-gradient - using primary for now
    fontFamily: 'Fraunces_700Bold',
    marginBottom: 4, // zmniejszony marginBottom
  },
  statLabel: {
    fontSize: 10, // zmniejszone z 12
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5, // zmniejszony tracking
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
