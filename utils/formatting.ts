export const camelToTitleCase = (title: string) => {
  return title
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};
