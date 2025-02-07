import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onCategoryChange: (category: string) => void;
}

export const IngredientChipActionSheet = (props: Props) => {
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const closeCategorySheet = () => setShowCategoryOptions(false);
  const { isOpen, onClose, onDelete, onCategoryChange } = props;

  const onMoveToDifferentCategory = (category: string) => {
    onCategoryChange(category);
    closeCategorySheet();
  };

  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem onPress={() => setShowCategoryOptions(true)}>
            <ActionsheetItemText size="lg">
              Move to different category
            </ActionsheetItemText>
            {/* <PantryCategoryDropdown /> */}
          </ActionsheetItem>
          <ActionsheetItem onPress={onDelete}>
            <ActionsheetItemText size="lg">Delete</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>

      <Actionsheet isOpen={showCategoryOptions} onClose={closeCategorySheet}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem
            onPress={() => onMoveToDifferentCategory("freshProduce")}
          >
            <ActionsheetItemText size="lg">Fresh Produce</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={() => onMoveToDifferentCategory("dairy")}>
            <ActionsheetItemText size="lg">Dairy</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => onMoveToDifferentCategory("meatAndPoultry")}
          >
            <ActionsheetItemText size="lg">
              Meat And Poultry
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={() => onMoveToDifferentCategory("baking")}>
            <ActionsheetItemText size="lg">Baking</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => onMoveToDifferentCategory("spicesAndSeasonings")}
          >
            <ActionsheetItemText size="lg">
              Spices And Seasonings
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => onMoveToDifferentCategory("condimentsAndSauces")}
          >
            <ActionsheetItemText size="lg">
              Condiments And Sauces
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => onMoveToDifferentCategory("oilsAndFats")}
          >
            <ActionsheetItemText size="lg">Oils And Fats</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => onMoveToDifferentCategory("grainsAndBread")}
          >
            <ActionsheetItemText size="lg">
              Grains And Bread
            </ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};
