import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, SafeAreaView, StyleSheet } from 'react-native';

export default function AuthPage() {
  const router = useRouter();

  const handleChangeToSignUp = () => {
    router.push('/auth/sign-up');
  }

  const handleChangeToLogin = () => {
    router.push('/auth/login');
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Status Bar */}
        <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Logo */}
      <View style={styles.logoContainer}>   
        <Image 
          source={require('@/assets/images/ayni-logo.png')}
          style={styles.logo}
        />
      </View>

      {/* Welcome Text */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Let's Get Started!</Text>
        <Text style={styles.welcomeSubtitle}>Let's dive in into your account</Text>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleChangeToSignUp}
        >
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logInButton}
          onPress={handleChangeToLogin}
        >
          <Text style={styles.logInText}>Log in</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Privacy Policy Terms of Service</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  time: {
    fontWeight: 'bold'
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 4
  },
  signal: {},
  wifi: {},
  battery: {},
  logoContainer: {
    alignItems: 'center',
    marginTop: 80
  },
  logo: {
    width: 70,
    height: 70,
    tintColor: '#00a67d'
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 40
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#888'
  },
  socialButtonsContainer: {
    gap: 16,
    marginBottom: 40
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 24
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12
  },
  socialText: {
    fontSize: 16,
    color: '#555'
  },
  bottomButtonsContainer: {
    gap: 16,
    marginTop: '25%'
  },
  signUpButton: {
    backgroundColor: '#00a67d',
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center'
  },
  signUpText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500'
  },
  logInButton: {
    backgroundColor: '#f2f2f2',
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center'
  },
  logInText: {
    color: '#00a67d',
    fontSize: 18,
    fontWeight: '500'
  },
  footer: {
    marginTop: 20,
    alignItems: 'center'
  },
  footerText: {
    color: '#888',
    fontSize: 14
  }
});
