"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          to: 'reuvenharrison@oasdiff.com'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-[var(--foreground)]">Contact Us</h1>
        <p className="text-lg text-[var(--foreground)]/80">
          Get in touch with us for any questions or feedback
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[var(--background-card)] text-[var(--foreground)] border-[var(--background-hover)]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[var(--background-card)] text-[var(--foreground)] border-[var(--background-hover)]"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Subject
            </label>
            <Input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full bg-[var(--background-card)] text-[var(--foreground)] border-[var(--background-hover)]"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              className="w-full rounded-md bg-[var(--background-card)] text-[var(--foreground)] border border-[var(--background-hover)] p-3"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full px-4 py-2 rounded font-medium bg-emerald-600 text-[var(--foreground)] hover:bg-emerald-700 disabled:bg-[var(--background-dark)] disabled:text-[var(--foreground)]/40 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'success' && (
            <p className="text-emerald-500 text-center">Message sent successfully!</p>
          )}
          {status === 'error' && (
            <p className="text-red-500 text-center">Failed to send message. Please try again.</p>
          )}
        </form>
      </Card>
    </div>
  );
} 