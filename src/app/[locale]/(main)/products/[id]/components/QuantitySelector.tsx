import { FiMinus, FiPlus } from "react-icons/fi";

type Props = {
  quantity: number;
  dispatch: any;
};

export default function QuantitySelector({ quantity, dispatch }: Props) {
  return (
    <div className="flex items-center gap-3 mt-2">
      <button
        onClick={() => dispatch({ type: "DECREASE" })}
        className="px-3 py-2 border border-lightGray rounded-md"
      >
        <FiMinus />
      </button>

      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) =>
          dispatch({
            type: "SET_QUANTITY",
            payload: parseInt(e.target.value, 10) || 1,
          })
        }
        className="w-16 text-center border border-lightGray rounded-md py-1"
      />

      <button
        onClick={() => dispatch({ type: "INCREASE" })}
        className="px-3 py-2 border border-lightGray rounded-md"
      >
        <FiPlus />
      </button>
    </div>
  );
}
