export const camelToTitleCase = (title: string) => {
  return title
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

export const getDomainFromUrl = (url: string) => {
  // without www
  return url.split("/")[2].replace("www.", "");
};
