import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { confirmResetPassword } from 'aws-amplify/auth';
import { initiateForgotPassword } from '../services/auth';
import CustomButton from '../components/CustomButton';
import CloseButton from '../components/CloseButton';

export default function ForgotPasswordVerifyScreen({ route, navigation }) {
  const { email } = route.params;
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: verificationCode,
        newPassword: 'TemporaryPassword123!'
      }).catch(error => {
        if (error.name === 'CodeMismatchException' || 
            error.name === 'ExpiredCodeException') {
          throw error;
        }
        
        if (error.name === 'InvalidPasswordException') {
          return true;
        }
        throw error;
      });
      
      navigation.navigate('ResetPassword', { email, code: verificationCode });
    } catch (error) {
      let errorMessage = 'Invalid verification code. Please try again.';
      
      if (error.name === 'ExpiredCodeException') {
        errorMessage = 'Verification code has expired. Please request a new one.';
      } else if (error.name === 'CodeMismatchException') {
        errorMessage = 'Incorrect verification code. Please try again.';
      }
      
      Alert.alert('Verification Failed', errorMessage);
      console.error('Code verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      await initiateForgotPassword(email);
      Alert.alert('Success', 'A new verification code has been sent to your email.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend verification code. Please try again.');
      console.error('Error resending code:', error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CloseButton />
      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.subtitle}>
        A code was sent to your email {email}. Please check your inbox and enter the code below.
      </Text>
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputRefs.current[index] = el!)}
            style={styles.codeInput}
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={(text) => handleCodeChange(text, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
            value={digit}
          />
        ))}
      </View>
      <CustomButton 
        title={isLoading ? "Verifying..." : "Verify Code"} 
        onPress={handleSubmit}
        isLoading={isLoading}
      />
      <TouchableOpacity onPress={handleResendCode} disabled={resendLoading}>
        <Text style={styles.resendText}>
          Didn't receive a code? <Text style={styles.resendLink}>{resendLoading ? "Sending..." : "Resend"}</Text>
        </Text>
      </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  codeInput: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#303030',
    borderWidth: 1,
    borderColor: '#fff',
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  resendText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
  },
  resendLink: {
    color: '#5f33e1',
    fontWeight: 'bold',
  },
}); 