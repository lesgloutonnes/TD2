export type DescribedOption = {
  value: string;
  label: string;
  description?: string;
};

/** Hovered option wins; otherwise the selected value. Empty value has no description. */
export function previewDescribedOption(
  options: readonly DescribedOption[],
  selectedValue: string,
  hoveredValue: string | null,
): DescribedOption | undefined {
  const lookup = hoveredValue !== null ? hoveredValue : selectedValue;
  if (!lookup) return undefined;
  return options.find((option) => option.value === lookup);
}
