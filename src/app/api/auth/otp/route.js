import { NextResponse } from 'next/server';
import * as Brevo from '@getbrevo/brevo';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import logger from '@/lib/logger';

export async function POST(req) {
  logger.info({ file: 'src/app/api/auth/otp/route.js', function: 'POST' }, 'OTP route triggered');
  const { email } = await req.json();
  logger.info({ file: 'src/app/api/auth/otp/route.js', function: 'POST', email }, 'Processing OTP request for email');

  if (!email) {
    logger.warn({ file: 'src/app/api/auth/otp/route.js', function: 'POST' }, 'Email is required');
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

  await dbConnect();

  try {
    let user = await User.findOne({ email });

    if (user) {
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
      logger.info({ file: 'src/app/api/auth/otp/route.js', function: 'POST', email }, 'Updated OTP for existing user');
    } else {
      user = await User.create({ email, otp, otpExpires });
      logger.info({ file: 'src/app/api/auth/otp/route.js', function: 'POST', email }, 'Created new user and generated OTP');
    }

    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "Your OTP for ATS-Friendly Resume Builder";
    sendSmtpEmail.htmlContent = `<html><body><h1>Your OTP is ${otp}</h1></body></html>`;
    sendSmtpEmail.sender = { name: "ATS-Friendly Resume Builder", email: process.env.BREVO_SENDER_EMAIL };
    sendSmtpEmail.to = [{ email }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    logger.info({ file: 'src/app/api/auth/otp/route.js', function: 'POST', email }, 'OTP sent successfully');

    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error) {
    logger.error({ file: 'src/app/api/auth/otp/route.js', function: 'POST', error: error.message }, 'OTP sending error');
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
