import type { Meta, StoryObj } from "@storybook/react-native";

import { Text, View } from "react-native";

import { Collapsible } from "../../components/Collapsible";

const meta = {
  title: "Accordion/Collapsible",
  component: Collapsible,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Tap to expand",
    children: (
      <>
        <Text>Here is some collapsible content.</Text>
        <Text>It shows when the header is open.</Text>
      </>
    ),
  },
};
