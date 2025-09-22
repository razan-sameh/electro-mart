export interface IDataAdapter<TSource, TTarget> {
  adapt(source: TSource): TTarget;
  adaptMany(sources: TSource[]): TTarget[];
}