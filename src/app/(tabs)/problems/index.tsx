import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  difficultyTint,
  type Difficulty,
  PROBLEMS,
  type Problem,
} from '@/lib/problems';

const LIME = '#bdf06e';

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export default function Problems() {
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeDifficulties, setActiveDifficulties] = useState<Set<Difficulty>>(
    new Set()
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return PROBLEMS.filter((problem) => {
      if (
        activeDifficulties.size > 0 &&
        !activeDifficulties.has(problem.difficulty)
      ) {
        return false;
      }
      if (!query) return true;
      return (
        problem.title.toLowerCase().includes(query) ||
        problem.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [search, activeDifficulties]);

  const toggleDifficulty = (difficulty: Difficulty) => {
    setActiveDifficulties((prev) => {
      const next = new Set(prev);
      if (next.has(difficulty)) {
        next.delete(difficulty);
      } else {
        next.add(difficulty);
      }
      return next;
    });
  };

  const clearFilters = () => setActiveDifficulties(new Set());

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={[
          'rgba(189, 240, 110, 0.14)',
          'rgba(189, 240, 110, 0.02)',
          'rgba(10, 10, 12, 0)',
        ]}
        locations={[0, 0.55, 1]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 280,
        }}
      />

      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center justify-between">
            <Text
              className="text-foreground font-bold"
              style={{ fontSize: 28, lineHeight: 34 }}
            >
              Coding Problems
            </Text>
            <View
              className="px-3 py-1 rounded-full"
              style={{
                backgroundColor: 'rgba(189, 240, 110, 0.12)',
                borderWidth: 1,
                borderColor: 'rgba(189, 240, 110, 0.28)',
              }}
            >
              <Text
                className="font-semibold"
                style={{ color: LIME, fontSize: 11 }}
              >
                {PROBLEMS.length} total
              </Text>
            </View>
          </View>

          <View
            className="mt-5 flex-row items-center rounded-2xl px-4"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.07)',
              height: 48,
            }}
          >
            <Feather name="search" size={16} color="#71717a" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search problems..."
              placeholderTextColor="#71717a"
              className="flex-1 ml-3 text-foreground"
              style={{ fontSize: 14 }}
              returnKeyType="search"
            />
            {search.length > 0 ? (
              <Pressable onPress={() => setSearch('')} hitSlop={8}>
                <Feather name="x" size={14} color="#71717a" />
              </Pressable>
            ) : null}
          </View>

          <Pressable
            onPress={() => setFiltersOpen(true)}
            className="mt-3 rounded-2xl flex-row items-center justify-center"
            style={({ pressed }) => ({
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.07)',
              height: 44,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Ionicons name="filter-outline" size={16} color="#fafafa" />
            <Text className="text-foreground font-semibold ml-2">
              Filters
            </Text>
            {activeDifficulties.size > 0 ? (
              <View
                className="ml-2 px-2 rounded-full"
                style={{
                  backgroundColor: LIME,
                  height: 18,
                  justifyContent: 'center',
                }}
              >
                <Text
                  className="font-bold"
                  style={{ color: '#0a0a0c', fontSize: 11 }}
                >
                  {activeDifficulties.size}
                </Text>
              </View>
            ) : null}
          </Pressable>

          <View className="mt-5" style={{ gap: 12 }}>
            {filtered.length === 0 ? (
              <View
                className="rounded-3xl p-8 items-center"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.06)',
                }}
              >
                <Feather name="inbox" size={28} color="#71717a" />
                <Text
                  className="text-foreground font-semibold mt-3"
                  style={{ fontSize: 15 }}
                >
                  No problems match
                </Text>
                <Text
                  className="text-muted text-center mt-1"
                  style={{ fontSize: 13 }}
                >
                  Try a different keyword or clear the filters.
                </Text>
              </View>
            ) : (
              filtered.map((problem) => (
                <ProblemCard key={problem.id} problem={problem} />
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={filtersOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setFiltersOpen(false)}
      >
        <Pressable
          className="flex-1 justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onPress={() => setFiltersOpen(false)}
        >
          <Pressable
            onPress={() => {
              /* swallow press */
            }}
            className="rounded-t-3xl px-5 pt-5"
            style={{
              backgroundColor: '#13141a',
              borderTopWidth: 1,
              borderColor: 'rgba(255,255,255,0.07)',
              paddingBottom: 32,
            }}
          >
            <View
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.18)',
                alignSelf: 'center',
                marginBottom: 16,
              }}
            />
            <View className="flex-row items-center justify-between">
              <Text
                className="text-foreground font-bold"
                style={{ fontSize: 18 }}
              >
                Filters
              </Text>
              <Pressable onPress={clearFilters} hitSlop={8}>
                <Text className="font-semibold" style={{ color: LIME }}>
                  Clear
                </Text>
              </Pressable>
            </View>

            <Text
              className="text-muted mt-4 mb-3"
              style={{ fontSize: 12, letterSpacing: 1 }}
            >
              DIFFICULTY
            </Text>
            <View className="flex-row" style={{ gap: 10 }}>
              {DIFFICULTIES.map((difficulty) => {
                const tint = difficultyTint(difficulty);
                const active = activeDifficulties.has(difficulty);
                return (
                  <Pressable
                    key={difficulty}
                    onPress={() => toggleDifficulty(difficulty)}
                    className="flex-1 rounded-2xl py-3 items-center"
                    style={({ pressed }) => ({
                      backgroundColor: active
                        ? tint.bg
                        : 'rgba(255,255,255,0.04)',
                      borderWidth: 1,
                      borderColor: active
                        ? tint.fg
                        : 'rgba(255,255,255,0.07)',
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <Text
                      className="font-bold"
                      style={{
                        color: active ? tint.fg : '#fafafa',
                        fontSize: 13,
                      }}
                    >
                      {difficulty}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              onPress={() => setFiltersOpen(false)}
              className="mt-6 rounded-2xl items-center justify-center py-4"
              style={({ pressed }) => ({
                backgroundColor: LIME,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text className="font-bold" style={{ color: '#0a0a0c' }}>
                Apply
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function ProblemCard({ problem }: { problem: Problem }) {
  const tint = difficultyTint(problem.difficulty);

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
      <Text
        className="text-foreground font-bold"
        style={{ fontSize: 16, lineHeight: 22 }}
      >
        {problem.title}
      </Text>

      <View className="mt-2 flex-row items-center" style={{ gap: 8 }}>
        <View
          className="px-2.5 py-1 rounded-md"
          style={{ backgroundColor: tint.bg }}
        >
          <Text
            className="font-bold"
            style={{
              color: tint.fg,
              fontSize: 10,
              letterSpacing: 1,
            }}
          >
            {problem.difficulty.toUpperCase()}
          </Text>
        </View>
      </View>

      <View className="mt-3 flex-row items-center">
        <Feather name="check-circle" size={13} color="#a1a1aa" />
        <Text className="text-muted ml-2" style={{ fontSize: 12 }}>
          {problem.acceptance.toFixed(1)}% acceptance
        </Text>
      </View>
    </Pressable>
  );
}
