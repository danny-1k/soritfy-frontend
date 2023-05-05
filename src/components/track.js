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
                />
              </div>
              <div className="ml-3 flex flex-col justify-between ">
                <span className="text-sm sm:text-md font-semibold text-left w-[150px] truncate">
                  {title}
                </span>
                <div className="text-xs text-left w-[300px]">
                  {authors.map((author) => (
                    <>
                      <a
                        className="hover:text-blue-400 hover:underline"
                        href={author.href}
                        key={author.href}
                      >
                        {author.name}
                      </a>
                      <span>, </span>
                    </>
                  ))}
                </div>
              </div>
            </div>

            <span className="w-[50px] sm:w-[200px] truncate text-sm self-center">
              {album}
            </span>

            <span className="text-right text-sm self-center">
              <Moment format="MMM D, YYYY">{date}</Moment>
            </span>

            <span className="text-right text-sm self-center">{duration}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
