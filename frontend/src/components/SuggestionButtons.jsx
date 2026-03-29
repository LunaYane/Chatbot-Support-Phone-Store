const suggestionList = [
  'Điện thoại dưới 10 triệu',
  'Điện thoại chơi game',
  'Điện thoại chụp ảnh đẹp',
  'Điện thoại pin trâu'
];

function SuggestionButtons({ onClickSuggestion }) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestionList.map((suggestionText) => (
        <button
          key={suggestionText}
          className="rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700 hover:bg-blue-200"
          onClick={() => onClickSuggestion(suggestionText)}
        >
          {suggestionText}
        </button>
      ))}
    </div>
  );
}

export default SuggestionButtons;
