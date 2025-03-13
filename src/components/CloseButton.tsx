import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface CloseButtonProps {
  onPress?: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onPress }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('PreHome');
    }
  };

  return (
    <TouchableOpacity style={styles.closeButton} onPress={handlePress}>
      <Ionicons name="close" size={24} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#303030',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});

export default CloseButton; 