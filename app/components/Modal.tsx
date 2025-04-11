import React, { useMemo, memo, useCallback, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal as RNModal, 
  Pressable, 
  TouchableWithoutFeedback,
  Dimensions,
  BackHandler,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'error' | 'success' | 'warning' | 'info';
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryButtonPress?: () => void;
  onSecondaryButtonPress?: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = memo(({
  visible,
  onClose,
  title,
  message,
  type = 'info',
  primaryButtonText = 'OK',
  secondaryButtonText,
  onPrimaryButtonPress,
  onSecondaryButtonPress,
  children
}) => {
  // State to handle visibility with animation timing
  const [internalVisible, setInternalVisible] = useState(visible);
  
  // Update internal visibility when external changes
  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
    }
  }, [visible]);

  // Handle hardware back button on Android
  useEffect(() => {
    if (!visible || Platform.OS !== 'android') return;
    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true; // Prevent default back button behavior
    });
    
    return () => backHandler.remove();
  }, [visible, onClose]);
  
  // Memoize typeStyles to prevent recalculation on every render
  const typeStyles = useMemo(() => {
    switch (type) {
      case 'error':
        return {
          icon: 'alert-circle',
          color: '#E45A5A',
          bgColor: 'rgba(228, 90, 90, 0.1)'
        };
      case 'success':
        return {
          icon: 'check-circle',
          color: '#30B050',
          bgColor: 'rgba(48, 176, 80, 0.1)'
        };
      case 'warning':
        return {
          icon: 'alert-triangle',
          color: '#FFA500',
          bgColor: 'rgba(255, 165, 0, 0.1)'
        };
      case 'info':
      default:
        return {
          icon: 'info',
          color: '#5A71E4',
          bgColor: 'rgba(90, 113, 228, 0.1)'
        };
    }
  }, [type]);

  // Memoize handlers to avoid creating new functions on each render
  const handlePrimaryButtonPress = useCallback(() => {
    if (onPrimaryButtonPress) {
      onPrimaryButtonPress();
    } else {
      onClose();
    }
  }, [onPrimaryButtonPress, onClose]);
  
  const handleSecondaryButtonPress = useCallback(() => {
    if (onSecondaryButtonPress) {
      onSecondaryButtonPress();
    } else {
      onClose();
    }
  }, [onSecondaryButtonPress, onClose]);
  
  // Handle animation exit
  const handleClose = useCallback(() => {
    // If we're not visible, don't do anything
    if (!visible) return;
    
    // Allow time for exit animation
    setInternalVisible(false);
    
    // Delay actual close to allow animation to complete
    const timer = setTimeout(() => {
      onClose();
    }, 200); // Match FadeOut duration
    
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  // Don't render anything if not visible to save performance
  if (!internalVisible && !visible) return null;

  return (
    <RNModal
      visible={internalVisible}
      transparent
      animationType="none" // We'll handle animation with Reanimated
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View 
          style={styles.overlay}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200).withCallback((finished) => {
            // When exit animation finishes, update internal state
            if (finished) {
              setInternalVisible(false);
            }
          })}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={[styles.iconContainer, { backgroundColor: typeStyles.bgColor }]}>
                <Feather name={typeStyles.icon as any} size={28} color={typeStyles.color} />
              </View>
              
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
              
              {children}
              
              <View style={styles.buttonContainer}>
                {secondaryButtonText && (
                  <Pressable 
                    style={[styles.button, styles.secondaryButton]}
                    onPress={handleSecondaryButtonPress}
                    accessibilityRole="button"
                    accessibilityLabel={secondaryButtonText}
                  >
                    <Text style={styles.secondaryButtonText}>{secondaryButtonText}</Text>
                  </Pressable>
                )}
                
                <Pressable 
                  style={[
                    styles.button, 
                    styles.primaryButton,
                    { backgroundColor: typeStyles.color }
                  ]}
                  onPress={handlePrimaryButtonPress}
                  accessibilityRole="button"
                  accessibilityLabel={primaryButtonText}
                >
                  <Text style={styles.primaryButtonText}>{primaryButtonText}</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
});

// Optimize styles by moving them outside the component
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#222D3A',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#5A71E4',
  },
  primaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
  },
  secondaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#6B7280',
  },
});

Modal.displayName = 'Modal';

export default Modal; 