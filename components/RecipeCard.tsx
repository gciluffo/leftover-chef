import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Recipe } from "@/store/recipes";
import { TouchableOpacity } from "react-native";

interface Props {
  recipe: Recipe;
  onPress: () => void;
}

function RecipeCard({ recipe, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card>
        <Heading size="xl">{recipe.title}</Heading>
        <Text>{recipe.description}</Text>
      </Card>
    </TouchableOpacity>
  );
}

export default RecipeCard;
