import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { confirmSignUp, resendVerificationCode } from '../services/auth';
import CustomButton from '../components/CustomButton';
import showCustomAlert from '../components/CustomAlert';
import CloseButton from '../components/CloseButton';

export default function VerifyEmailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        if (countdown === 1) {
          setResendDisabled(false);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

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

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await resendVerificationCode(email);
      setCountdown(60);
      setResendDisabled(true);
      showCustomAlert({ title: 'Success', message: 'Verification code resent.', type: 'success' });
    } catch (error) {
      showCustomAlert({ title: 'Error', message: 'Failed to resend code. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await confirmSignUp(email, code.join(''));
      showCustomAlert({ title: 'Success', message: 'Email verified successfully.', type: 'success' });
      navigation.navigate('Login');
    } catch (error) {
      showCustomAlert({ title: 'Error', message: 'Verification failed. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CloseButton />
      <Text style={styles.title}>Enter Your <Text style={styles.highlight}>Code</Text></Text>
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
      <CustomButton title="Verify Account" onPress={handleSubmit} isLoading={isLoading} />
      <TouchableOpacity onPress={handleResendCode} disabled={resendDisabled}>
        <Text style={styles.resendText}>
          Didn't receive a code? <Text style={styles.resendLink}>Resend</Text>
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
  highlight: {
    color: '#5f33e1',
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