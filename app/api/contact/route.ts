// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs'; // NodemailerはNodeランタイム必須
export const dynamic = 'force-dynamic'; // キャッシュ無効化（保険）

type Body = {
  name: string;
  email: string;
  message: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req: Request) {
  try {
    const { name, email, message } = (await req.json()) as Body;

    // バリデーション
    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 });
    }
    if (message.length > 500) {
      return NextResponse.json({ ok: false, error: 'Message too long' }, { status: 400 });
    }

    // SMTPトランスポート（Gmail）
    const transporter = nodemailer.createTransport({
      host: 'smtp.muumuu-mail.com',
      port: 465,
      secure: true, // 465はSSL/TLSなのでtrue
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const escapedName = escapeHtml(name);
    const escapedEmail = escapeHtml(email);
    const escapedMessage = escapeHtml(message);

    // Gmail/DMARC対策：From は自分のアドレス、replyTo に送信者を入れる
    await transporter.sendMail({
      envelope: {
        from: process.env.MAIL_USER,
        to: process.env.MAIL_TO!,
      },
      from: process.env.MAIL_FROM,       // 表示上のFrom（Gmailアドレス推奨）
      to: process.env.MAIL_TO,           // 受信先（自分）
      replyTo: `${name} <${email}>`,     // 返信先を送り主に
      subject: `お問い合わせ: ${name} さんより`,
      text: `お名前: ${name}\nメール: ${email}\n\n${message}`,
      html: `
        <h2>お問い合わせ</h2>
        <p><strong>お名前:</strong> ${escapedName}</p>
        <p><strong>メール:</strong> ${escapedEmail}</p>
        <p><strong>メッセージ:</strong></p>
        <pre style="white-space:pre-wrap;font-family:inherit">${escapedMessage}</pre>
      `,
    });

    await transporter.sendMail({
      envelope: {
        from: process.env.MAIL_USER,
        to: email,
      },
      from: process.env.MAIL_FROM,
      to: email,
      replyTo: process.env.MAIL_TO,
      subject: 'お問い合わせありがとうございます',
      text: `${name} 様\n\nお問い合わせいただきありがとうございます。\n必要に応じて回答いたします。\n\nこのメールは自動送信です。`,
      html: `
        <p>${escapedName} 様</p>
        <p>お問い合わせいただきありがとうございます。<br />必要に応じて回答いたします。</p>
        <p>このメールは自動送信です。</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] error:', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
