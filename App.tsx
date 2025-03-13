// React and React Native imports
import React, { useState, useEffect } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, Animated, AppRegistry } from 'react-native';

// Navigation imports
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// Third-party library imports
import * as SplashScreen from 'expo-splash-screen';
import { Buffer } from 'buffer';
import { Amplify } from 'aws-amplify';

// Configuration imports
import awsConfig from './src/aws/aws-exports.js';

// Screen imports
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import PreHomeScreen from './src/screens/PreHomeScreen';
import VerifyEmailScreen from './src/screens/VerifyEmailScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ForgotPasswordVerifyScreen from './src/screens/ForgotPasswordVerifyScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';

// Context imports
import { AuthProvider } from './src/contexts/AuthContext';

// Initialize Amplify with aws-exports
Amplify.configure({
  ...awsConfig,
  Analytics: {
    disabled: true,
  },
});

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hideSplashScreen = async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      await SplashScreen.hideAsync();
      setIsLoading(false);
    };

    hideSplashScreen();
  }, []);

  return isLoading ? (
    <View style={styles.splashContainer}>
      <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
    </View>
  ) : (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#000' },
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          }}
        >
          <Stack.Screen name="PreHome" component={PreHomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ForgotPasswordVerify" component={ForgotPasswordVerifyScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen 
            name="Main" 
            component={BottomTabNavigator}
            options={{
              gestureEnabled: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#5f33e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  loader: {
    marginTop: 50,
  },
});

AppRegistry.registerComponent('main', () => App);

export default App;
