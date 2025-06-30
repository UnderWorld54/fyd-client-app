import type { Meta, StoryObj } from "@storybook/react-native";

import { View } from "react-native";
import { fn } from "storybook/test";

import Button from "../../components/Button";

const meta = {
  title: "Button/Button",
  component: Button,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, alignItems: "flex-start", padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  tags: ["autodocs"],
  args: { onPress: fn() },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    title: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    title: "Secondary Button",
  },
};

export const CustomStyle: Story = {
  args: {
    variant: "primary",
    title: "Custom Style",
    style: { backgroundColor: "purple" },
  },
};
