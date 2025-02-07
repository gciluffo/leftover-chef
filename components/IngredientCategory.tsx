import React from "react";
import { View } from "./Themed";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Icon, ThreeDotsIcon } from "@/components/ui/icon";
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet";
import { camelToTitleCase } from "@/utils/formatting";

interface Props {
  title: string;
  children: React.ReactNode;
  showActions?: boolean;
  onClearCategory?: () => void;
  onAddIngredients?: () => void;
}

export function IngredientCategory(props: Props) {
  const [showActionsSheet, setShowActionsSheet] = React.useState(false);
  const closeSheet = () => setShowActionsSheet(false);

  const {
    title,
    children,
    showActions = false,
    onClearCategory,
    onAddIngredients,
  } = props;

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text size="2xl" bold>
          {camelToTitleCase(title)}
        </Text>
        {showActions && (
          <TouchableOpacity onPress={() => setShowActionsSheet(true)}>
            <Icon
              as={ThreeDotsIcon}
              size="xl"
              style={{
                transform: [{ rotate: "90deg" }],
              }}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.children}>{children}</View>

      <Actionsheet isOpen={showActionsSheet} onClose={closeSheet}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem
            onPress={() => {
              if (onAddIngredients) {
                onAddIngredients();
              }
              closeSheet();
            }}
          >
            <ActionsheetItemText size="lg">Add Ingredients</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => {
              if (onClearCategory) {
                onClearCategory();
              }
              closeSheet();
            }}
          >
            <ActionsheetItemText size="lg">
              Clear Ingredients
            </ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 8,
    margin: 4,
  },
  children: {
    flexDirection: "row",
  },
});
