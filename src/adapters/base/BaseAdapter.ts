// adapters/base/BaseAdapter.ts
import { IDataAdapter } from "../interfaces/interfaces";
import { StrapiImage } from "../interfaces/types";

export abstract class BaseAdapter<TSource, TTarget>
  implements IDataAdapter<TSource, TTarget>
{
  protected readonly STRAPI_URL: string;

  constructor(strapiUrl: string) {
    this.STRAPI_URL = strapiUrl;
  }

  abstract adapt(source: TSource): TTarget;

  adaptMany(sources: TSource[]): TTarget[] {
    return sources.map((source) => this.adapt(source));
  }

  protected handleNullUndefined<T>(
    value: T | null | undefined,
    fallback: T
  ): T {
    return value ?? fallback;
  }

  // Always returns an array
  protected adaptImageUrls(images?: StrapiImage | StrapiImage[]): string[] {
    if (!images) return [];

    const getFullUrl = (img: StrapiImage) =>
      img.url.startsWith("http") ? img.url : `${this.STRAPI_URL}${img.url}`;

    return Array.isArray(images)
      ? images.map(getFullUrl)
      : [getFullUrl(images)];
  }

  protected adaptImageUrlSingle(images?: StrapiImage | StrapiImage[]): string {
    if (!images) return "";

    const img = Array.isArray(images) ? images[0] : images;
    if (!img) return "";

    return img.url.startsWith("http")
      ? img.url
      : `${this.STRAPI_URL}${img.url}`;
  }
}
