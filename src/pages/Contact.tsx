
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";

const initialState = { name: "", email: "", message: "" };

const Contact = () => {
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
        title: "Missing information",
        description: "Please fill all fields!",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. We'll get back to you soon."
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
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="mb-2 text-gray-700">How can we assist you today? Fill out the form or use one of the direct contact methods below!</p>
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
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <Textarea
                name="message"
                rows={5}
                placeholder="How can we help you?"
                value={form.message}
                onChange={handleChange}
                required
                className="resize-none"
              />
              <Button className="bg-foliage hover:bg-foliage-dark">Send Message</Button>
            </form>
            <div className="mt-8 text-sm text-gray-500">
              Our support team responds within 24 hours. For urgent matters, please use the phone number above.
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Contact;
