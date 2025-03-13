import React, { useState, useEffect } from 'react';
import { View, Animated, ActivityIndicator, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function PreHomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const fromLogin = route.params?.fromLogin;
  
  const [animationComplete, setAnimationComplete] = useState(fromLogin);
  const fadeAnim = new Animated.Value(fromLogin ? 1 : 0);
  const scaleAnim = new Animated.Value(fromLogin ? 1 : 0.6);
  const logoPosition = new Animated.Value(0);
  const buttonsOpacity = new Animated.Value(0);

  useEffect(() => {
    if (!fromLogin) {
      // Initial logo fade in and scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ]).start(() => {
        Animated.parallel([
          Animated.timing(logoPosition, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(buttonsOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          })
        ]).start(() => {
          setAnimationComplete(true);
        });
      });
    } else {
      logoPosition.setValue(1);
      buttonsOpacity.setValue(1);
    }
  }, []);

  const logoTranslateY = logoPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -height * 0.1]
  });

  return (
    <View style={styles.container}>
      <Animated.Image 
        source={require('../../assets/the-playbook-logo.png')} 
        style={[
          styles.logo, 
          { 
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: logoTranslateY }
            ] 
          }
        ]} 
      />
      
      {!animationComplete && (
        <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
      )}
      
      <Animated.View 
        style={[
          styles.buttonContainer,
          {
            opacity: buttonsOpacity,
            transform: [{
              translateY: buttonsOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })
            }]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5f33e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
    resizeMode: 'contain',
  },
  loader: {
    marginTop: 50,
    position: 'absolute',
    bottom: height * 0.3,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: height * 0.15,
    width: '80%',
  },
  button: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#000000',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});