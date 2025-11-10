import React from "react";
import axios from "axios";
import List from "./components/List"
import InputWithLabel from "./components/InputWithLabel";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleFetchStories = React.useCallback(() => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });

    axios
      .get(url)
      .then((result) => {
        dispatchStories({
          type: "STORIES_FETCH_SUCCESS",
          payload: result.data.hits,
        });
      })
      .catch(() => dispatchStories({ type: "STORIES_FETCH_FAILURE" }));
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-3xl font-extrabold text-center text-gray-900">
        Hacker News Search
      </h1>

      <div className="flex flex-col
      sm:flex-row sm:items-end gap-4 justify-between">
        <InputWithLabel
          id="search"
          value={searchTerm}
          isFocused
          onInputChange={handleSearchInput}
        >
          <strong>Search:</strong>
        </InputWithLabel>

        <button
          type="button"
          disabled={!searchTerm}
          onClick={handleSearchSubmit}
          className={`px-4 py-2 rounded-md text-white font-semibold transition  ${
            searchTerm
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Search
        </button>
      </div>

      <hr className="border-gray-300" />

      {stories.isError && (
        <p className="text-red-600 font-semibold text-center">
          Something went wrong ...
        </p>
      )}

      <div>
        {stories.isLoading ? (
          <p className="text-center text-gray-600 text-lg font-medium">
            Loading ...
          </p>
        ) : (
          <List list={stories.data} onRemoveItem={handleRemoveStory} />
        )}
      </div>
    </div>
  );
};

export default App;
