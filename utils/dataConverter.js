export const dateConverter = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  if (hours === 0 && minutes !== 0) {
    return minutes <= 1 ? `${minutes} min ago` : `${minutes} mins ago`;
  } else {
    return `${hours} hrs ago`;
  }
};
