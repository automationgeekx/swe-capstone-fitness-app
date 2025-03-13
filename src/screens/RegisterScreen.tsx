import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { handleUserSignUp } from '../services/auth';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import AnimationWrapper from '../components/AnimationWrapper';
import showCustomAlert from '../components/CustomAlert';
import CloseButton from '../components/CloseButton';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const logoAnimation = useRef(new Animated.Value(0)).current;
  const formAnimation = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(0)).current;
  const screenAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(logoAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
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

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const validateForm = () => {
    if (!form.name || !form.email || !form.password) {
      showCustomAlert({ title: 'Error', message: 'Please fill in all required fields', type: 'error' });
      return false;
    }
    if (form.email.toLowerCase() !== form.confirmEmail.toLowerCase()) {
      showCustomAlert({ title: 'Error', message: 'Emails do not match', type: 'error' });
      return false;
    }
    if (form.password !== form.confirmPassword) {
      showCustomAlert({ title: 'Error', message: 'Passwords do not match', type: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const response = await handleUserSignUp(form.email.toLowerCase(), form.password, form.name);
      if (response.isUnconfirmedUser) {
        navigation.navigate('VerifyEmail', { email: form.email, isUnconfirmedUser: true });
      } else {
        navigation.navigate('VerifyEmail', { email: form.email, isUnconfirmedUser: false });
      }
    } catch (error) {
      let errorMessage = 'Something went wrong. Please try again.';
      switch(error.name) {
        case 'InvalidPasswordException':
          errorMessage = 'Your password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.';
          break;
        case 'InvalidParameterException':
          if (error.message.includes('email')) {
            errorMessage = 'Please enter a valid email address.';
          }
          break;
        case 'UsernameExistsException':
          errorMessage = 'This email is already registered. Please try signing in instead.';
          break;
      }
      showCustomAlert({ title: 'Registration Error', message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimationWrapper style={styles.container} animationValue={screenAnimation}>
      <CloseButton />
      <Animated.Image
        source={require('../../assets/the-playbook-logo.png')}
        style={[styles.logo, { opacity: logoAnimation }]}
      />
      <AnimationWrapper style={styles.formContainer} animationValue={formAnimation}>
        <Text style={styles.label}>Name</Text>
        <CustomInput
          value={form.name}
          onChangeText={(text) => handleChange('name', text)}
          placeholder="Enter your full name."
          style={styles.input}
        />
        <Text style={styles.label}>Email</Text>
        <CustomInput
          value={form.email}
          onChangeText={(text) => handleChange('email', text)}
          placeholder="Enter your email address."
          keyboardType="email-address"
          style={styles.input}
        />
        <Text style={styles.label}>Confirm Email</Text>
        <CustomInput
          value={form.confirmEmail}
          onChangeText={(text) => handleChange('confirmEmail', text)}
          placeholder="Confirm your email address."
          keyboardType="email-address"
          style={styles.input}
        />
        <Text style={styles.label}>Password</Text>
        <CustomInput
          value={form.password}
          onChangeText={(text) => handleChange('password', text)}
          placeholder="Enter your password."
          secureTextEntry
          style={styles.input}
        />
        <Text style={styles.label}>Confirm Password</Text>
        <CustomInput
          value={form.confirmPassword}
          onChangeText={(text) => handleChange('confirmPassword', text)}
          placeholder="Confirm your password."
          secureTextEntry
          style={styles.input}
        />
      </AnimationWrapper>
      <AnimationWrapper style={styles.buttonContainer} animationValue={buttonAnimation}>
        <CustomButton
          title={isLoading ? 'Registering...' : 'Next'}
          onPress={handleSubmit}
          isLoading={isLoading}
          style={styles.nextButton}
        />
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </AnimationWrapper>
    </AnimationWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
    paddingBottom: 85,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 5,
  },
  label: {
    color: '#fff',
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 5,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    height: 40,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  nextButton: {
    width: '90%',
    marginBottom: 20,
  },
  signInContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  signInText: {
    color: '#fff',
  },
  signInLink: {
    color: '#5f33e1',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
