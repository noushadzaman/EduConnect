export function formatMyDate(date) {
  let options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  return formattedDate;
}

export const formatDuration = (duration) => {
  if (!duration) return null;

  const hour = Math.floor(duration / 3600);
  const min = Math.floor((duration % 3600) / 60);
  const sec = Math.floor((duration % 3600) % 60);
  const durationString = `${hour}:${min}:${sec}`;

  return durationString;
};
