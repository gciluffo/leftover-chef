import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { StyleSheet, SafeAreaView, View, Pressable } from "react-native";
import Animated, {
  withDelay,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = {
  duration: 1200,
  overshootClamping: true,
  dampingRatio: 0.8,
};

const OFFSET = 60;

interface FloatingActionButtonProps {
  isExpanded: Animated.SharedValue<boolean>;
  index: number;
  iconName: string;
  text: string;
  onPress?: () => void;
}

const FloatingActionButton = ({
  isExpanded,
  index,
  iconName,
  text,
  onPress,
}: FloatingActionButtonProps) => {
  const animatedFabStyle = useAnimatedStyle(() => {
    const moveValue = isExpanded.value ? OFFSET * index : 0;
    const translateValue = withSpring(-moveValue, SPRING_CONFIG);
    const delay = index * 100;

    const scaleValue = isExpanded.value ? 1 : 0;

    return {
      transform: [
        { translateY: translateValue },
        {
          scale: withDelay(delay, withTiming(scaleValue)),
        },
      ],
    };
  });

  // create animated style for text to fade in to the left of the pressable
  const textAnimatedStyle = useAnimatedStyle(() => {
    const opacityValue = isExpanded.value ? 1 : 0;
    const delay = index * 100;
    const textLength = text.length;
    const leftValue = -textLength * 7.5;

    return {
      opacity: withDelay(delay, withTiming(opacityValue)),
      position: "absolute",
      left: leftValue,
    };
  });

  return (
    <AnimatedPressable
      onPress={onPress}
      className="bg-primary-500"
      style={[animatedFabStyle, styles.button]}
    >
      <Animated.Text
        onPress={onPress}
        className="bg-primary-500"
        style={[textAnimatedStyle, styles.fabText]}
      >
        {text}
      </Animated.Text>
      <FontAwesome name={iconName as any} size={15} />
    </AnimatedPressable>
  );
};

interface Props {
  actions: { iconName: string; text: string; onPress: () => void }[];
  onExpanded?: (val: boolean) => void;
}

export default function MultiOptionFAB(props: Props) {
  const { actions } = props;
  const isExpanded = useSharedValue(false);

  const handlePress = () => {
    isExpanded.value = !isExpanded.value;
    props.onExpanded?.(!isExpanded.value);
  };

  const plusIconStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(Number(isExpanded.value), [0, 1], [0, 2]);
    const translateValue = withTiming(moveValue);
    const rotateValue = isExpanded.value ? "45deg" : "0deg";

    return {
      transform: [
        { translateX: translateValue },
        { rotate: withTiming(rotateValue) },
      ],
    };
  });

  return (
    <SafeAreaView>
      <View style={styles.buttonContainer}>
        <AnimatedPressable
          onPress={handlePress}
          className="bg-primary-500"
          style={[mainButtonStyles.button]}
        >
          <Animated.Text style={[plusIconStyle, mainButtonStyles.content]}>
            +
          </Animated.Text>
        </AnimatedPressable>
        {actions.map((action, index) => (
          <FloatingActionButton
            key={index}
            isExpanded={isExpanded}
            index={index + 1}
            iconName={action.iconName}
            text={action.text}
            onPress={() => {
              action.onPress();
              handlePress();
            }}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const mainButtonStyles = StyleSheet.create({
  button: {
    zIndex: 1,
    height: 54,
    width: 54,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    fontSize: 27,
    fontWeight: "bold",
  },
});

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    position: "absolute",
    left: 7,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: -2,
    flexDirection: "row",
  },
  buttonContainer: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
  fabText: {
    backgroundColor: "transparent",
    color: "white",
  },
});
