import React, { useState, useEffect, useCallback, memo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserService, { UserData } from '@/user/services/users';
import AuthService from '@/auth/services/auth-service';
import NetInfo from '@react-native-community/netinfo';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import i18n, { changeLanguage } from '@/i18n/i18n';

// Memoized MenuItem component to prevent unnecessary re-renders
const MenuItem = memo(({ icon, title, onPress, color = '#666666', textColor = '#333333' }: {
  icon: string;
  title: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIconContainer}>
      <Ionicons name={icon as any} size={24} color={color} />
    </View>
    <Text style={[styles.menuItemText, { color: textColor }]}>{title}</Text>
    <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
  </TouchableOpacity>
));

// Main component using React.memo to prevent unnecessary re-renders
const AccountScreen = memo(() => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const { signOut, user } = useAuth();
  const router = useRouter();
  const authService = new AuthService();
  
  // Define fetchUserData first
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check for internet connection first
      const netInfo = await NetInfo.fetch();
      setIsConnected(netInfo.isConnected);
      
      if (!netInfo.isConnected) {
        setError('Internet connection is not available');
        setLoading(false);
        return;
      }
      
      if (user?.id) {
        try {
          const data = await UserService.getUserById(user.id);
          if (data) {
            setUserData(data);
            return;
          }
        } catch (apiError) {
          console.log('Error fetching from API, falling back to stored data:', apiError);
        }
      }
      
      // Fallback to stored user data
      const userData = await authService.getUserData();
      if (userData) {
        const userDataTyped = {
          id: userData.id,
          username: "",
          email: userData.email,
          photoUrl: ""
        }
        setUserData(userDataTyped as unknown as UserData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load account information. Please try again.');
      
      // Use mock data if API fails (for development purposes)
      if (__DEV__) {
        setUserData({
          id: 1,
          username: 'andrew_ainsley',
          firstName: 'Andrew',
          lastName: 'Ainsley',
          email: 'andrew.ainsley@yourdomain.com',
          photoUrl: 'https://i.pravatar.cc/150?img=12'
        });
      }    
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Handler to retry data fetching - must be defined after fetchUserData
  const handleRetry = useCallback(() => {
    setError(null);
    fetchUserData();
  }, [fetchUserData]);

  // Use useCallback to memoize functions that are passed as props
  const handleLogout = useCallback(() => {
    Alert.alert(
      t('Logout'),
      t('Are you sure you want to logout?'),
      [{
          text: t('Cancel'),
          style: 'cancel'
        },
        {
          text: t('Logout'),
          onPress: async () => {
            try {
              await signOut();
              // Navigation will happen automatically via the auth context
              router.replace('/auth/login');
            } catch (error) {
              Alert.alert('Error', t('Error logging out.'));
            }
          },
          style: 'destructive'
        }
      ]
    );
  }, [signOut, router, t]);

  // Listen for network state changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected && error === 'Internet connection is not available') {
        // Auto retry when connection is restored
        handleRetry();
      }
    });

    return () => unsubscribe();
  }, [error, handleRetry]);

  // Memoize menu item handlers
  const handleNotifications = useCallback(() => console.log('Notifications pressed'), []);
  const handleSecurity = useCallback(() => console.log('Account & Security pressed'), []);
  const handleBilling = useCallback(() => console.log('Billing pressed'), []);
  const handlePayment = useCallback(() => console.log('Payment pressed'), []);
  const handleLinkedAccounts = useCallback(() => console.log('Linked Accounts pressed'), []);
  const handleAppearance = useCallback(() => console.log('Appearance pressed'), []);
  const handleAnalytics = useCallback(() => console.log('Analytics pressed'), []);
  const handleSupport = useCallback(() => console.log('Support pressed'), []);

  // Memoize menu items array to prevent re-creation on each render
  const menuItems = React.useMemo(() => [
    { icon: 'notifications-outline', title: 'Notifications', onPress: handleNotifications },
    { icon: 'shield-checkmark-outline', title: 'Account & Security', onPress: handleSecurity },
    { icon: 'star-outline', title: 'Billing & Subscriptions', onPress: handleBilling },
    { icon: 'card-outline', title: 'Payment Methods', onPress: handlePayment },
    { icon: 'git-network-outline', title: 'Linked Accounts', onPress: handleLinkedAccounts },
    { icon: 'eye-outline', title: 'App Appearance', onPress: handleAppearance },
    { icon: 'analytics-outline', title: 'Data & Analytics', onPress: handleAnalytics },
    { icon: 'help-circle-outline', title: 'Help & Support', onPress: handleSupport },
  ], [
    handleNotifications, 
    handleSecurity, 
    handleBilling, 
    handlePayment, 
    handleLinkedAccounts, 
    handleAppearance, 
    handleAnalytics, 
    handleSupport
  ]);  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchUserData();
    }
    return () => {
      isMounted = false;
    };
  }, [fetchUserData]);

  // Error state display
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="leaf" size={24} color="#00A86B" />
            </View>
            <Text style={styles.headerTitle}>{t('Account')}</Text>
          </View>

          {/* Error Profile Section */}
          <View style={styles.errorProfileSection}>
            <Ionicons 
              name={!isConnected ? "cloud-offline" : "alert-circle-outline"} 
              size={40} 
              color="#FF6B6B" 
            />
            <Text style={styles.errorText}>{t(error)}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>{t('Try Again')}</Text>
            </TouchableOpacity>
          </View>

          {/* Upgrade Card */}
          <TouchableOpacity style={styles.upgradeCard}>
            <View style={styles.crownContainer}>
              <Ionicons name="trophy" size={24} color="#FF9500" />
            </View>
            <View style={styles.upgradeContent}>
              <Text style={styles.upgradeTitle}>{t('Upgrade Plan to Unlock More!')}</Text>
              <Text style={styles.upgradeSubtitle}>{t('Enjoy all the benefits and explore more possibilities')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Menu Items */}
          {menuItems.map((item, index) => (
            <MenuItem 
              key={index} 
              icon={item.icon} 
              title={t(item.title)} 
              onPress={item.onPress} 
            />
          ))}

          {/* Logout Button */}
          <MenuItem
            icon="log-out-outline"
            title={t('Logout')}
            onPress={handleLogout}
            color="#FF6B6B"
            textColor="#FF6B6B"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Loading state display
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#00A86B" />
        <Text style={styles.loadingText}>{t('Loading profile...')}</Text>
      </SafeAreaView>
    );
  }

  const displayName = userData ? `${userData.firstName} ${userData.lastName}` : t('User');
  console.log('User Data:', userData);
  const email = userData?.email || '';
  const photoUrl = userData?.photoUrl || 'https://via.placeholder.com/60';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={24} color="#00A86B" />
          </View>
          <Text style={styles.headerTitle}>{t('Account')}</Text>
        </View>

        {/* Profile Section */}
        <TouchableOpacity style={styles.profileSection}
          onPress={() => router.push('/account/profile')}
        >
          <Image
            source={{ uri: photoUrl }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{email}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
        </TouchableOpacity>

        {/* Upgrade Card */}
        <TouchableOpacity style={styles.upgradeCard}>
          <View style={styles.crownContainer}>
            <Ionicons name="trophy" size={24} color="#FF9500" />
          </View>
          <View style={styles.upgradeContent}>
            <Text style={styles.upgradeTitle}>{t('Upgrade Plan to Unlock More!')}</Text>
            <Text style={styles.upgradeSubtitle}>{t('Enjoy all the benefits and explore more possibilities')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <MenuItem 
            key={index} 
            icon={item.icon} 
            title={t(item.title)} 
            onPress={item.onPress} 
          />
        ))}

        {/* Language Switch Button */}
        <TouchableOpacity
          style={[styles.menuItem, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F0F0' }]}
          onPress={() => {
            const newLang = i18n.language === 'es' ? 'en' : 'es';
            changeLanguage(newLang);
          }}
        >
          <Text style={[styles.menuItemText, { color: '#00A86B', fontWeight: 'bold' }]}>🌐 {i18n.language === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish'}</Text>
        </TouchableOpacity>
        {/* Logout Button */}
        <MenuItem
          icon="log-out-outline"
          title={t('Logout')}
          onPress={handleLogout}
          color="#FF6B6B"
          textColor="#FF6B6B"
        />
      </ScrollView>
    </SafeAreaView>
  );
});

AccountScreen.displayName = 'AccountScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#00A86B',
    borderRadius: 8,
    marginTop: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  errorProfileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFF5F5',
  },
});

export default AccountScreen;