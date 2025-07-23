export default function Spinner() {
  return (
    <div className="flex justify-center gap-1 py-10 ">
      <div className="w-2 h-2 bg-gray-200 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:.1s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:.2s]"></div>
    </div>
  );
}
