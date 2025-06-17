import { captureException } from "@sentry/react-native";

export function handleError(fn: () => void) {
  try {
    fn()
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      captureException(`${fn.name}: ${error.message}`);
    } else if (typeof error === "string") {
      captureException(`${fn.name}: ${error}`);
    } else {
      captureException(`${fn.name}: Unknown error`);
    }
  }
};
