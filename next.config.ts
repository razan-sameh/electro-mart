import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vmcypnenslolrpkhzkrm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // cache optimized images for 1 year
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
