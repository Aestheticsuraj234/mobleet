import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  difficultyTint,
  getProblemById,
  type Problem,
} from '@/lib/problems';

const LIME = '#bdf06e';
const PEACH = '#fdba74';

type Tab = 'description' | 'solutions' | 'submissions';

const TABS: { id: Tab; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { id: 'description', label: 'Description', icon: 'file-text' },
  { id: 'solutions', label: 'Solutions', icon: 'lock' },
  { id: 'submissions', label: 'Submissions', icon: 'code' },
];

export default function ProblemDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const problem = getProblemById(id);
  const [activeTab, setActiveTab] = useState<Tab>('description');

  if (!problem) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Feather name="alert-circle" size={32} color="#71717a" />
        <Text
          className="text-foreground font-bold mt-4"
          style={{ fontSize: 18 }}
        >
          Problem not found
        </Text>
        <Text className="text-muted mt-2 text-center" style={{ fontSize: 13 }}>
          The problem with id &quot;{id}&quot; doesn&apos;t exist in our list yet.
        </Text>
        <Pressable
          onPress={() => router.replace('/problems' as never)}
          className="mt-6 rounded-2xl px-5 py-3"
          style={{ backgroundColor: LIME }}
        >
          <Text className="font-bold" style={{ color: '#0a0a0c' }}>
            Back to problems
          </Text>
        </Pressable>
      </View>
    );
  }

  const tint = difficultyTint(problem.difficulty);

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={[
          'rgba(189, 240, 110, 0.10)',
          'rgba(189, 240, 110, 0.02)',
          'rgba(10, 10, 12, 0)',
        ]}
        locations={[0, 0.55, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 220,
        }}
      />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/**
         * Single ScrollView (only child of SafeAreaView) so flex does not
         * collapse the scroll region on Android; same pattern as problems/index.
         */}
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 32,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center" style={{ height: 48, marginBottom: 4 }}>
            <Pressable
              onPress={() => router.back()}
              hitSlop={8}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={({ pressed }) => ({
                backgroundColor: 'rgba(255,255,255,0.04)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.07)',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Feather name="arrow-left" size={18} color="#fafafa" />
            </Pressable>
            <Text
              className="text-foreground font-bold ml-3"
              style={{ fontSize: 18 }}
            >
              Problem Details
            </Text>
          </View>
          <View className="flex-row items-start justify-between">
            <Text
              className="text-foreground font-bold flex-1 pr-3"
              style={{ fontSize: 22, lineHeight: 28 }}
            >
              {problem.title}
            </Text>
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

          <View className="flex-row items-center justify-between mt-3">
            <View className="flex-row items-center">
              <Feather name="check-circle" size={13} color={LIME} />
              <Text
                className="text-muted ml-2"
                style={{ fontSize: 12 }}
              >
                {problem.acceptance.toFixed(1)}% accepted
              </Text>
            </View>

            <Pressable
              onPress={() =>
                Alert.alert(
                  'Report bug',
                  'Thanks! Bug reporting is coming soon.'
                )
              }
              hitSlop={6}
              className="px-3 py-1.5 rounded-full flex-row items-center"
              style={({ pressed }) => ({
                backgroundColor: 'rgba(255,255,255,0.04)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.07)',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Ionicons name="bug-outline" size={12} color="#a1a1aa" />
              <Text className="text-muted ml-1.5" style={{ fontSize: 11 }}>
                Report bug
              </Text>
            </Pressable>
          </View>

          <View
            className="mt-5 flex-row"
            style={{
              borderBottomWidth: 1,
              borderColor: 'rgba(255,255,255,0.07)',
            }}
          >
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  className="flex-1 items-center pb-3 pt-1"
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <View className="flex-row items-center">
                    <Feather
                      name={tab.icon}
                      size={13}
                      color={active ? PEACH : '#a1a1aa'}
                    />
                    <Text
                      className="font-semibold ml-1.5"
                      style={{
                        color: active ? PEACH : '#a1a1aa',
                        fontSize: 13,
                      }}
                    >
                      {tab.label}
                    </Text>
                  </View>
                  {active ? (
                    <View
                      style={{
                        position: 'absolute',
                        bottom: -1,
                        left: '20%',
                        right: '20%',
                        height: 2,
                        backgroundColor: PEACH,
                        borderRadius: 2,
                      }}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          <View className="mt-5">
            {activeTab === 'description' ? (
              <DescriptionTab problem={problem} />
            ) : null}
            {activeTab === 'solutions' ? (
              <LockedTab
                title="Solutions are locked"
                subtitle="Submit a passing answer to unlock community solutions."
                icon="lock"
              />
            ) : null}
            {activeTab === 'submissions' ? (
              <LockedTab
                title="No submissions yet"
                subtitle="Once you run your first attempt it will appear here."
                icon="inbox"
              />
            ) : null}
          </View>

          <View
            style={{
              marginTop: 24,
              paddingTop: 16,
              borderTopWidth: 1,
              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <Pressable
              onPress={() =>
                router.push(`/problems/${problem.id}/solve` as never)
              }
              className="rounded-2xl flex-row items-center justify-center"
              style={({ pressed }) => ({
                backgroundColor: PEACH,
                height: 54,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text
                className="font-bold mr-2"
                style={{ color: '#1f1208', fontSize: 16 }}
              >
                Submit
              </Text>
              <Feather name="play" size={16} color="#1f1208" />
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function DescriptionTab({ problem }: { problem: Problem }) {
  return (
    <View>
      <RichDescription text={problem.description} />

      {problem.examples.map((example, index) => (
        <View key={index} className="mt-5">
          <Text
            className="text-foreground font-bold"
            style={{ fontSize: 15 }}
          >
            Example {index + 1}
          </Text>

          <View
            className="mt-2 rounded-2xl px-4 py-3"
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <Text
              className="text-foreground"
              style={{
                fontSize: 13,
                lineHeight: 20,
                fontFamily: 'Courier',
              }}
            >
              <Text className="text-muted">Input: </Text>
              {example.input}
            </Text>
            <Text
              className="text-foreground mt-1"
              style={{
                fontSize: 13,
                lineHeight: 20,
                fontFamily: 'Courier',
              }}
            >
              <Text className="text-muted">Output: </Text>
              {example.output}
            </Text>
            {example.explanation ? (
              <Text
                className="text-muted mt-2"
                style={{ fontSize: 12, lineHeight: 18 }}
              >
                {example.explanation}
              </Text>
            ) : null}
          </View>
        </View>
      ))}

      {problem.constraints.length > 0 ? (
        <View className="mt-6">
          <Text
            className="text-foreground font-bold"
            style={{ fontSize: 15 }}
          >
            Constraints
          </Text>
          <View className="mt-2" style={{ gap: 6 }}>
            {problem.constraints.map((constraint, index) => (
              <View key={index} className="flex-row items-start">
                <Text
                  className="text-muted"
                  style={{ fontSize: 13, lineHeight: 20, marginRight: 8 }}
                >
                  •
                </Text>
                <Text
                  className="text-muted flex-1"
                  style={{
                    fontSize: 13,
                    lineHeight: 20,
                    fontFamily: 'Courier',
                  }}
                >
                  {constraint}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {problem.tags.length > 0 ? (
        <View className="mt-6">
          <Text
            className="text-muted mb-2"
            style={{ fontSize: 12, letterSpacing: 1 }}
          >
            TAGS
          </Text>
          <View className="flex-row flex-wrap" style={{ gap: 8 }}>
            {problem.tags.map((tag) => (
              <View
                key={tag}
                className="px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.07)',
                }}
              >
                <Text className="text-muted" style={{ fontSize: 11 }}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

/**
 * Renders the description string with very lightweight markdown:
 * - Paragraphs split on double newlines
 * - Inline `**text**` becomes bold
 * - Lines starting with `- ` render as bullet items
 * - Triple-backtick blocks render as monospace blocks
 */
function RichDescription({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/);

  return (
    <View style={{ gap: 12 }}>
      {blocks.map((block, idx) => {
        const codeMatch = block.match(/^```([\s\S]*?)```$/m);
        if (codeMatch) {
          return (
            <View
              key={idx}
              className="rounded-2xl px-4 py-3"
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.06)',
              }}
            >
              <Text
                className="text-foreground"
                style={{
                  fontFamily: 'Courier',
                  fontSize: 13,
                  lineHeight: 20,
                }}
              >
                {codeMatch[1].trim()}
              </Text>
            </View>
          );
        }

        const lines = block.split('\n');
        const isList = lines.every((line) => line.startsWith('- '));
        if (isList) {
          return (
            <View key={idx} style={{ gap: 6 }}>
              {lines.map((line, lineIdx) => (
                <View key={lineIdx} className="flex-row items-start">
                  <Text
                    className="text-muted"
                    style={{ fontSize: 14, lineHeight: 22, marginRight: 8 }}
                  >
                    •
                  </Text>
                  <View className="flex-1">
                    <BoldText
                      text={line.slice(2)}
                      style={{
                        fontSize: 14,
                        lineHeight: 22,
                      }}
                    />
                  </View>
                </View>
              ))}
            </View>
          );
        }

        return (
          <BoldText
            key={idx}
            text={block}
            style={{ fontSize: 14, lineHeight: 22 }}
          />
        );
      })}
    </View>
  );
}

function BoldText({
  text,
  style,
}: {
  text: string;
  style: { fontSize: number; lineHeight: number };
}) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <Text className="text-muted" style={style}>
      {parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <Text
              key={idx}
              className="text-foreground"
              style={{ fontWeight: '700' }}
            >
              {part.slice(2, -2)}
            </Text>
          );
        }
        return <Text key={idx}>{part}</Text>;
      })}
    </Text>
  );
}

function LockedTab({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Feather.glyphMap;
}) {
  return (
    <View
      className="rounded-3xl p-8 items-center"
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <View
        className="w-12 h-12 rounded-2xl items-center justify-center"
        style={{ backgroundColor: 'rgba(189,240,110,0.12)' }}
      >
        <Feather name={icon} size={20} color={LIME} />
      </View>
      <Text
        className="text-foreground font-bold mt-4"
        style={{ fontSize: 16 }}
      >
        {title}
      </Text>
      <Text
        className="text-muted mt-2 text-center"
        style={{ fontSize: 13, lineHeight: 19 }}
      >
        {subtitle}
      </Text>
    </View>
  );
}
