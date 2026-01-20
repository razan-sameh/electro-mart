type State = {
  quantity: number;
  selectedAttributes: Record<string, string>;
};

type Action =
  | { type: "INCREASE" }
  | { type: "DECREASE" }
  | { type: "SET_QUANTITY"; payload: number }
  | {
      type: "SELECT_ATTRIBUTE";
      payload: Record<string, string>; // <-- هنا
    };

export function cartItemReducer(state: State, action: Action): State {
  switch (action.type) {
    case "INCREASE":
      return { ...state, quantity: state.quantity + 1 };

    case "DECREASE":
      return { ...state, quantity: Math.max(1, state.quantity - 1) };

    case "SET_QUANTITY":
      return {
        ...state,
        quantity: action.payload > 0 ? action.payload : 1,
      };

    case "SELECT_ATTRIBUTE":
      return {
        ...state,
        selectedAttributes: action.payload,
      };

    default:
      return state;
  }
}
