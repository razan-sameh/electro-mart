// adapters/base/BaseAdapter.ts
import { IDataAdapter } from "../interfaces/interfaces";
import { StrapiImage } from "../interfaces/types";

export abstract class BaseAdapter<TSource, TTarget> 
  implements IDataAdapter<TSource, TTarget> {
  
  protected readonly STRAPI_URL: string;
  
  constructor(strapiUrl: string) {
    this.STRAPI_URL = strapiUrl;
  }
  
  abstract adapt(source: TSource): TTarget;
  
  adaptMany(sources: TSource[]): TTarget[] {
    return sources.map(source => this.adapt(source));
  }

  protected handleNullUndefined<T>(value: T | null | undefined, fallback: T): T {
    return value ?? fallback;
  }

  // Handle both single image object and array of images
  protected adaptImageUrl(images?: StrapiImage | StrapiImage[]): string {
    if (!images) {
      return '';
    }

    // If it's an array
    if (Array.isArray(images)) {
      if (images.length === 0) {
        return '';
      }
      return `${this.STRAPI_URL}${images[0].url}`;
    }

    // If it's a single image object
    return `${this.STRAPI_URL}${images.url}`;
  }

}