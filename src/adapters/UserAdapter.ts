// File: adapters/BrandAdapter.ts
import { typUser } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiUser } from "./interfaces/types";
import { PhoneAdapter } from "./PhoneAdapter";

export class UserAdapter extends BaseAdapter<StrapiUser, typUser> {
  private static instance: UserAdapter;
  private phoneAdapter: PhoneAdapter;

  private constructor(strapiUrl: string) {
    super(strapiUrl);
    this.phoneAdapter = PhoneAdapter.getInstance(strapiUrl);
  }

  public static getInstance(strapiUrl: string): UserAdapter {
    if (!UserAdapter.instance) {
      UserAdapter.instance = new UserAdapter(strapiUrl);
    }
    return UserAdapter.instance;
  }

  adapt(source: StrapiUser): typUser {
    return {
      id: source.id,
      documentId: source.documentId,
      username: this.handleNullUndefined(source.username, ""),
      email: this.handleNullUndefined(source.email, ""),
      phone: source.phone ? this.phoneAdapter.adapt(source.phone) : undefined,
    };
  }
}
