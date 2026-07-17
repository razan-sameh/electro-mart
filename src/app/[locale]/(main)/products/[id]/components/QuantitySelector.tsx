import { FiMinus, FiPlus } from "react-icons/fi";

type Props = {
  quantity: number;
  dispatch: any;
  isOutOfStock: boolean;
};

export default function QuantitySelector({
  quantity,
  dispatch,
  isOutOfStock,
}: Props) {
  return (
    <div className="flex items-center gap-3 mt-2">
      <button
        aria-label="Decrease quantity"
        onClick={() => dispatch({ type: "DECREASE" })}
        disabled={isOutOfStock}
        className="px-3 py-2 border border-lightGray rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiMinus />
      </button>

      <input
        aria-label="Quantity"
        type="number"
        min={1}
        value={quantity}
        disabled={isOutOfStock}
        onChange={(e) =>
          dispatch({
            type: "SET_QUANTITY",
            payload: parseInt(e.target.value, 10) || 1,
          })
        }
        className="w-16 text-center border border-lightGray rounded-md py-1 disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <button
        aria-label="Increase quantity"
        onClick={() => dispatch({ type: "INCREASE" })}
        disabled={isOutOfStock}
        className="px-3 py-2 border border-lightGray rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiPlus />
      </button>
    </div>
  );
}
