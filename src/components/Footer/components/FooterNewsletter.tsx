"use client";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function FooterNewsletter() {
  const t = useTranslations("Footer");

  return (
    <div>
      <h3 className="font-semibold mb-3">{t("newsletter")}</h3>
      <form className="flex items-center mb-4">
        <input
          type="email"
          placeholder={t("placeholder")}
          className="flex-1 border border-lightGray rounded-md px-3 py-2 
                     focus:outline-none focus:ring focus:ring-blue-400 
                     bg-lightGray text-content"
        />
      </form>
      <div className="flex space-x-4">
        <a href="#" aria-label="Facebook">
          <FaFacebookF className="text-xl text-icon hover:text-blue-600" />
        </a>
        <a href="#" aria-label="Instagram">
          <FaInstagram className="text-xl text-icon hover:text-pink-500" />
        </a>
        <a href="#" aria-label="Twitter">
          <FaTwitter className="text-xl text-icon hover:text-blue-400" />
        </a>
      </div>
    </div>
  );
}
