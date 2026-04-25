import { Button, StyleSheet, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      
<Button
  title="Press me"
  colorClassName="accent-red-500 dark:accent-red-400"
  onPress={() => console.log('Pressed')}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
