import { useState, useEffect } from "react";
import Track, { PlaylistHeader } from "./components/track";
import {
  getAccessToken,
  setLocalAccessToken,
  saveState,
  getState,
  removeState,
  logout,
  requestAccessToken,
  setLocalRefreshToken,
} from "./actions/auth";

import { fetchPlaylist } from "./actions/playlist";
import { generateRandomString, millisToMinutesAndSeconds } from "./utils";

export default function App() {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [playlistId, setPlaylistId] = useState(null);
  const [playlistData, setPlaylistData] = useState(null);
  const [tracksData, setTracksData] = useState(null);
  const [sortedTracksData, setSortedTracksData] = useState(null);

  const handleLogin = () => {
    const state = generateRandomString();
    saveState(state); // We'll save the random hex state and we'll use this to compare the state returned from the web api

    const authURL =
      "https://accounts.spotify.com/authorize?" +
      `client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&` +
      `redirect_uri=${process.env.REACT_APP_FRONTEND_URL}&` +
      `response_type=code&state=${state}`;

    window.location = authURL; // user auth
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken("");
    setPlaylistData(null);
    setSortedTracksData(null);
    logout();
  };

  const handleSort = () => {};

  useEffect(() => {
    const token = getAccessToken();
    const state = getState();

    if (window.location.search.length > 0) {
      // after user authenticates with spotify, we'll have the code in the url, we'll retrieve that
      const params = {};
      window.location.search
        .slice(1)
        .split("&")
        .forEach((el) => {
          const [key, value] = el.split("=");
          eval(`params.${key} = "${value}"`);
        });

      if (params.state && params.state === state) {
        // comparing with the previously saved generated state
        // Now we've verified they're the same, request access token and refresh token
        requestAccessToken(params.code).then((response) => {
          const { access_token, refresh_token } = response;

          setLocalAccessToken(access_token); // save access token to local storage
          setLocalRefreshToken(refresh_token); // save refresh token to local storage
          removeState(); // we dont need this anymore

          window.location = "/"; // Remove the nonsense from the url
        });
      } else {
        // If we cn't verify the state, stop the auth flow

        window.location = "/";
        removeState();
      }
    } else {
      if (token) {
        // if there's already a token in localstorage and it hasn't expired, we'll use that
        setToken(token);
        setIsAuthenticated(true);
      }
    }
  });

  const handleSortPlaylist = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col max-w-4xl min-h-screen mx-auto items-center py-2 bg-slate-900 text-white">
      <header className="w-full">
        {isAuthenticated ? (
          <a
            className="text-right float-right text-red-400 font-semibold cursor-pointer hover:underline"
            onClick={handleLogout}
          >
            Logout
          </a>
        ) : (
          <a
            className="text-right float-right text-green-400 font-semibold cursor-pointer hover:underline"
            onClick={handleLogin}
          >
            Login
          </a>
        )}
      </header>
      <main className="flex flex-col flex-1 w-full items-center text-center sm:text-left px-4 mt-12 sm:mt-20">
        <h1 className="text-4xl sm:text-6xl font-bold text-white">
          Sort your <span className="text-green-400">Spotify</span> playlists
          with <span className="underline decoration-green-400">AI</span>
        </h1>

        {isAuthenticated ? (
          <>
            <div className="max-w-xl w-full mt-12">
              <h2 className="font-bold text-gray-200 text-xl mb-3">
                Enter a Spotify playlist URL
              </h2>

              <div>
                <input
                  className="w-full p-3 border-none outline-none focus:outline-green-400 rounded-lg text-green-400 font-semibold bg-slate-700"
                  placeholder="Spotify playlist URL or ID"
                  onChange={async (e) => {
                    let playlist = e.target.value;
                    let Id = "";

                    if (
                      playlist.startsWith("https") ||
                      playlist.startsWith("http")
                    ) {
                      Id = playlist.split("/").slice(-1)[0];
                      if (Id.length === 22) {
                        playlist = Id;
                        setPlaylistId(Id);
                      }
                    } else {
                      if (playlist.length === 22) { // spotify playlist urls are usually 22 chars long
                        Id = playlist;
                        setPlaylistId(playlist);
                      }
                    }

                    if (Id === playlist && Id != "") {
                      const res = await fetchPlaylist(Id, token);

                      const playlistMetadata = {
                        img: res.images[0].url,
                        title: res.name,
                        description: res.description,
                        author: {
                          display_name: res.owner.display_name,
                          href: res.owner.external_urls.spotify,
                        },
                      };

                      const tracksMetadata = res.tracks.items.map(
                        (track, order) => ({
                          added_at: track.added_at,
                          duration: track.track.duration_ms,
                          artists: track.track.artists.map((artist) => ({
                            href: artist.href,
                            name: artist.name,
                          })),
                          img: track.track.album.images[0].url,
                          title: track.track.name,
                          album: track.track.album.name,
                          order: order + 1,
                        })
                      );

                      setPlaylistData(playlistMetadata);

                      setTracksData(tracksMetadata);
                    }
                  }}
                />
              </div>
            </div>
            <div className="max-w-4xl w-full mt-12">
              {playlistData && (
                <>
                  <PlaylistHeader
                    img={playlistData.img}
                    title={playlistData.title}
                    description={playlistData.description}
                  />
                  <div className="py-5 h-96 overflow-y-scroll custom-scroll">
                    <div className="text-white">
                      {tracksData.map((track) => (
                        <>
                          <Track
                            img={track.img}
                            title={track.title}
                            authors={track.artists}
                            order={track.order}
                            album={track.album}
                            date={track.added_at}
                            duration={millisToMinutesAndSeconds(track.duration)}
                            key={track.img}
                          />
                          <hr className="h-px my-4 border-0 bg-gray-700" />
                        </>
                      ))}
                    </div>
                  </div>
                  <button
                    className="w-full bg-slate-800 hover:bg-slate-700 p-3 rounded-lg mt-3"
                    onClick={handleSort}
                  >
                    Sort
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <p className="font-semibold mt-10 text-xl">
            Please Log in with spotify to continue.{" "}
            <span className="text-sm font-normal text-blue-700 cursor-pointer">
              why?
            </span>
          </p>
        )}
      </main>

    </div>
  );
}
