import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetailAccountScreen() {
  return (
    <SafeAreaView>
      <ThemedView>
        <ThemedText>Account Detail Screen</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}