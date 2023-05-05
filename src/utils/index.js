// https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
export const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

export const generateRandomString = () => {
  let output = "";
  for (let i = 0; i < 8; i++)
    output += Math.floor(Math.random() * 16).toString(16);

  return output;
};
