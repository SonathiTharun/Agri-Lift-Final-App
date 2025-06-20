
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";

const initialState = { name: "", email: "", message: "" };

const Contact = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState(initialState);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // validation
    if (!form.name || !form.email || !form.message) {
      toast({
        title: t("missing-information"),
        description: t("fill-all-fields"),
        variant: "destructive"
      });
      return;
    }
    toast({
      title: t("message-sent"),
      description: t("thank-you-message")
    });
    setForm(initialState);
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-3xl py-10 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-6 w-6 text-foliage" />
              {t('contact-us')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="mb-2 text-gray-700">{t('contact-description')}</p>
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <Badge className="flex items-center gap-1 bg-foliage text-white">
                  <Phone className="h-4 w-4" /> +91 98765 43210
                </Badge>
                <Badge className="flex items-center gap-1 bg-foliage text-white">
                  <Mail className="h-4 w-4" /> support@agrilift.com
                </Badge>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                name="name"
                placeholder={t('your-name')}
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder={t('your-email')}
                value={form.email}
                onChange={handleChange}
                required
              />
              <Textarea
                name="message"
                rows={5}
                placeholder={t('how-can-help')}
                value={form.message}
                onChange={handleChange}
                required
                className="resize-none"
              />
              <Button className="bg-foliage hover:bg-foliage-dark">{t('send-message')}</Button>
            </form>
            <div className="mt-8 text-sm text-gray-500">
              {t('support-response')}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Contact;
