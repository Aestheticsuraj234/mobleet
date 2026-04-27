import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Spinner } from 'heroui-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CodeEditor } from '@/components/CodeEditor';
import { runAllCases, type CaseResult } from '@/lib/codebox';
import {
  getAvailableLanguages,
  getProblemById,
  LANGUAGE_BADGE,
  LANGUAGE_LABEL,
  LANGUAGE_TINT,
  type LanguageId,
} from '@/lib/problems';

const LIME = '#bdf06e';
const PEACH = '#fdba74';

export default function SolveProblem() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const problem = getProblemById(id);

  const availableLanguages = useMemo(
    () => (problem ? getAvailableLanguages(problem) : []),
    [problem]
  );
  const initialLanguage: LanguageId = availableLanguages[0] ?? 'javascript';

  const [language, setLanguage] = useState<LanguageId>(initialLanguage);
  const [code, setCode] = useState<string>(
    problem?.starterCode[initialLanguage] ?? ''
  );
  const [touched, setTouched] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeCase, setActiveCase] = useState(0);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<CaseResult[] | null>(null);
  const [resultsOpen, setResultsOpen] = useState(false);

  useEffect(() => {
    if (!problem) return;
    if (!touched) {
      setCode(problem.starterCode[language] ?? '');
    }
  }, [language, problem, touched]);

  const summary = useMemo(() => {
    if (!results) return null;
    const passed = results.filter((r) => r.outcome === 'accepted').length;
    return { passed, total: results.length };
  }, [results]);

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

  const handleReset = () => {
    Alert.alert(
      'Reset code?',
      'This will replace your edits with the starter code.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setCode(problem.starterCode[language] ?? '');
            setTouched(false);
            setResults(null);
          },
        },
      ]
    );
  };

  const handleRun = async () => {
    if (running) return;
    setRunning(true);
    setResults(null);
    try {
      const res = await runAllCases(problem, language, code);
      setResults(res);
      setResultsOpen(true);
    } catch (err) {
      Alert.alert(
        'Run failed',
        err instanceof Error ? err.message : 'Unknown error'
      );
    } finally {
      setRunning(false);
    }
  };

  const currentCase = problem.testCases[activeCase];

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/**
         * One ScrollView only (Android collapses flex:siblings header + scroll + footer).
         * Same pattern as problems/index.
         */}
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 6,
            paddingBottom: 24,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            className="flex-row items-center justify-between"
            style={{ height: 56, marginBottom: 4 }}
          >
            <View className="flex-row items-center flex-1 pr-3">
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
                className="text-foreground font-bold ml-3 flex-1"
                style={{ fontSize: 15 }}
                numberOfLines={1}
              >
                {problem.title}
              </Text>
            </View>

            <Pressable
              onPress={() => setPickerOpen(true)}
              className="flex-row items-center px-3 py-2 rounded-xl"
              style={({ pressed }) => ({
                backgroundColor: 'rgba(255,255,255,0.04)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.07)',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  backgroundColor: LANGUAGE_TINT[language],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#0a0a0c',
                    fontSize: 9,
                    fontWeight: '900',
                  }}
                >
                  {LANGUAGE_BADGE[language]}
                </Text>
              </View>
              <Text
                className="text-foreground font-semibold ml-2"
                style={{ fontSize: 12 }}
              >
                {LANGUAGE_LABEL[language]}
              </Text>
              <Feather
                name="chevron-down"
                size={14}
                color="#a1a1aa"
                style={{ marginLeft: 4 }}
              />
            </Pressable>
          </View>
          <View
            className="rounded-2xl"
            style={{
              backgroundColor: '#0f1014',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.07)',
                overflow: 'hidden',
              }}
            >
              <View
                className="flex-row items-center justify-between px-3 py-2"
                style={{
                  borderBottomWidth: 1,
                  borderColor: 'rgba(255,255,255,0.06)',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                }}
              >
                <View className="flex-row items-center">
                  <Pressable
                    hitSlop={6}
                    onPress={handleReset}
                    style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                  >
                    <Feather name="rotate-ccw" size={14} color="#a1a1aa" />
                  </Pressable>
                  <View
                    style={{
                      width: 1,
                      height: 14,
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      marginHorizontal: 12,
                    }}
                  />
                  <Pressable
                    hitSlop={6}
                    onPress={() =>
                      Alert.alert('Redo', 'Coming soon. Track edits per session.')
                    }
                    style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                  >
                    <Feather name="rotate-cw" size={14} color="#a1a1aa" />
                  </Pressable>
                </View>

                <View className="flex-row items-center">
                  <Pressable
                    hitSlop={6}
                    onPress={() => {
                      setCode(problem.starterCode[language] ?? '');
                      setTouched(false);
                    }}
                    style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                  >
                    <Feather name="refresh-cw" size={14} color="#a1a1aa" />
                  </Pressable>
                </View>
              </View>

              <CodeEditor
                value={code}
                onValueChange={(next) => {
                  setCode(next);
                  setTouched(true);
                }}
                language={language}
                minHeight={280}
              />
            </View>

            <View className="mt-6 flex-row items-center">
              <View
                className="w-7 h-7 rounded-lg items-center justify-center mr-2"
                style={{ backgroundColor: 'rgba(253,186,116,0.18)' }}
              >
                <Ionicons name="flask-outline" size={14} color={PEACH} />
              </View>
              <Text
                className="text-foreground font-bold"
                style={{ fontSize: 15 }}
              >
                Test Cases
              </Text>
            </View>

            <View className="mt-3 flex-row" style={{ gap: 8 }}>
              {problem.testCases.map((_, index) => {
                const active = activeCase === index;
                return (
                  <Pressable
                    key={index}
                    onPress={() => setActiveCase(index)}
                    className="px-3 py-1.5"
                    style={({ pressed }) => ({
                      borderBottomWidth: 2,
                      borderColor: active ? PEACH : 'transparent',
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <Text
                      className="font-semibold"
                      style={{
                        color: active ? PEACH : '#a1a1aa',
                        fontSize: 13,
                      }}
                    >
                      Case {index + 1}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View className="mt-4">
              <Text
                className="text-muted mb-2"
                style={{ fontSize: 12, letterSpacing: 0.6 }}
              >
                Input
              </Text>
              <View
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
                    fontFamily: Platform.select({
                      ios: 'Menlo',
                      android: 'monospace',
                      default: 'Courier',
                    }),
                    fontSize: 13,
                    lineHeight: 20,
                  }}
                >
                  {currentCase.input}
                </Text>
              </View>
            </View>

            <View className="mt-4">
              <Text
                className="text-muted mb-2"
                style={{ fontSize: 12, letterSpacing: 0.6 }}
              >
                Expected Output
              </Text>
              <View
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
                    fontFamily: Platform.select({
                      ios: 'Menlo',
                      android: 'monospace',
                      default: 'Courier',
                    }),
                    fontSize: 13,
                    lineHeight: 20,
                  }}
                >
                  {currentCase.expectedOutput}
                </Text>
              </View>
            </View>

            {summary ? (
              <Pressable
                onPress={() => setResultsOpen(true)}
                className="mt-5 rounded-2xl px-4 py-3 flex-row items-center justify-between"
                style={({ pressed }) => ({
                  backgroundColor:
                    summary.passed === summary.total
                      ? 'rgba(134,239,172,0.10)'
                      : 'rgba(252,165,165,0.10)',
                  borderWidth: 1,
                  borderColor:
                    summary.passed === summary.total
                      ? 'rgba(134,239,172,0.3)'
                      : 'rgba(252,165,165,0.3)',
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <View className="flex-row items-center">
                  <Feather
                    name={
                      summary.passed === summary.total
                        ? 'check-circle'
                        : 'x-circle'
                    }
                    size={16}
                    color={
                      summary.passed === summary.total ? '#86efac' : '#fca5a5'
                    }
                  />
                  <Text
                    className="font-bold ml-2"
                    style={{
                      color:
                        summary.passed === summary.total
                          ? '#86efac'
                          : '#fca5a5',
                      fontSize: 13,
                    }}
                  >
                    {summary.passed}/{summary.total} test cases passed
                  </Text>
                </View>
                <Text className="text-muted" style={{ fontSize: 12 }}>
                  View details
                </Text>
              </Pressable>
            ) : null}

          <View
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTopWidth: 1,
              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <Pressable
              onPress={handleRun}
              disabled={running}
              className="rounded-2xl flex-row items-center justify-center"
              style={({ pressed }) => ({
                backgroundColor: PEACH,
                height: 54,
                opacity: running ? 0.7 : pressed ? 0.85 : 1,
              })}
            >
              {running ? (
                <Spinner color="#1f1208" />
              ) : (
                <>
                  <Text
                    className="font-bold mr-2"
                    style={{ color: '#1f1208', fontSize: 16 }}
                  >
                    Submit Solution
                  </Text>
                  <Feather name="play" size={16} color="#1f1208" />
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>

      <LanguagePicker
        visible={pickerOpen}
        active={language}
        languages={availableLanguages}
        onClose={() => setPickerOpen(false)}
        onSelect={(lang) => {
          setLanguage(lang);
          setPickerOpen(false);
        }}
      />

      <ResultsSheet
        visible={resultsOpen}
        onClose={() => setResultsOpen(false)}
        results={results}
      />
    </View>
  );
}

function LanguagePicker({
  visible,
  active,
  languages,
  onClose,
  onSelect,
}: {
  visible: boolean;
  active: LanguageId;
  languages: LanguageId[];
  onClose: () => void;
  onSelect: (lang: LanguageId) => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-end"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onPress={onClose}
      >
        <Pressable
          onPress={() => {
            /* swallow */
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
          <Text
            className="text-foreground font-bold mb-3"
            style={{ fontSize: 18 }}
          >
            Pick a language
          </Text>
          <View style={{ gap: 8 }}>
            {languages.map((lang) => {
              const isActive = active === lang;
              return (
                <Pressable
                  key={lang}
                  onPress={() => onSelect(lang)}
                  className="flex-row items-center rounded-2xl px-4 py-3"
                  style={({ pressed }) => ({
                    backgroundColor: isActive
                      ? 'rgba(189,240,110,0.10)'
                      : 'rgba(255,255,255,0.04)',
                    borderWidth: 1,
                    borderColor: isActive
                      ? 'rgba(189,240,110,0.35)'
                      : 'rgba(255,255,255,0.07)',
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 5,
                      backgroundColor: LANGUAGE_TINT[lang],
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: '#0a0a0c',
                        fontSize: 10,
                        fontWeight: '900',
                      }}
                    >
                      {LANGUAGE_BADGE[lang]}
                    </Text>
                  </View>
                  <Text
                    className="text-foreground font-semibold flex-1"
                    style={{ fontSize: 14 }}
                  >
                    {LANGUAGE_LABEL[lang]}
                  </Text>
                  {isActive ? (
                    <Feather name="check" size={16} color={LIME} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function ResultsSheet({
  visible,
  onClose,
  results,
}: {
  visible: boolean;
  onClose: () => void;
  results: CaseResult[] | null;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-end"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onPress={onClose}
      >
        <Pressable
          onPress={() => {
            /* swallow */
          }}
          className="rounded-t-3xl"
          style={{
            backgroundColor: '#13141a',
            borderTopWidth: 1,
            borderColor: 'rgba(255,255,255,0.07)',
            maxHeight: '80%',
          }}
        >
          <View className="px-5 pt-4 pb-2">
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
                Run results
              </Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <Feather name="x" size={18} color="#a1a1aa" />
              </Pressable>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 32,
              paddingTop: 8,
            }}
          >
            {results?.map((result) => (
              <ResultRow key={result.index} result={result} />
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function ResultRow({ result }: { result: CaseResult }) {
  const tint =
    result.outcome === 'accepted'
      ? { fg: '#86efac', bg: 'rgba(134,239,172,0.10)', label: 'Accepted' }
      : result.outcome === 'wrong-answer'
        ? { fg: '#fca5a5', bg: 'rgba(252,165,165,0.10)', label: 'Wrong Answer' }
        : { fg: '#fdba74', bg: 'rgba(253,186,116,0.10)', label: 'Error' };

  return (
    <View
      className="rounded-2xl px-4 py-3 mb-3"
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
      }}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className="text-foreground font-bold"
          style={{ fontSize: 13 }}
        >
          Case {result.index + 1}
        </Text>
        <View
          className="px-2 py-0.5 rounded-md"
          style={{ backgroundColor: tint.bg }}
        >
          <Text
            className="font-bold"
            style={{ color: tint.fg, fontSize: 10, letterSpacing: 0.6 }}
          >
            {tint.label.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text
        className="text-muted mt-2"
        style={{
          fontSize: 11,
          letterSpacing: 0.6,
        }}
      >
        INPUT
      </Text>
      <Text
        className="text-foreground"
        style={{
          fontSize: 12,
          lineHeight: 18,
          fontFamily: Platform.select({
            ios: 'Menlo',
            android: 'monospace',
            default: 'Courier',
          }),
        }}
      >
        {result.input}
      </Text>

      <Text
        className="text-muted mt-2"
        style={{ fontSize: 11, letterSpacing: 0.6 }}
      >
        EXPECTED
      </Text>
      <Text
        className="text-foreground"
        style={{
          fontSize: 12,
          lineHeight: 18,
          fontFamily: Platform.select({
            ios: 'Menlo',
            android: 'monospace',
            default: 'Courier',
          }),
        }}
      >
        {result.expectedOutput}
      </Text>

      <Text
        className="text-muted mt-2"
        style={{ fontSize: 11, letterSpacing: 0.6 }}
      >
        OUTPUT
      </Text>
      <Text
        style={{
          color: tint.fg,
          fontSize: 12,
          lineHeight: 18,
          fontFamily: Platform.select({
            ios: 'Menlo',
            android: 'monospace',
            default: 'Courier',
          }),
        }}
      >
        {result.actualOutput || '(empty)'}
      </Text>

      {result.stderr ? (
        <>
          <Text
            className="text-muted mt-2"
            style={{ fontSize: 11, letterSpacing: 0.6 }}
          >
            STDERR
          </Text>
          <Text
            style={{
              color: '#fca5a5',
              fontSize: 12,
              lineHeight: 18,
              fontFamily: Platform.select({
                ios: 'Menlo',
                android: 'monospace',
                default: 'Courier',
              }),
            }}
          >
            {result.stderr}
          </Text>
        </>
      ) : null}

      {result.timeSec !== null || result.memoryKb !== null ? (
        <View className="mt-3 flex-row" style={{ gap: 12 }}>
          {result.timeSec !== null ? (
            <View className="flex-row items-center">
              <Feather name="clock" size={11} color="#a1a1aa" />
              <Text
                className="text-muted ml-1"
                style={{ fontSize: 11 }}
              >
                {result.timeSec.toFixed(3)}s
              </Text>
            </View>
          ) : null}
          {result.memoryKb !== null ? (
            <View className="flex-row items-center">
              <Feather name="cpu" size={11} color="#a1a1aa" />
              <Text
                className="text-muted ml-1"
                style={{ fontSize: 11 }}
              >
                {result.memoryKb} KB
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
