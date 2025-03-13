import React, { useEffect } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface AnimationWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  animationValue: Animated.Value;
  duration?: number;
}

const AnimationWrapper: React.FC<AnimationWrapperProps> = ({ children, style, animationValue, duration = 1000 }) => {
  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  }, [animationValue, duration]);

  return (
    <Animated.View style={[style, { opacity: animationValue }]}>
      {children}
    </Animated.View>
  );
};

export default AnimationWrapper; 