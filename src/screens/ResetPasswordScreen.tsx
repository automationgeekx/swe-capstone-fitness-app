import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { submitNewPassword } from '../services/auth';
import CustomButton from '../components/CustomButton';
import CloseButton from '../components/CloseButton';
import CustomInput from '../components/CustomInput';

export default function ResetPasswordScreen({ route, navigation }) {
  const { email, code } = route.params;
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleResetPassword = async () => {
    // Validate inputs
    if (!form.newPassword) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    // Password complexity check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(form.newPassword)) {
      Alert.alert(
        'Password Requirements', 
        'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.'
      );
      return;
    }
    
    setIsLoading(true);
    try {
      await submitNewPassword(email, code, form.newPassword);
      Alert.alert('Success', 'Your password has been reset successfully', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      console.error('Error resetting password:', error);
      
      let errorMessage = 'Failed to reset password. Please try again.';
      
      if (error.name === 'CodeMismatchException' || 
          error.name === 'ExpiredCodeException' || 
          error.message?.includes('Invalid code')) {
        errorMessage = 'Verification code is invalid or has expired. Please request a new code.';
        Alert.alert('Error', errorMessage, [
          { text: 'OK', onPress: () => navigation.navigate('ForgotPassword') }
        ]);
      } else if (error.name === 'InvalidPasswordException') {
        errorMessage = 'Password does not meet requirements. It must include uppercase, lowercase, numbers, and special characters.';
        Alert.alert('Error', errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CloseButton />
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Please enter your new password</Text>
      
      <Text style={styles.label}>New Password</Text>
      <CustomInput
        value={form.newPassword}
        onChangeText={(text) => handleChange('newPassword', text)}
        placeholder="Enter new password"
        secureTextEntry
        style={styles.input}
      />
      
      <Text style={styles.label}>Confirm Password</Text>
      <CustomInput
        value={form.confirmPassword}
        onChangeText={(text) => handleChange('confirmPassword', text)}
        placeholder="Confirm new password"
        secureTextEntry
        style={styles.input}
      />
      
      <CustomButton 
        title={isLoading ? "Resetting..." : "Reset Password"} 
        onPress={handleResetPassword}
        isLoading={isLoading}
        style={styles.button}
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
    marginBottom: 10,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 5,
  },
  input: {
    width: '80%',
    marginBottom: 15,
  },
  button: {
    width: '80%',
    marginTop: 10,
  }
}); 