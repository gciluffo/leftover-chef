import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { ExternalRecipe, Recipe } from "@/models/recipes";
import { useMemo } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Spacer from "./ui/Spacer";
import React from "react";
import { getDomainFromUrl } from "@/utils/formatting";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
const defaultImageUrl =
  "https://www.deadendbbq.com/wp-content/uploads/2022/06/blog-header.jpg";

interface Props {
  recipe: ExternalRecipe;
  onPress: () => void;
}

function StarRating(props: { rating: number; reviews: number }) {
  const ratingWhole = Math.round(props.rating);
  const arr = [];
  for (let i = 0; i < 5; i++) {
    if (i < ratingWhole) arr.push(true);
    else arr.push(false);
  }

  return (
    <View style={styles.starContainer}>
      {arr.map((r, i) => (
        <FontAwesome
          name="star"
          size={20}
          color={r ? "yellow" : "black"}
          key={i}
        />
      ))}
      <Text>({props.reviews} reviews)</Text>
    </View>
  );
}

export default function VerifiedRecipeCard({ recipe, onPress }: Props) {
  const imageUrl = useMemo(() => {
    if (!recipe) {
      return defaultImageUrl;
    }

    return recipe.image;
  }, [recipe]);

  return (
    <TouchableOpacity onPress={onPress}>
      <Card>
        <Image
          style={styles.image}
          source={imageUrl}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
        <Spacer />
        <Heading size="xl">{recipe.name}</Heading>
        <Text>{recipe.description}</Text>
        <Text>{getDomainFromUrl(recipe.source)}</Text>
        <Text>Total time {recipe.totalTime.slice(2, 4)} minutes</Text>
        <StarRating rating={5} reviews={recipe.ratings.count} />
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  starContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
  },
  image: {
    flex: 1,
    width: "100%",
    height: 200,
    borderRadius: 5,
    backgroundColor: "#0553",
  },
});
