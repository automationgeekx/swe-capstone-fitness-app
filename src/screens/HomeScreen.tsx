import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'PreHome' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#000' 
  },
  text: { 
    fontSize: 20,
    color: '#fff',
    marginBottom: 20
  },
  logoutButton: {
    backgroundColor: '#5f33e1',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
