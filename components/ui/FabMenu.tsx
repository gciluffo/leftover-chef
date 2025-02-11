import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Fab, FabLabel, FabIcon } from "@/components/ui/fab";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface Props {
  actions: { title: string; icon: string; onPress: () => void }[];
}

export default function FabMenu({ actions }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Fab
      placement="bottom right"
      onPress={() => setIsOpen(!isOpen)}
      size="lg"
      style={styles.fab}
    >
      {isOpen ? (
        <View
          style={{ flexDirection: "column", justifyContent: "space-between" }}
        >
          {actions.map((action) => (
            <FabLabel key={action.title} onPress={action.onPress}>
              <FontAwesome name={action.icon as any} size={15} />
            </FabLabel>
          ))}
        </View>
      ) : (
        <FabLabel>
          <FontAwesome name="cog" size={15} />
        </FabLabel>
      )}
    </Fab>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
});
