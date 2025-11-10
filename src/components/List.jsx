const List = ({ list, onRemoveItem }) => (
  <ul className="space-y-4">
    {list.map((item) => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
);

const Item = ({ item, onRemoveItem }) => (
  <li className="flex flex-col sm:flex-row sm:items-center justify-between bg-white shadow-sm rounded-md p-4 hover:shadow-md transition">
    <div className="flex-1 min-w-0">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 font-semibold hover:underline block truncate"
      >
        {item.title}
      </a>
      <div className="mt-1 text-sm text-gray-500 flex flex-wrap gap-4">
        <span>By: <span className="font-medium text-gray-700">{item.author}</span></span>
        <span>Comments: <span className="font-medium text-gray-700">{item.num_comments}</span></span>
        <span>Points: <span className="font-medium text-gray-700">{item.points}</span></span>
      </div>
    </div>
    <button
      type="button"
      onClick={() => onRemoveItem(item)}
      className="mt-3 sm:mt-0 sm:ml-6 px-3 py-1 text-sm font-semibold text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition"
    >
      Dismiss
    </button>
  </li>
);

export default List;