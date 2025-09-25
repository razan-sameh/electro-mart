"use client";
import { useTranslations } from "next-intl";
import FooterBottom from "./components/FooterBottom";
import FooterLinks from "./components/FooterLinks";
import FooterNewsletter from "./components/FooterNewsletter";
import FooterSection from "./components/FooterSection";
import Container from "../Container";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-lightGray/40 border-t border-lightGray text-content text-sm mt-10">
      <Container>
        <div className="py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <FooterSection title={t("support")}>
            <p>{t("address.company")}</p>
            <p>{t("address.street")}</p>
            <p>{t("address.postal")}</p>
            <p>{t("address.country")}</p>
            <p className="mt-2">{t("address.phone")}</p>
            <p>{t("address.email")}</p>
          </FooterSection>

          <FooterSection title={t("workingHours")}>
            <p>{t("hours.monFri")}</p>
            <p>{t("hours.sat")}</p>
            <p>{t("hours.sun")}</p>
          </FooterSection>

          <FooterLinks
            title={t("aboutUs")}
            links={[
              { label: t("links.about.stores"), href: "#" },
              { label: t("links.about.corporate"), href: "#" },
              { label: t("links.about.offers"), href: "#" },
              { label: t("links.about.career"), href: "#" },
            ]}
          />

          <FooterLinks
            title={t("help")}
            links={[
              { label: t("links.help.center"), href: "#" },
              { label: t("links.help.payments"), href: "#" },
              { label: t("links.help.returns"), href: "#" },
              { label: t("links.help.faq"), href: "#" },
            ]}
          />

          <FooterNewsletter />
        </div>

        <FooterBottom />
      </Container>
    </footer>
  );
}
