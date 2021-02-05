export const initialState = {
  stockData: [],
  email: "",
  errorMessage: null
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_STOCK_REQUEST":
      console.log("Action ",action.payload)
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
    console.log("EMAILstate ",action.payload.email)
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
