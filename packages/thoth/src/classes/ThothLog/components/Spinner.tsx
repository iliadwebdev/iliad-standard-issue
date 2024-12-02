import React from "react";

// Ink
import InkSpinner from "ink-spinner";
import { Text, Box } from "ink";

type SpinnerComponentProps = {
  state?: "success" | "error" | "warning" | "info" | "pending";
};
type SpinnerProps = {
  color: string;
};
const Spinner = ({ color }: SpinnerProps) => {
  return (
    <Text color={color}>
      <InkSpinner />
    </Text>
  );
};

export const SpinnerComponent = ({
  state = "pending",
}: SpinnerComponentProps) => {
  let stateComponent;

  switch (state) {
    case "success":
      stateComponent = <Text color="green">✔</Text>;
      break;
    case "error":
      stateComponent = <Text color="red">✖</Text>;
      break;
    case "warning":
      stateComponent = <Text color="yellow">!</Text>;
      break;
    case "info":
      stateComponent = <Text color="blue">i</Text>;
      break;
    case "pending":
      stateComponent = <Spinner color={"#00ace0"} />;
      break;
    default:
      stateComponent = <Spinner color={"#00ace0"} />;
  }

  return (
    <Box marginLeft={1} marginRight={1}>
      {stateComponent}
    </Box>
  );
};
