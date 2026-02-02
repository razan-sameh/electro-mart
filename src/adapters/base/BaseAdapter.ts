// adapters/base/BaseAdapter.ts
import { IDataAdapter } from "../interfaces/interfaces";

export abstract class BaseAdapter<TSource, TTarget> implements IDataAdapter<
  TSource,
  TTarget
> {
  constructor() {}

  abstract adapt(source: TSource): TTarget;

  adaptMany(sources: TSource[]): TTarget[] {
    return sources.map((source) => this.adapt(source));
  }

  protected handleNullUndefined<T>(
    value: T | null | undefined,
    fallback: T,
  ): T {
    return value ?? fallback;
  }
}
