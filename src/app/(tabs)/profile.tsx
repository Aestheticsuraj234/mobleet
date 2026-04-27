import { Feather } from '@expo/vector-icons';
import { Button, Spinner } from 'heroui-native';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { isAdminUser } from '@/lib/admin';
import { authClient, useSession } from '@/lib/auth-client';

const LIME = '#bdf06e';

export default function Profile() {
  const { data: session, isPending } = useSession();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await authClient.signOut();
    } catch (err) {
      Alert.alert(
        'Sign out failed',
        err instanceof Error ? err.message : 'Unknown error'
      );
    } finally {
      setSigningOut(false);
    }
  };

  if (isPending) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Spinner />
      </View>
    );
  }

  const user = session?.user;
  const initials = (user?.name ?? user?.email ?? '?')
    .split(' ')
    .map((part) => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            className="text-foreground font-bold"
            style={{ fontSize: 30, lineHeight: 36 }}
          >
            Profile
          </Text>
          <Text className="text-muted mt-2" style={{ fontSize: 14 }}>
            Manage your MobLeet account.
          </Text>

          <View
            className="mt-6 rounded-3xl p-5 items-center"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.07)',
            }}
          >
            <View
              className="w-20 h-20 rounded-full items-center justify-center overflow-hidden"
              style={{
                backgroundColor: 'rgba(189, 240, 110, 0.16)',
                borderWidth: 2,
                borderColor: LIME,
              }}
            >
              {user?.image ? (
                <Image
                  source={{ uri: user.image }}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <Text
                  className="font-bold"
                  style={{ color: LIME, fontSize: 24 }}
                >
                  {initials}
                </Text>
              )}
            </View>
            <Text
              className="text-foreground font-bold mt-4"
              style={{ fontSize: 20 }}
            >
              {user?.name ?? 'MobLeet User'}
            </Text>
            <Text className="text-muted mt-1" style={{ fontSize: 13 }}>
              {user?.email ?? 'No email'}
            </Text>
            {isAdminUser(user) ? (
              <View
                className="mt-3 rounded-full px-3 py-1 flex-row items-center"
                style={{ backgroundColor: 'rgba(189, 240, 110, 0.12)' }}
              >
                <Feather name="shield" size={12} color={LIME} />
                <Text
                  className="font-semibold ml-1.5"
                  style={{ color: LIME, fontSize: 12 }}
                >
                  Admin
                </Text>
              </View>
            ) : null}
          </View>

          <View className="mt-6">
            <Button
              variant="tertiary"
              size="lg"
              onPress={handleSignOut}
              isDisabled={signingOut}
              className="rounded-2xl"
            >
              {signingOut ? (
                <Spinner />
              ) : (
                <>
                  <Feather name="log-out" size={16} color="#ef4444" />
                  <Button.Label className="font-semibold text-red-500">
                    Sign out
                  </Button.Label>
                </>
              )}
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
