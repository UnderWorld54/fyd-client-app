import type { Meta, StoryObj } from "@storybook/react-native";
import { Button, View } from "react-native";

import Header from "../../components/Header";

const meta = {
  title: "Navigation/Header",
  component: Header,
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          paddingTop: 50,
          paddingHorizontal: 16,
          backgroundColor: "#fff",
        }}
      >
        <Story />
      </View>
    ),
  ],
  tags: ["autodocs"],
  args: {
    title: "Screen Title",
  },
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithRightComponent: Story = {
  args: {
    rightComponent: <Button title="+" onPress={() => alert("Edit pressed")} />,
  },
};
