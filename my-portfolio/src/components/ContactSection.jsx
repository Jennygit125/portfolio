import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/util";
import { api } from "@/lib/axiosConfig";

const contactItems = [
  {
    label: "Email",
    value: "thrill.codex@gmail.com",
    href: "mailto:thrill.codex@gmail.com",
    icon: Mail,
  },
  {
    label: "Phone",
    value: "+2348111321606",
    href: "tel:+2348111321606",
    icon: Phone,
  },
  {
    label: "Location",
    value: "Lagos, Nigeria",
    icon: MapPin,
  },
];

export const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    setIsSubmitting(true);

    try {
      await api.post(
        "/contact",
        {
          name,
          email,
          message,
        },
      );

      toast.success("Message sent. Thank you, I'll get back to you soon.");
      form.reset();
    } catch (error) {
      toast.error("Sorry, the message could not be sent. Please try again.");
      console.error("Contact form submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <section id="contact" className="relative bg-secondary/60 px-4 py-20 md:py-24">
      <div className="container mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
          Get in <span className="text-primary">Touch</span>
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
          Have a project in mind or a dream you want to make reality? Feel free
          to reach out. I'm always open to discussing new opportunities and
          collaborations.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-12">
          <div className="space-y-8 text-left">
            <div>
              <h3 className="mb-6 text-2xl font-semibold">Contact Information</h3>
              <div className="space-y-5">
                {contactItems.map(({ label, value, href, icon: Icon }) => {
                  const content = (
                    <>
                      <h4 className="font-medium text-foreground">{label}</h4>
                      <span className="wrap-break-words text-muted-foreground transition-colors group-hover:text-primary">
                        {value}
                      </span>
                    </>
                  );

                  return (
                    <div key={label} className="flex items-start gap-4">
                      <div className="shrink-0 rounded-full bg-primary/10 p-3">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      {href ? (
                        <a className="group min-w-0" href={href}>
                          {content}
                        </a>
                      ) : (
                        <div className="min-w-0">{content}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-medium">Connect with me on:</h4>
              <div className="flex gap-3">
                <a
                  href="https://github.com/Jennygit125"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub profile"
                  className="rounded-full border border-border bg-card p-3 text-foreground/80 transition-colors hover:border-primary hover:text-primary"
                >
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.72-4.03-1.42-4.03-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.66-.31-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 5.8c1.02.01 2.05.14 3.01.41 2.29-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
                  </svg>
                </a>
                <a
                  href="mailto:thrill.codex@gmail.com"
                  aria-label="Send an email"
                  className="rounded-full border border-border bg-card p-3 text-foreground/80 transition-colors hover:border-primary hover:text-primary"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <form
            className="space-y-6 rounded-lg border border-border bg-card p-5 text-left shadow-xs sm:p-8"
            onSubmit={handleSubmit}
          >
            <h3 className="text-2xl font-semibold">Send a message</h3>

            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full rounded-md border border-input bg-background px-4 py-3 outline-hidden transition focus:ring-2 focus:ring-primary"
                placeholder="Golden Goodlucks"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full rounded-md border border-input bg-background px-4 py-3 outline-hidden transition focus:ring-2 focus:ring-primary"
                placeholder="gold@gmail.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full resize-none rounded-md border border-input bg-background px-4 py-3 outline-hidden transition focus:ring-2 focus:ring-primary"
                placeholder="Hello, I'd like to talk about..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "starry-button flex w-full items-center justify-center gap-2",
                isSubmitting && "cursor-not-allowed opacity-70",
              )}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
