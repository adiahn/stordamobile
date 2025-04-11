import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Modal from './Modal';

interface User {
  name: string;
  email: string;
  profileImage?: string;
  phone?: string;
}

interface UserConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  user: User;
  onConfirm: () => void;
  onCancel: () => void;
}

// Memoized user profile component to prevent unnecessary re-renders
const UserProfile = memo(({ user }: { user: User }) => (
  <View style={styles.userContainer}>
    <View style={styles.profileContainer}>
      {user.profileImage ? (
        <Image 
          source={{ uri: user.profileImage }} 
          style={styles.profileImage}
          // Add cache config for better image loading performance
          loadingIndicatorSource={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' }}
        />
      ) : (
        <View style={styles.profilePlaceholder}>
          <Text style={styles.profileInitial}>{user.name.charAt(0).toUpperCase()}</Text>
        </View>
      )}
    </View>
    
    <View style={styles.userInfo}>
      <Text style={styles.userName}>{user.name}</Text>
      <Text style={styles.userEmail}>{user.email}</Text>
      {user.phone && <Text style={styles.userPhone}>{user.phone}</Text>}
    </View>
  </View>
));

UserProfile.displayName = 'UserProfile';

const UserConfirmationModal: React.FC<UserConfirmationModalProps> = memo(({
  visible,
  onClose,
  user,
  onConfirm,
  onCancel
}) => {
  // Memoize handlers to avoid creating new functions on each render
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);
  
  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);
  
  // Short-circuit if modal isn't visible to prevent rendering when hidden
  if (!visible) return null;
  
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Confirm Recipient"
      message="Please verify that you want to transfer your device to this user."
      type="info"
      primaryButtonText="Confirm"
      secondaryButtonText="Cancel"
      onPrimaryButtonPress={handleConfirm}
      onSecondaryButtonPress={handleCancel}
    >
      <UserProfile user={user} />
      
      <View style={styles.warningContainer}>
        <Text style={styles.warningText}>
          After confirming, this user will receive a notification to accept the device transfer.
        </Text>
      </View>
    </Modal>
  );
});

UserConfirmationModal.displayName = 'UserConfirmationModal';

// Optimize styles by moving them outside the component
const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  profileContainer: {
    marginRight: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profilePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#5A71E4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 2,
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  userPhone: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  warningContainer: {
    width: '100%',
    marginBottom: 16,
  },
  warningText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  }
});

export default UserConfirmationModal; 