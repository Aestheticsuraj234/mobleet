import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { isAdminUser } from '@/lib/admin';
import { useSession } from '@/lib/auth-client';

export default function TabsLayout() {
  const { data: session } = useSession();
  const isAdmin = isAdminUser(session?.user);

  return (
    <NativeTabs
      backgroundColor="#0f1014"
      blurEffect="systemChromeMaterialDark"
      disableTransparentOnScrollEdge
      iconColor="#a1a1aa"
      labelStyle={{ color: '#a1a1aa' }}
      tintColor="#bdf06e"
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          md="home"
        />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="problems">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'list.bullet.rectangle', selected: 'list.bullet.rectangle.fill' }}
          md="format_list_bulleted"
        />
        <NativeTabs.Trigger.Label>Problems</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person', selected: 'person.fill' }}
          md="person"
        />
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="add-problem" hidden={!isAdmin}>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'plus.app', selected: 'plus.app.fill' }}
          md="add_box"
        />
        <NativeTabs.Trigger.Label>Add</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
