import { typProduct, typProductVariant } from "@/content/types";
import React, { useCallback } from "react";

type Props = {
  product: typProduct;
  attributesMap: Record<string, Set<string>>;
  state: any;
  dispatch: any;
};

function ProductAttributes({
  product,
  attributesMap,
  state,
  dispatch,
}: Props) {

  const getHexCode = useCallback(
    (variants: typProductVariant[], attribute: string, value: string) => {
      const variant = variants.find((v) =>
        v.attributes.some((a) => a.attribute === attribute && a.value === value)
      );

      return variant?.attributes.find(
        (a) => a.attribute === attribute && a.value === value
      )?.hexCode;
    },
    []
  );

    const isValueAvailable = useCallback(
    (
      variants: typProductVariant[],
      selectedAttributes: Record<string, string>,
      currentAttribute: string,
      value: string
    ) => {
      return variants.some((variant) => {
        return variant.attributes.every((attr) => {
          if (attr.attribute === currentAttribute) {
            return attr.value === value;
          }
          return selectedAttributes[attr.attribute] === attr.value;
        });
      });
    },
    []
  );

  const getNextValidSelection = useCallback(
    (
      variants: typProductVariant[],
      selectedAttributes: Record<string, string>,
      currentAttribute: string,
      value: string
    ) => {
      const newSelection = { ...selectedAttributes, [currentAttribute]: value };

      const validVariant = variants.find((variant) =>
        variant.attributes.every(
          (attr) => newSelection[attr.attribute] === attr.value
        )
      );

      if (validVariant) return newSelection;

      const fallback = variants.find((variant) =>
        variant.attributes.some(
          (attr) => attr.attribute === currentAttribute && attr.value === value
        )
      );

      if (!fallback) return selectedAttributes;

      const updated: Record<string, string> = {};
      fallback.attributes.forEach((attr) => {
        updated[attr.attribute] = attr.value;
      });

      return updated;
    },
    []
  );

  return (
    <>
      {Object.keys(attributesMap).map((attribute) => (
        <div key={attribute} className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">{attribute}</h3>
          <div className="flex gap-2 flex-wrap">
            {Array.from(attributesMap[attribute]).map((value) => {
              const isAvailable = isValueAvailable(
                product.variants,
                state.selectedAttributes,
                attribute,
                value
              );

              const isSelected = state.selectedAttributes[attribute] === value;
              const code = getHexCode(product.variants, attribute, value);

              return attribute === "Color" ? (
                <button
                  key={value}
                  onClick={() => {
                    const updatedSelection = getNextValidSelection(
                      product.variants,
                      state.selectedAttributes,
                      attribute,
                      value
                    );

                    dispatch({
                      type: "SELECT_ATTRIBUTE",
                      payload: updatedSelection,
                    });
                  }}
                  className={`w-10 h-10 rounded-full border-2 transition flex items-center justify-center
                    ${isSelected ? "border-primary" : "border-gray-300"}
                    ${!isAvailable ? "opacity-40 cursor-not-allowed" : ""}
                  `}
                  style={{ backgroundColor: code }}
                  title={value}
                />
              ) : (
                <button
                  key={value}
                  onClick={() => {
                    const updatedSelection = getNextValidSelection(
                      product.variants,
                      state.selectedAttributes,
                      attribute,
                      value
                    );

                    dispatch({
                      type: "SELECT_ATTRIBUTE",
                      payload: updatedSelection,
                    });
                  }}
                  className={`px-3 py-2 rounded-md border transition
                    ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-gray-300"
                    }
                    ${!isAvailable ? "opacity-40 cursor-not-allowed" : ""}
                  `}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}

export default React.memo(ProductAttributes);
