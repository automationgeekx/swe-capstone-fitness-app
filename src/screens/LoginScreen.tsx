import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Animated, Switch, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import AnimationWrapper from '../components/AnimationWrapper';
import CloseButton from '../components/CloseButton';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login, forceSignOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(false);
  const formAnimation = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(0)).current;
  const screenAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(formAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleSwitch = () => setRememberEmail(previousState => !previousState);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      await login(email.toLowerCase(), password);
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Login Failed', 'Unable to login. Please try again.');
    }
  };

  return (
    <AnimationWrapper style={styles.container} animationValue={screenAnimation}>
      <CloseButton />
      <Text style={styles.title}>
        Log in to <Text style={styles.highlight}>The Playbook</Text>
      </Text>
      <AnimationWrapper style={styles.formContainer} animationValue={formAnimation}>
        <Text style={styles.label}>Email</Text>
        <CustomInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email address."
          keyboardType="email-address"
          style={styles.input}
        />
        <Text style={styles.label}>Password</Text>
        <CustomInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password."
          secureTextEntry
          style={styles.input}
        />
        <View style={styles.rememberContainer}>
          <Text style={styles.rememberText}>Remember my Email</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#5f33e1' }}
            thumbColor="#f4f3f4"
            onValueChange={toggleSwitch}
            value={rememberEmail}
          />
        </View>
      </AnimationWrapper>
      <AnimationWrapper style={styles.buttonContainer} animationValue={buttonAnimation}>
        <CustomButton
          title="Login"
          onPress={handleLogin}
          style={styles.loginButton}
        />
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Forgot your password?</Text>
        </TouchableOpacity>
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </AnimationWrapper>
    </AnimationWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  highlight: {
    color: '#5f33e1',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 5,
  },
  input: {
    height: 40,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 10,
  },
  rememberText: {
    color: '#fff',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButton: {
    width: '90%',
    marginBottom: 20,
  },
  forgotPassword: {
    color: '#5f33e1',
    marginBottom: 20,
  },
  signUpContainer: {
    flexDirection: 'row',
  },
  signUpText: {
    color: '#fff',
  },
  signUpLink: {
    color: '#5f33e1',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
