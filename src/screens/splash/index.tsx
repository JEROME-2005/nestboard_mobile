import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { House } from 'lucide-react-native';

import { Colors } from '../../constant/colors';
import Typography from '../../components/ui/Typography';
import { HealthAPI } from '../../api/health';


type Props = {
  onReady?: () => void;
};

const SplashScreen = ({ onReady }: Props) => {
  const [checkingApi, setCheckingApi] = useState(true);
  const [error, setError] = useState(false);

  const checkApi = async () => {
    setCheckingApi(true);
    setError(false);

    try {
      await HealthAPI.checkReady();
      onReady?.();
    } catch {
      setError(true);
    } finally {
      setCheckingApi(false);
    }
  };

  useEffect(() => {
    checkApi();
  }, []);

  return (
    <View style={styles.container}>
      <House size={60} color={Colors.WHITE} />

      <Typography
        variant="h1"
        color={Colors.WHITE}
        style={styles.logo}
      >
        NestBoard
      </Typography>

      {checkingApi && (
        <>
          <ActivityIndicator
            size="large"
            color={Colors.WHITE}
            style={styles.loader}
          />

          <Typography
            variant="body"
            color={Colors.WHITE}
            style={styles.message}
          >
            Connecting to NestBoard...
          </Typography>
        </>
      )}

      {error && (
        <>
          <Typography
            variant="body"
            color={Colors.WHITE}
            style={styles.message}
          >
            Server is starting. Please try again.
          </Typography>

          <TouchableOpacity
             onPress={checkApi}
             style={styles.retryContainer}
          >
            <Typography
              variant="button"
              color={Colors.WHITE}
            >
             Retry
            </Typography>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  logo: {
    marginTop: 16,
  },

  loader: {
    marginTop: 32,
  },

  message: {
    marginTop: 16,
    textAlign: 'center',
  },

  retryContainer: {
    marginTop: 24,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 100,
    backgroundColor: '#00000030',
  },

  retry: {
    textAlign: 'center',
  },
});