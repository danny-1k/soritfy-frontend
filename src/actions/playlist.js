const limit = 50;

export const fetchPlaylist = async (playlistId, accessToken) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    method: "GET",
    headers,
  });

  const json = await res.json();

  return json;
};
