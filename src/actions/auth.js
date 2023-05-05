import { Buffer } from "buffer";

const EXPIRE = 3600 * 1000;
const CLIENT_ID = process.env["REACT_APP_SPOTIFY_CLIENT_ID"];
const CLIENT_SECRET = process.env["REACT_APP_SPOTIFY_CLIENT_SECRET"];
const REDIRECT_URI = process.env["REACT_APP_FRONTEND_URL"];

export const logout = () => {
  // remove everything that has to do with spotify :P
  window.localStorage.removeItem("spotify_access_token");
  window.localStorage.removeItem("spotify_refresh_token");
  window.localStorage.removeItem("spotify_token_timestamp");
  window.localStorage.removeItem("spotify_state");
};

export const hasTokenExpired = () => {
  return Date.now() - getTokenTimestamp() > EXPIRE;
};

export const getTokenTimestamp = () => {
  return window.localStorage.getItem("spotify_token_timestamp");
};

export const getLocalAccessToken = () => {
  return window.localStorage.getItem("spotify_access_token");
};

export const getLocalRefreshToken = () => {
  window.localStorage.getItem("spotify_refresh_token");
};

export const getState = () => {
  return window.localStorage.getItem("spotify_state");
};

export const removeState = () => {
  window.localStorage.removeItem("spotify_state");
};

export const setTokenTimestamp = () => {
  window.localStorage.setItem("spotify_token_timestamp", Date.now());
};

export const setLocalAccessToken = (token) => {
  setTokenTimestamp();
  window.localStorage.setItem("spotify_access_token", token);
};

export const setLocalRefreshToken = (token) => {
  window.localStorage.setItem("spotify_refresh_token", token);
};

export const saveState = (state) => {
  window.localStorage.setItem("spotify_state", state);
};

const requestRefreshedAccessToken = async () => {
  const refresh_token = getLocalRefreshToken();
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        CLIENT_ID + ":" + CLIENT_SECRET
      ).toString("base64")}`,
    },
    body:
      "client_id=" +
      CLIENT_ID +
      "&client_secret=" +
      CLIENT_SECRET +
      "&grant_type=refresh_token&" +
      `refresh_token=${refresh_token}&redirect_uri=${REDIRECT_URI}`,
  });

  const json = await res.json();

  return json;
};

export const requestAccessToken = async (code) => {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        CLIENT_ID + ":" + CLIENT_SECRET
      ).toString("base64")}`,
    },
    body:
      "client_id=" +
      CLIENT_ID +
      "&client_secret=" +
      CLIENT_SECRET +
      "&grant_type=authorization_code&" +
      `code=${code}&redirect_uri=${REDIRECT_URI}`,
  });

  const json = await res.json();

  return json;
};

export const getAccessToken = () => {
  if (Date.now() - getTokenTimestamp() > EXPIRE) {
    // get new access token cah prev expired
    requestRefreshedAccessToken().then((response) => {
      const { access_token } = response;
      setLocalAccessToken(access_token);
    });

    return getLocalAccessToken();
  } else {
    return getLocalAccessToken();
  }
};
