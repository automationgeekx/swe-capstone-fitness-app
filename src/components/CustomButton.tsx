import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  style?: object;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, isLoading, disabled, style }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.buttonDisabled, style]} 
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#5f33e1',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#404040',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;