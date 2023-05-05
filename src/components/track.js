import Moment from "react-moment";

export function PlaylistHeader({ img, title, description, author }) {
  return (
    <div className="flex items-end mb-6 md:mb-10">
      <img
        src={img}
        style={{ height: "200px", width: "200px" }}
        alt={`Playlist Picture for ${title}`}
      />

      <div className="ml-4 text-left">
        <span className="text-sm font-bold">Playlist</span>
        <h3 className="font-bold text-2xl sm:text-5xl mt-3">{title}</h3>
        <div className="mt-4">
          <span className="text-sm text-gray-300">{description}</span>
        </div>
      </div>
    </div>
  );
}

export default function Track({
  order,
  album,
  date,
  duration,
  img,
  title,
  authors,
  link,
}) {
  return (
    <a href={link} className="cursor-pointer">
      <div className="flex mb-4 overflow-auto">
        <span className="text-slate-600 font-bold mr-2">{order}</span>
        <div className="w-full">
          <div className="flex justify-between">
            <div className="flex">
              <div className="block">
                <img
                  src={img}
                  style={{ height: "40px", width: "40px" }}
                  alt={`Track Picture for ${title}`}
                  className="block"
                />
              </div>
              <div className="ml-3 flex flex-col justify-between w-[300px]">
                <span className="text-sm sm:text-md font-semibold text-left truncate w-full">
                  {title}
                </span>
                <div className="text-xs text-left truncate w-full">
                  {authors.map((author, idx) => (
                    <>
                      <a
                        className="hover:text-blue-400 hover:underline"
                        href={author.href}
                        key={author.href}
                      >
                        {author.name}
                      </a>

                      {idx < authors.length - 1 ? <span>, </span> : <></>}
                    </>
                  ))}
                </div>
              </div>
            </div>

            <span className="hidden md:block truncate text-xs self-center text-left w-[200px]">
              {album}
            </span>

            <span className="hidden md:block text-left text-xs sm:text-sm self-center w-[100px]">
              <Moment format="MMM D, YYYY">{date}</Moment>
            </span>

            <span className="text-right self-center text-xs sm:text-sm">
              {duration}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
