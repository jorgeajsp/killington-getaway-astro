import { useState } from 'react';

export default function PressInquiryForm() {
  const [form, setForm] = useState({ name: '', outlet: '', email: '', deadline: '', inquiry: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-brand-navy rounded-[3.5rem] p-16 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full -mr-32 -mt-32 blur-2xl" />
        <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center text-3xl mx-auto mb-8 shadow-xl">✅</div>
        <h3 className="text-3xl font-heading font-black text-white uppercase tracking-tight mb-4">Inquiry Received</h3>
        <p className="text-white/60 text-lg font-medium mb-10 max-w-lg mx-auto leading-relaxed">
          We'll be in touch within 24 hours. If your deadline is urgent, call 949-436-7669 directly.
        </p>
        <button onClick={() => setSubmitted(false)} className="text-[10px] font-black text-brand-green uppercase tracking-[0.3em] hover:text-white transition-colors">Send another inquiry</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-gray-50/50 p-10 lg:p-16 rounded-[4rem] border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-brand-navy/30 uppercase tracking-[0.2em] ml-4">Your Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-8 py-5 bg-white border border-gray-100 rounded-full text-brand-navy font-bold focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10 transition-all"
            placeholder="Jane Smith"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-brand-navy/30 uppercase tracking-[0.2em] ml-4">Media Outlet *</label>
          <input
            type="text"
            required
            value={form.outlet}
            onChange={(e) => setForm({ ...form, outlet: e.target.value })}
            className="w-full px-8 py-5 bg-white border border-gray-100 rounded-full text-brand-navy font-bold focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10 transition-all"
            placeholder="Boston Globe, WCVB, etc."
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-brand-navy/30 uppercase tracking-[0.2em] ml-4">Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-8 py-5 bg-white border border-gray-100 rounded-full text-brand-navy font-bold focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10 transition-all"
            placeholder="jane@outlet.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-brand-navy/30 uppercase tracking-[0.2em] ml-4">Deadline</label>
          <input
            type="text"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="w-full px-8 py-5 bg-white border border-gray-100 rounded-full text-brand-navy font-bold focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10 transition-all"
            placeholder="e.g. Tuesday 5pm ET"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-brand-navy/30 uppercase tracking-[0.2em] ml-4">Inquiry *</label>
        <textarea
          required
          value={form.inquiry}
          onChange={(e) => setForm({ ...form, inquiry: e.target.value })}
          rows={6}
          className="w-full px-8 py-6 bg-white border border-gray-100 rounded-[2.5rem] text-brand-navy font-bold focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10 transition-all resize-none"
          placeholder="What would you like to discuss? story angle, specific data or quotes..."
        />
      </div>
      <button
        type="submit"
        className="w-full md:w-auto bg-brand-navy text-white font-black px-12 py-5 rounded-full hover:bg-brand-green transition-all shadow-xl uppercase tracking-widest text-xs"
      >
        Send Inquiry
      </button>
    </form>
  );
}
