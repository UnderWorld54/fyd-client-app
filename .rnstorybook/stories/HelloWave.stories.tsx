import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { HelloWave } from "../../components/HelloWave";

const meta = {
  title: "Decoration/HelloWave",
  component: HelloWave,
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof HelloWave>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
