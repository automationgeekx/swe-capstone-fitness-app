import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { initiateForgotPassword } from '../services/auth';
import CustomButton from '../components/CustomButton';
import CloseButton from '../components/CloseButton';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    try {
      await initiateForgotPassword(email.toLowerCase());
      navigation.navigate('ForgotPasswordVerify', { email: email.toLowerCase() });
    } catch (error) {
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
      console.error('Error sending verification code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CloseButton />
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <CustomButton 
        title={isLoading ? "Sending..." : "Send Code"} 
        onPress={handleForgotPassword}
        isLoading={isLoading}
      />
    </View>
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
  input: {
    width: '80%',
    height: 40,
    backgroundColor: '#303030',
    color: '#fff',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
}); 