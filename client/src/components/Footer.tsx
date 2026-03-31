import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, Send } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  return (
    <footer className="bg-foreground text-background mt-auto border-t border-border/40">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg">Hugo Media</h3>
            <p className="text-sm opacity-80">{t("footer.brandDesc")}</p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="hover:opacity-70 transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="hover:opacity-70 transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="hover:opacity-70 transition">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://t.me/hugo_media_shop" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wide">{t("footer.categories")}</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <button onClick={() => navigate("/catalog/laptops")} className="hover:opacity-100 transition">
                  {t("header.laptops")}
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/catalog/monitors")} className="hover:opacity-100 transition">
                  {t("header.monitors")}
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/catalog/accessories")} className="hover:opacity-100 transition">
                  {t("header.accessories")}
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/catalog/tablets")} className="hover:opacity-100 transition">
                  {t("header.tablets")}
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wide">{t("footer.support")}</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <button onClick={() => navigate("/about")} className="hover:opacity-100 transition">
                  {t("footer.contactUs")}
                </button>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  {t("footer.shippingInfo")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  {t("footer.returns")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  {t("footer.faq")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Telegram */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wide">Контакти</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+48123456789" className="hover:opacity-100 transition">
                  +48 123 456 789
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@hugomedia.pl" className="hover:opacity-100 transition">
                  info@hugomedia.pl
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Варшава, Польща</span>
              </li>
              <li className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                <a href="https://t.me/hugo_media_shop" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition">
                  Офіційний канал
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-xs opacity-70 gap-4">
          <p>{t("footer.copyright")}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:opacity-100 transition">
              {t("footer.privacyPolicy")}
            </a>
            <a href="#" className="hover:opacity-100 transition">
              {t("footer.termsOfService")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
