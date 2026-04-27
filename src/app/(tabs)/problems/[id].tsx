import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LIME = '#bdf06e';

export default function ProblemDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

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
          <Pressable
            onPress={() => router.back()}
            className="self-start flex-row items-center rounded-full px-3 py-2"
            style={({ pressed }) => ({
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Feather name="chevron-left" size={16} color="#fafafa" />
            <Text className="text-foreground font-semibold ml-1">Back</Text>
          </Pressable>

          <View className="mt-6">
            <Text className="text-muted" style={{ fontSize: 12 }}>
              Problem #{id}
            </Text>
            <Text
              className="text-foreground font-bold mt-1"
              style={{ fontSize: 30, lineHeight: 36 }}
            >
              Practice Problem
            </Text>
            <Text
              className="text-muted mt-3"
              style={{ fontSize: 14, lineHeight: 22 }}
            >
              This page is wired as a nested problem detail route. Connect it to
              your problem data source when the API is ready.
            </Text>
          </View>

          <View
            className="mt-6 rounded-3xl p-4"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.07)',
            }}
          >
            <Text
              className="text-foreground font-semibold"
              style={{ fontSize: 16 }}
            >
              Prompt
            </Text>
            <Text
              className="text-muted mt-2"
              style={{ fontSize: 14, lineHeight: 22 }}
            >
              Given an input, write an efficient solution and explain the time
              and space complexity.
            </Text>
          </View>

          <Pressable
            className="mt-6 rounded-2xl items-center justify-center py-4"
            style={({ pressed }) => ({
              backgroundColor: LIME,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text className="font-bold" style={{ color: '#0a0a0c' }}>
              Start Solving
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
