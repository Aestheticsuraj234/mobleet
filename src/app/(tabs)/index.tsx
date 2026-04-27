import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Spinner } from 'heroui-native';
import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MobleetGlyph } from '@/components/brand-icons';
import { useSession } from '@/lib/auth-client';

const LIME = '#bdf06e';
const PEACH = '#fdba74';
const MINT = '#a5f3fc';

export default function Home() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Spinner />
      </View>
    );
  }

  const user = session?.user;
  const displayName = user?.name ?? 'Rider';
  const firstName = displayName.split(' ')[0] ?? 'Rider';
  const initials = (user?.name ?? user?.email ?? '?')
    .split(' ')
    .map((part) => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={[
          'rgba(189, 240, 110, 0.18)',
          'rgba(189, 240, 110, 0.02)',
          'rgba(10, 10, 12, 0)',
        ]}
        locations={[0, 0.5, 1]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 360,
        }}
      />

      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                className="w-10 h-10 rounded-2xl items-center justify-center"
                style={{
                  backgroundColor: 'rgba(189, 240, 110, 0.14)',
                  borderWidth: 1,
                  borderColor: 'rgba(189, 240, 110, 0.32)',
                }}
              >
                <MobleetGlyph size={22} color={LIME} />
              </View>
              <Text className="text-foreground text-lg font-bold ml-2.5">
                MobLeet
              </Text>
            </View>
            <Text className="text-muted text-xs">Today</Text>
          </View>

          <View className="mt-6 flex-row items-center">
            <View
              className="w-14 h-14 rounded-full items-center justify-center overflow-hidden"
              style={{
                backgroundColor: 'rgba(189, 240, 110, 0.18)',
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
                  style={{ color: LIME, fontSize: 18 }}
                >
                  {initials}
                </Text>
              )}
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-muted" style={{ fontSize: 12 }}>
                Welcome back
              </Text>
              <Text
                className="text-foreground font-bold"
                style={{ fontSize: 22, lineHeight: 28 }}
                numberOfLines={1}
              >
                {firstName}
              </Text>
            </View>
          </View>

          <View
            className="mt-5 rounded-3xl overflow-hidden"
            style={{
              borderWidth: 1,
              borderColor: 'rgba(189, 240, 110, 0.35)',
            }}
          >
            <LinearGradient
              colors={[
                'rgba(189, 240, 110, 0.20)',
                'rgba(189, 240, 110, 0.04)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 18 }}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text
                    className="text-foreground font-bold"
                    style={{ fontSize: 18, lineHeight: 24 }}
                  >
                    Ready to practice
                  </Text>
                  <Text
                    className="text-muted mt-1"
                    style={{ fontSize: 13, lineHeight: 18 }}
                  >
                    Your session is live. Jump into a problem and keep the
                    streak going.
                  </Text>
                </View>
                <View
                  className="w-12 h-12 rounded-2xl items-center justify-center"
                  style={{ backgroundColor: 'rgba(10, 10, 12, 0.4)' }}
                >
                  <Ionicons
                    name="shield-checkmark"
                    size={22}
                    color={LIME}
                  />
                </View>
              </View>
            </LinearGradient>
          </View>

          <View className="mt-6 flex-row items-center justify-between">
            <Text
              className="text-foreground font-bold"
              style={{ fontSize: 16 }}
            >
              Quick practice
            </Text>
            <Text className="text-muted" style={{ fontSize: 12 }}>
              Tap to start
            </Text>
          </View>

          <View className="mt-3" style={{ gap: 10 }}>
            <ActionCard
              icon="map"
              color={PEACH}
              title="Browse problems"
              subtitle="Pick from the problem set"
              onPress={() => router.push('/problems' as never)}
            />
            <ActionCard
              icon="navigate"
              color={LIME}
              title="Daily challenge"
              subtitle="Start with the first challenge"
              onPress={() => router.push('/problems/1' as never)}
            />
            <ActionCard
              icon="bookmark"
              color={MINT}
              title="Saved problems"
              subtitle="Bookmarks are coming soon"
              onPress={() => router.push('/problems' as never)}
            />
          </View>

          <View className="mt-6">
            <Text
              className="text-foreground font-bold mb-3"
              style={{ fontSize: 16 }}
            >
              This week
            </Text>
            <View className="flex-row" style={{ gap: 10 }}>
              <StatCard label="Solved" value="0" tint={LIME} />
              <StatCard label="Streak" value="0" tint={PEACH} />
              <StatCard label="Saved" value="0" tint={MINT} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ActionCard({
  icon,
  color,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl flex-row items-center p-4"
      style={({ pressed }) => ({
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View
        className="w-11 h-11 rounded-2xl items-center justify-center"
        style={{ backgroundColor: `${color}26` }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View className="flex-1 ml-3">
        <Text
          className="text-foreground font-semibold"
          style={{ fontSize: 15 }}
        >
          {title}
        </Text>
        <Text className="text-muted" style={{ fontSize: 12 }}>
          {subtitle}
        </Text>
      </View>
      <Feather name="chevron-right" size={18} color="#a1a1aa" />
    </Pressable>
  );
}

function StatCard({
  label,
  value,
  tint,
}: {
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <View
      className="flex-1 rounded-2xl p-4"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: tint,
          marginBottom: 8,
        }}
      />
      <Text
        className="text-foreground font-bold"
        style={{ fontSize: 18, lineHeight: 22 }}
      >
        {value}
      </Text>
      <Text className="text-muted mt-0.5" style={{ fontSize: 11 }}>
        {label}
      </Text>
    </View>
  );
}
