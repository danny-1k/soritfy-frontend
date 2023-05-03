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
                <img src={img} style={{ height: "40px", width: "40px" }} />
              </div>
              <div className="ml-3 flex flex-col justify-between max-w-[150px] truncate">
                <a className="text-sm sm:text-md font-semibold text-left">
                  {title}
                </a>
                <a className="text-xs text-left">{authors}</a>
              </div>
            </div>

            <div className="w-[50px] sm:w-[200px] truncate">{album}</div>
            <div className="text-right">{date}</div>
            <div className="text-right">{duration}</div>
          </div>
        </div>
      </div>
    </a>
  );
}
