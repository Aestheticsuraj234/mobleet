import { Redirect } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { isAdminUser } from '@/lib/admin';
import { useSession } from '@/lib/auth-client';

const LIME = '#bdf06e';

export default function AddProblem() {
  const { data: session } = useSession();

  if (!isAdminUser(session?.user)) {
    return <Redirect href={'/' as never} />;
  }

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
            Add Problem
          </Text>
          <Text className="text-muted mt-2" style={{ fontSize: 14 }}>
            Admin-only entry point for creating new challenges.
          </Text>

          <View className="mt-6" style={{ gap: 14 }}>
            <Field label="Title" placeholder="Two Sum" />
            <Field label="Difficulty" placeholder="Easy, Medium, or Hard" />
            <Field
              label="Prompt"
              placeholder="Write the problem statement"
              multiline
            />
          </View>

          <View
            className="mt-6 rounded-2xl items-center justify-center py-4"
            style={{ backgroundColor: LIME }}
          >
            <Text className="font-bold" style={{ color: '#0a0a0c' }}>
              Save Problem
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Field({
  label,
  placeholder,
  multiline,
}: {
  label: string;
  placeholder: string;
  multiline?: boolean;
}) {
  return (
    <View>
      <Text className="text-foreground font-semibold mb-2">{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#71717a"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        className="text-foreground rounded-2xl px-4"
        style={{
          minHeight: multiline ? 140 : 52,
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.07)',
          paddingVertical: multiline ? 14 : 0,
        }}
      />
    </View>
  );
}
