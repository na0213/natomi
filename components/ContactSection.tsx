'use client';

import { useState } from 'react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'お名前を入力してください';
        break;
      case 'email':
        if (!value.trim()) {
          error = 'メールアドレスを入力してください';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = '有効なメールアドレスを入力してください';
        }
        break;
      case 'message':
        if (!value.trim()) {
          error = 'メッセージを入力してください';
        } else if (value.length > 500) {
          error = 'メッセージは500文字以内で入力してください';
        }
        break;
    }
    
    return error;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitStatus('idle');
    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setIsConfirmOpen(false);
        setFormData({ name: '', email: '', message: '' });
        setErrors({});
      } else {
        setIsConfirmOpen(false);
        setSubmitStatus('error');
      }
    } catch {
      setIsConfirmOpen(false);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white scroll-mt-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl text-center mb-16 text-[#333]">れ　ん　ら　く</h2>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
            <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="form-field">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3be7ed]/20 transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="お名前を入力してください"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3be7ed]/20 transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="example@email.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  メッセージ <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  maxLength={500}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3be7ed]/20 transition-all resize-none ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="お問い合わせ内容をご記入ください"
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
                  <p className="text-sm text-gray-500 ml-auto">
                    {formData.message.length}/500文字
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center pt-4">
                <button type="submit" disabled={isSubmitting}
                  className="submit-btn w-1/3 bg-[#3be7ed] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#2dd4da] disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap">
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <i className="ri-loader-2-line animate-spin mr-2"></i>
                      送信中...
                    </span>
                  ) : (
                    '送信'
                  )}
                </button>
              </div>

              {submitStatus === 'success' && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm flex items-center">
                    <i className="ri-check-circle-line mr-2"></i>
                    メッセージを送信しました。お返事をお待ちください。
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm flex items-center">
                    <i className="ri-error-warning-line mr-2"></i>
                    送信に失敗しました。もう一度お試しください。
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {isConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-confirm-title"
        >
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl">
            <h3 id="contact-confirm-title" className="text-xl font-semibold text-[#333]">
              以下の内容で送信します。よろしいですか？
            </h3>

            <div className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div>
                <p className="text-xs font-semibold text-gray-500">お名前</p>
                <p className="mt-1 break-words text-sm text-gray-800">{formData.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">メールアドレス</p>
                <p className="mt-1 break-words text-sm text-gray-800">{formData.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">メッセージ</p>
                <p className="mt-1 max-h-48 overflow-y-auto whitespace-pre-wrap break-words text-sm leading-6 text-gray-800">
                  {formData.message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isSubmitting}
                className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                戻る
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="rounded-lg bg-[#3be7ed] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2dd4da] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <i className="ri-loader-2-line mr-2 animate-spin"></i>
                    送信中...
                  </span>
                ) : (
                  'この内容で送信'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
