export const initialState = {
  stockData: [],
  email: "",
  errorMessage: null
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_STOCK_REQUEST":
      return {
        ...state,
        errorMessage: null,
        searchValue: action.payload
      };
    
    case "SET_EMAIL":
      return{
        ...state,
        email: action.payload
      }
    case "SEARCH_STOCK_SUCCESS":
      return {
        ...state,
        stockData: action.payload.data,
        email: action.payload.email
      };
    case "SEARCH_STOCK_FAILURE":
      return {
        ...state,
        errorMessage: action.error
      };
    default:
      return state;
  }
};
