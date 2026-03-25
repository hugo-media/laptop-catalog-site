import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 bg-background/95 backdrop-blur-md z-50">
        <div className="container py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663402378754/DMLwym6Zv6yd8JHAqkjkFj/hugo-media-logo_da9d05f5.jpg" 
                alt="Hugo Media" 
                className="h-12 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground">Hugo Media</h1>
                <p className="text-xs text-muted-foreground">Premium Laptop Solutions</p>
              </div>
            </div>

            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              size="sm"
              className="border-accent/30 hover:bg-accent/5"
            >
              {t('about.backToCatalog')}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-accent/10 to-background py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('about.title')}
            </h1>
            <p className="text-xl text-accent font-semibold mb-6">
              {t('about.subtitle')}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('about.intro')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {t('about.missionTitle')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {t('about.missionDesc')}
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{t('about.value1Title')}</h3>
                    <p className="text-muted-foreground">{t('about.value1Desc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{t('about.value2Title')}</h3>
                    <p className="text-muted-foreground">{t('about.value2Desc')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg p-12 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-accent/20 mb-4">Hugo Media</div>
                <p className="text-muted-foreground">{t('about.subtitle')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-background/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            {t('about.valuesTitle')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/40">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-accent/10 mb-6">
                    <CheckCircle2 className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {t(`about.value${i}Title`)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(`about.value${i}Desc`)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            {t('about.whyChooseTitle')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-start gap-4 p-6 rounded-lg border border-border/40 hover:border-accent/30 transition-colors">
                <ArrowRight className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                <p className="text-foreground leading-relaxed">
                  {t(`about.whyChoose${i}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-accent/10 to-accent/5">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              {t('about.contactTitle')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t('about.contactDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/')} 
                className="bg-accent hover:bg-accent/90"
              >
                {t('about.backToCatalog')}
              </Button>
              <Button 
                variant="outline"
                className="border-accent/30 hover:bg-accent/5"
              >
                {t('footer.contactUs')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t('footer.brand')}</h3>
              <p className="text-sm text-muted-foreground">{t('footer.brandDesc')}</p>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t('footer.support')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">{t('footer.contactUs')}</a></li>
                <li><a href="#" className="hover:text-foreground">{t('footer.shippingInfo')}</a></li>
                <li><a href="#" className="hover:text-foreground">{t('footer.returns')}</a></li>
                <li><a href="#" className="hover:text-foreground">{t('footer.faq')}</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t('footer.legal')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">{t('footer.privacyPolicy')}</a></li>
                <li><a href="#" className="hover:text-foreground">{t('footer.termsOfService')}</a></li>
                <li><a href="#" className="hover:text-foreground">{t('footer.cookiePolicy')}</a></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t('footer.categories')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/" className="hover:text-foreground">{t('categories.new')}</a></li>
                <li><a href="/" className="hover:text-foreground">{t('categories.monitors')}</a></li>
                <li><a href="/" className="hover:text-foreground">{t('categories.business')}</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
