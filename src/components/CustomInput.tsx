import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface CustomInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: string;
  style?: object;
}

const CustomInput: React.FC<CustomInputProps> = ({ value, onChangeText, placeholder, secureTextEntry, keyboardType, style }) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#303030',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#404040',
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    color: '#fff',
    alignSelf: 'center',
  },
});

export default CustomInput;
