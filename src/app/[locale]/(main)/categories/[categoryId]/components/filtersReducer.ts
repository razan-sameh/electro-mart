import { typProductFilters } from "@/content/types";

type FilterAction =
  | { type: "SET_COLOR"; payload: string }
  | { type: "SET_SPEC"; payload: string }
  | { type: "SET_PRICE"; payload: number }
  | { type: "CLEAR" }
  | { type: "SET_CATEGORY"; payload: string };

export const filtersReducer = (
  state: typProductFilters,
  action: FilterAction
): typProductFilters => {
  switch (action.type) {
    case "SET_COLOR":
      const colors = state.colorsId || [];
      return {
        ...state,
        colorsId: colors.includes(action.payload)
          ? colors.filter((id) => id !== action.payload)
          : [...colors, action.payload],
      };

    case "SET_SPEC":
      const specs = state.specificationValuesId || [];
      return {
        ...state,
        specificationValuesId: specs.includes(action.payload)
          ? specs.filter((id) => id !== action.payload)
          : [...specs, action.payload],
      };

    case "SET_PRICE":
      return {
        ...state,
        price: action.payload,
      };

    case "CLEAR":
      return { categoryId: state.categoryId }; // reset to only category

    case "SET_CATEGORY":
      return { ...state, categoryId: action.payload };

    default:
      return state;
  }
};
