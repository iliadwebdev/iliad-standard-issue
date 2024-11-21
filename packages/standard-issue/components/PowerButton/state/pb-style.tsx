import { useButtonCache } from "./pb-state";

export const PowerButtonStyle = ({}) => {
  const colors = useButtonCache((state) => state.colors);
  const cEntries = Object.entries(colors);

  return (
    <style data-styles="ButtonCacheStyle">
      {cEntries.map(([key, colors]) => {
        return `
        .iliad-PowerButton-root[data-color-key="${key}"] {
            --color-lightest: ${colors.lightest};
            --color-lighter: ${colors.lighter};
            --color-light: ${colors.light};
            --color: ${colors.color};
            --color-dark: ${colors.dark};
            --color-darker: ${colors.darker};
            --color-darkest: ${colors.darkest};
        }
        .iliad-PowerButton-root[data-bg-key="${key}"] {
            --background-color-lightest: ${colors.lightest};
            --background-color-lighter: ${colors.lighter};
            --background-color-light: ${colors.light};
            --background-color: ${colors.color};
            --background-color-dark: ${colors.dark};
            --background-color-darker: ${colors.darker};
            --background-color-darkest: ${colors.darkest};
        }
        `;
      })}
    </style>
  );
};
