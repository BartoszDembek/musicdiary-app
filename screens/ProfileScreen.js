import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const mockUserData = {
  name: "John Doe",
  email: "john.doe@example.com",
  joinDate: "Dołączono: Styczeń 2024",
  stats: {
    albumsReviewed: 42,
    artistsFollowed: 15,
    favoriteTracks: 128
  },
  recentActivity: [
    { type: 'review', album: 'Random Access Memories', artist: 'Daft Punk', date: '2 dni temu' },
    { type: 'follow', artist: 'The Weeknd', date: '5 dni temu' },
    { type: 'review', album: 'Dawn FM', artist: 'The Weeknd', date: 'tydzień temu' },
  ]
};

const ProfileScreen = () => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    setIsSettingsVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
          <Pressable 
            style={styles.settingsButton}
            onPress={() => setIsSettingsVisible(true)}
          >
            <Ionicons name="settings-outline" size={24} color="#BB9AF7" />
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
                <Text style={styles.modalTitle}>Ustawienia</Text>
                <Pressable 
                  onPress={() => setIsSettingsVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#BB9AF7" />
                </Pressable>
              </View>

              <Pressable 
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={24} color="#F7768E" />
                <Text style={styles.logoutText}>Wyloguj się</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{mockUserData.name[0]}</Text>
          </View>
          <Text style={styles.userName}>{mockUserData.name}</Text>
          <Text style={styles.userEmail}>{mockUserData.email}</Text>
          <Text style={styles.joinDate}>{mockUserData.joinDate}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockUserData.stats.albumsReviewed}</Text>
            <Text style={styles.statLabel}>Recenzje</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockUserData.stats.artistsFollowed}</Text>
            <Text style={styles.statLabel}>Obserwowani</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockUserData.stats.favoriteTracks}</Text>
            <Text style={styles.statLabel}>Ulubione</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Ostatnia aktywność</Text>
          {mockUserData.recentActivity.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <Ionicons 
                name={activity.type === 'review' ? 'document-text' : 'person-add'} 
                size={24} 
                color="#BB9AF7" 
              />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  {activity.type === 'review' ? `Zrecenzowano ${activity.album}` : `Obserwujesz ${activity.artist}`}
                </Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#414868',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BB9AF7',
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
    backgroundColor: '#414868',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    color: '#BB9AF7',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    color: '#C0CAF5',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#7AA2F7',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: '#565F89',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#414868',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    color: '#BB9AF7',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#565F89',
    marginTop: 4,
  },
  activityContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#BB9AF7',
    fontWeight: '600',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#414868',
  },
  activityContent: {
    marginLeft: 12,
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    color: '#C0CAF5',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
    color: '#565F89',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E1E2E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 200,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#414868',
  },
  modalTitle: {
    fontSize: 20,
    color: '#BB9AF7',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(247, 118, 142, 0.1)',
    borderRadius: 12,
    gap: 10,
  },
  logoutText: {
    color: '#F7768E',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
