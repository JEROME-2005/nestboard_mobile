import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  launchImageLibrary,
} from 'react-native-image-picker';

import {
  CalendarDays,
  Camera,
  Check,
  User,
} from 'lucide-react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import Typography
  from '../../../components/ui/Typography';

import {
  Colors,
} from '../../../constant/colors';

import {
  ProfileAPI,
} from '../../../api/profile';

import type {
  UserProfile,
} from '../../../types/profile';

const Profile = () => {
  const navigation: any =
    useNavigation();

  const [
    profile,
    setProfile,
  ] = useState<UserProfile | null>(
    null,
  );

  const [
    displayName,
    setDisplayName,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const data =
        await ProfileAPI.getMe();

      setProfile(data);

      setDisplayName(
        data.displayName,
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        'Unable to load your profile.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSelectImage = async () => {
    const result =
      await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
      });

    if (result.didCancel) {
      return;
    }

    const asset =
      result.assets?.[0];

    if (!asset?.uri) {
      return;
    }

    try {
      setUploadingImage(true);

      const uploadResult =
        await ProfileAPI.uploadProfileImage(
          asset.uri,
          asset.type ??
            'image/jpeg',
          asset.fileName ??
            `profile-${Date.now()}.jpg`,
        );

      const updated =
        await ProfileAPI.updateMe({
          avatarUrl:
            uploadResult.url,
        });

      setProfile(updated);

      Alert.alert(
        'Success',
        'Profile image updated.',
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ??
        error?.response?.data?.message ??
        'Unable to upload profile image.';

      Alert.alert(
        'Upload failed',
        message,
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    const trimmedName =
      displayName.trim();

    if (trimmedName.length < 2) {
      Alert.alert(
        'Invalid name',
        'Display name must contain at least 2 characters.',
      );

      return;
    }

    try {
      setSaving(true);

      const updated =
        await ProfileAPI.updateMe({
          displayName:
            trimmedName,
        });

      setProfile(updated);

      setDisplayName(
        updated.displayName,
      );

      Alert.alert(
        'Success',
        'Profile updated successfully.',
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ??
        error?.response?.data?.message ??
        'Unable to update your profile.';

      Alert.alert(
        'Update failed',
        message,
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={
            Colors.PRIMARY_COLOR
          }
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
    >
      <Typography variant="h1">
        Profile
      </Typography>

      <View style={styles.profileCard}>
        <TouchableOpacity
          style={styles.avatarWrapper}
          onPress={
            handleSelectImage
          }
          disabled={
            uploadingImage
          }
        >
          {profile?.avatarUrl ? (
            <Image
              source={{
                uri:
                  profile.avatarUrl,
              }}
              style={styles.avatar}
            />
          ) : (
            <View
              style={
                styles.avatarPlaceholder
              }
            >
              <User
                size={52}
                color={
                  Colors.SECONDARY_COLOR
                }
              />
            </View>
          )}

          <View
            style={styles.cameraButton}
          >
            {uploadingImage ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <Camera
                size={18}
                color="#FFFFFF"
              />
            )}
          </View>
        </TouchableOpacity>

        <Typography
          variant="h2"
          style={styles.profileName}
        >
          {profile?.displayName}
        </Typography>

        <Typography
          variant="caption"
          style={styles.email}
        >
          {profile?.email}
        </Typography>
      </View>

      <View style={styles.form}>
        <Typography
          variant="h3"
          style={styles.sectionTitle}
        >
          Edit Profile
        </Typography>

        <Typography
          variant="caption"
          style={styles.label}
        >
          Display Name
        </Typography>

        <TextInput
          value={displayName}
          onChangeText={
            setDisplayName
          }
          placeholder="Enter your display name"
          style={styles.input}
          maxLength={100}
        />

        <TouchableOpacity
          style={[
            styles.saveButton,
            saving &&
              styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <>
              <Check
                size={20}
                color="#FFFFFF"
              />

              <Typography
                variant="h3"
                style={
                  styles.saveButtonText
                }
              >
                Save Changes
              </Typography>
            </>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() =>
          navigation.navigate(
            'MyBookings',
          )
        }
      >
        <CalendarDays
          size={22}
          color={
            Colors.SECONDARY_COLOR
          }
        />

        <Typography variant="h3">
          My Bookings
        </Typography>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() =>
          navigation.navigate(
            'Notifications',
          )
        }
      >
        <Typography variant="h3">
          Notifications
        </Typography>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.WHITE,
  },

  content: {
    padding: 20,
    gap: 24,
    paddingBottom: 120,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileCard: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },

  avatarWrapper: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },

  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      Colors.PRIMARY_COLOR,
  },

  profileName: {
    textAlign: 'center',
  },

  email: {
    color: '#6B7280',
  },

  form: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    gap: 10,
  },

  sectionTitle: {
    marginBottom: 6,
  },

  label: {
    color: '#6B7280',
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },

  saveButton: {
    height: 52,
    marginTop: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor:
      Colors.PRIMARY_COLOR,
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: '#FFFFFF',
  },

  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    borderRadius: 16,
    backgroundColor:
      Colors.WHITE,
    elevation: 2,
  },
});