import React from "react";
import { Box, BoxProps, Text, TextProps } from "ink";

type BasicLogProps = {
  components: string[];
};

function willConsumeMultipleLines(...components: string[]) {
  return components.some((component, idx) => {
    idx && component.includes("\n");
  });
}

export const BasicLog = ({ components }: BasicLogProps) => {
  const ml = willConsumeMultipleLines(...components);

  if (ml) {
    const [prefix, ...rest] = components;
    return (
      <Box flexDirection="column">
        <Text key={"01"}>{prefix}</Text>
        <Box flexWrap="nowrap" gap={1}>
          {rest.map((component, index) => {
            return (
              <Box
                key={index}
                flexDirection="row"
                flexShrink={0}
                marginRight={1}
              >
                <Text>{component}</Text>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  }
  return (
    <Box flexWrap="nowrap" gap={1}>
      {components.map((component, index) => {
        if (index) return <Text key={index}>{component}</Text>;

        return (
          <Box key={index} flexDirection="row" flexShrink={0} marginRight={1}>
            <Text>{component}</Text>
          </Box>
        );
      })}
    </Box>
  );
};
