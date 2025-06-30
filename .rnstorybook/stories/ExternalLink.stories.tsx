import type { Meta, StoryObj } from "@storybook/react-native";

import { View } from "react-native";
import { fn } from "storybook/test";

import { ExternalLink } from "../../components/ExternalLink";

const meta = {
  title: "Link/ExternalLink",
  component: ExternalLink,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Story />
      </View>
    ),
  ],
  tags: ["autodocs"],
  args: {
    onPress: fn(),
    children: "Open Expo website",
    href: "https://expo.dev",
  },
} satisfies Meta<typeof ExternalLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomText: Story = {
  args: {
    children: "Go to React Native docs",
    href: "https://reactnative.dev",
  },
};
