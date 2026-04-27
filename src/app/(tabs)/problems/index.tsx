import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LIME = '#bdf06e';

const PROBLEMS = [
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
  },
  {
    id: '2',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    tags: ['Stack', 'String'],
  },
  {
    id: '3',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    tags: ['String', 'Sliding Window'],
  },
];

export default function Problems() {
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
            Problems
          </Text>
          <Text className="text-muted mt-2" style={{ fontSize: 14 }}>
            Choose a challenge and open its detail page.
          </Text>

          <View className="mt-6" style={{ gap: 12 }}>
            {PROBLEMS.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ProblemCard({
  problem,
}: {
  problem: (typeof PROBLEMS)[number];
}) {
  return (
    <Pressable
      onPress={() => router.push(`/problems/${problem.id}` as never)}
      className="rounded-3xl p-4"
      style={({ pressed }) => ({
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.07)',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text
            className="text-foreground font-semibold"
            style={{ fontSize: 16, lineHeight: 22 }}
          >
            {problem.title}
          </Text>
          <Text className="text-muted mt-1" style={{ fontSize: 12 }}>
            {problem.tags.join(' · ')}
          </Text>
        </View>
        <View
          className="px-2.5 py-1 rounded-full"
          style={{ backgroundColor: 'rgba(189, 240, 110, 0.12)' }}
        >
          <Text className="font-semibold" style={{ color: LIME, fontSize: 11 }}>
            {problem.difficulty}
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-row items-center">
        <Text className="font-semibold" style={{ color: LIME, fontSize: 13 }}>
          Open problem
        </Text>
        <Feather name="chevron-right" size={16} color={LIME} />
      </View>
    </Pressable>
  );
}
