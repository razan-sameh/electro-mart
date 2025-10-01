import { typColor } from "@/content/types";

// State type
type State = {
  quantity: number;
  selectedColor?: typColor;
};

// Actions
type Action =
  | { type: "INCREASE" }
  | { type: "DECREASE" }
  | { type: "SET_QUANTITY"; payload: number }
  | { type: "SELECT_COLOR"; payload: typColor };

// Reducer function
export function cartItemReducer(state: State, action: Action): State {
  switch (action.type) {
    case "INCREASE":
      return { ...state, quantity: state.quantity + 1 };
    case "DECREASE":
      return { ...state, quantity: Math.max(1, state.quantity - 1) };
    case "SET_QUANTITY":
      return { ...state, quantity: action.payload > 0 ? action.payload : 1 };
    case "SELECT_COLOR":
      return { ...state, selectedColor: action.payload };
    default:
      return state;
  }
}