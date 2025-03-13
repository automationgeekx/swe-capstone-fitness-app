import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation();

  React.useEffect(() => {
    if (!isAuthenticated) {
      // @ts-ignore - type mismatch with navigation
      navigation.reset({
        index: 0,
        routes: [{ name: 'PreHome' }],
      });
    }
  }, [isAuthenticated]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case 'Home':
              return <Ionicons name="home" size={size} color={color} />;
            case 'Bets':
              return <MaterialCommunityIcons name="ticket-outline" size={size} color={color} />;
            case 'AI Bet':
              return <MaterialCommunityIcons name="robot" size={size} color={color} />;
            case 'Your Picks':
              return <Ionicons name="list" size={size} color={color} />;
            case 'All Sports':
              return <Ionicons name="search" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#5f33e1',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#333',
          paddingBottom: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#fff',
        headerRight: () => (
          route.name === 'Home' ? (
            <Ionicons 
              name="person-circle-outline" 
              size={24} 
              color="#fff" 
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate('Settings')}
            />
          ) : null
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bets" component={HomeScreen} />
      <Tab.Screen name="AI Bet" component={HomeScreen} />
      <Tab.Screen name="Your Picks" component={HomeScreen} />
      <Tab.Screen name="All Sports" component={HomeScreen} />
    </Tab.Navigator>
  );
}