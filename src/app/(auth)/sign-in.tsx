import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Button, Spinner } from 'heroui-native';
import React, { useState } from 'react';
import { Alert, Linking, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GitHubIcon, MobleetGlyph } from '@/components/brand-icons';
import { authClient } from '@/lib/auth-client';

type Provider = 'github';

const LIME = '#bdf06e';
const PEACH = '#fdba74';
const LIGHT = '#fafafa';

export default function SignIn() {
  const [loading, setLoading] = useState<Provider | null>(null);

  const handleSocial = async (provider: Provider) => {
    if (loading) return;
    setLoading(provider);
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: '/',
      });
      if (error) {
        Alert.alert(
          'Sign in failed',
          error.message ?? `Could not sign in with ${provider}.`
        );
        return;
      }
      router.replace('/' as never);
    } catch (err) {
      Alert.alert(
        'Sign in failed',
        err instanceof Error ? err.message : 'Unknown error'
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={[
          'rgba(189, 240, 110, 0.22)',
          'rgba(189, 240, 110, 0.04)',
          'rgba(10, 10, 12, 0)',
        ]}
        locations={[0, 0.45, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 420,
        }}
      />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: 16,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-row items-center justify-between">
            <View
              className="w-11 h-11 rounded-2xl items-center justify-center"
              style={{
                backgroundColor: 'rgba(189, 240, 110, 0.14)',
                borderWidth: 1,
                borderColor: 'rgba(189, 240, 110, 0.32)',
              }}
            >
              <MobleetGlyph size={26} color={LIME} />
            </View>
            <Text
              className="text-muted text-xs"
              style={{ letterSpacing: 1.4 }}
            >
              v1.0
            </Text>
          </View>

          <View className="mt-10">
            <View
              className="self-start px-3 py-1 rounded-full mb-4 flex-row items-center"
              style={{
                backgroundColor: 'rgba(189, 240, 110, 0.12)',
                borderWidth: 1,
                borderColor: 'rgba(189, 240, 110, 0.28)',
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: LIME,
                  marginRight: 8,
                }}
              />
              <Text
                className="text-xs font-semibold"
                style={{ color: LIME }}
              >
                Solve smarter
              </Text>
            </View>

            <Text
              className="text-foreground font-bold"
              style={{
                fontSize: 36,
                lineHeight: 42,
              }}
            >
              Welcome to
            </Text>
            <Text
              className="font-bold"
              style={{
                color: LIME,
                fontSize: 36,
                lineHeight: 42,
              }}
            >
              MobLeet.
            </Text>

            <Text
              className="text-muted mt-3"
              style={{ fontSize: 15, lineHeight: 22 }}
            >
              Practice anywhere - track your{' '}
              <Text style={{ color: PEACH }}>streak</Text>, revisit solutions,
              and stay consistent.
            </Text>
          </View>

          <View className="mt-8 gap-2.5">
            <FeatureRow
              icon="zap"
              color={LIME}
              title="Daily practice"
              subtitle="Quick problems that fit your day"
            />
            <FeatureRow
              icon="map-pin"
              color={PEACH}
              title="Track progress"
              subtitle="Streaks, topics, and solved history"
            />
            <FeatureRow
              icon="shield"
              color="#a5f3fc"
              title="Private & secure"
              subtitle="Better Auth · end-to-end sessions"
            />
          </View>

          <View className="mt-8 gap-3">
            <Button
              variant="primary"
              size="lg"
              isDisabled={loading !== null}
              onPress={() => handleSocial('github')}
              className="rounded-2xl"
            >
              {loading === 'github' ? (
                <Spinner color={LIGHT} />
              ) : (
                <>
                  <GitHubIcon size={18} color={LIGHT} />
                  <Button.Label
                    className="font-semibold"
                    style={{ color: LIGHT }}
                  >
                    Continue with GitHub
                  </Button.Label>
                </>
              )}
            </Button>
          </View>

          <Text
            className="text-muted text-center mt-6"
            style={{ fontSize: 12, lineHeight: 18 }}
          >
            By continuing you agree to MobLeet&apos;s{' '}
            <Text
              style={{ color: PEACH, textDecorationLine: 'underline' }}
              onPress={() => Linking.openURL('https://example.com/terms')}
            >
              Terms
            </Text>{' '}
            and{' '}
            <Text
              style={{ color: PEACH, textDecorationLine: 'underline' }}
              onPress={() => Linking.openURL('https://example.com/privacy')}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function FeatureRow({
  icon,
  color,
  title,
  subtitle,
}: {
  icon: keyof typeof Feather.glyphMap;
  color: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View
      className="flex-row items-center rounded-2xl p-3.5"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
      }}
    >
      <View
        className="w-10 h-10 rounded-xl items-center justify-center"
        style={{ backgroundColor: `${color}24` }}
      >
        <Feather name={icon} size={18} color={color} />
      </View>
      <View className="flex-1 ml-3">
        <Text
          className="text-foreground font-semibold"
          style={{ fontSize: 14 }}
        >
          {title}
        </Text>
        <Text className="text-muted" style={{ fontSize: 12 }}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
}
