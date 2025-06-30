import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import InterestsSelector from "../../components/InterestsSelector";

const meta = {
  title: "Widget/InterestsSelector",
  component: InterestsSelector,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof InterestsSelector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ReadOnly: Story = {
  args: {
    selectedInterests: ["musique", "art", "nature"],
    onInterestsChange: () => {}, // no-op because readonly
  },
};
