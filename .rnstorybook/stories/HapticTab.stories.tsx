import type { Meta, StoryObj } from "@storybook/react-native";

import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";

import { HapticTab } from "../../components/HapticTab";

const meta = {
  title: "Button/HapticTab",
  component: HapticTab,
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <Story />
      </View>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof HapticTab>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultProps: BottomTabBarButtonProps = {
  accessibilityState: { selected: false },
  onPress: () => {},
  onLongPress: () => {},
  onPressIn: () => {
    console.log("Pressed in");
  },
  onPressOut: () => {},
  testID: "tab-button",
  children: <Text>Tab</Text>,
};

export const Default: Story = {
  args: defaultProps,
};
