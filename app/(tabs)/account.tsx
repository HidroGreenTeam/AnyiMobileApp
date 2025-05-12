import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AccountScreen() {
  const menuItems = [
    { icon: 'notifications-outline', title: 'Notifications' },
    { icon: 'shield-checkmark-outline', title: 'Account & Security' },
    { icon: 'star-outline', title: 'Billing & Subscriptions' },
    { icon: 'card-outline', title: 'Payment Methods' },
    { icon: 'git-network-outline', title: 'Linked Accounts' },
    { icon: 'eye-outline', title: 'App Appearance' },
    { icon: 'analytics-outline', title: 'Data & Analytics' },
    { icon: 'help-circle-outline', title: 'Help & Support' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={24} color="#00A86B" />
          </View>
          <Text style={styles.headerTitle}>Account</Text>
        </View>

        {/* Profile Section */}
        <TouchableOpacity style={styles.profileSection}>
          <Image
            source={{ uri: 'https://via.placeholder.com/60' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Andrew Ainsley</Text>
            <Text style={styles.profileEmail}>andrew.ainsley@yourdomain.com</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
        </TouchableOpacity>

        {/* Upgrade Card */}
        <TouchableOpacity style={styles.upgradeCard}>
          <View style={styles.crownContainer}>
            <Ionicons name="crop" size={24} color="#FF9500" />
          </View>
          <View style={styles.upgradeContent}>
            <Text style={styles.upgradeTitle}>Upgrade Plan to Unlock More!</Text>
            <Text style={styles.upgradeSubtitle}>Enjoy all the benefits and explore more possibilities</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name={item.icon as any} size={24} color="#666666" />
            </View>
            <Text style={styles.menuItemText}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
          </TouchableOpacity>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
          </View>
          <Text style={[styles.menuItemText, { color: '#FF6B6B' }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  logoContainer: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  upgradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00A86B',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
  },
  crownContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  upgradeContent: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  upgradeSubtitle: {
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
});