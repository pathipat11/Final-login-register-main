import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectMongo();

    // รับข้อมูลจาก request body
    const { email, password, username, firstName, lastName } = await request.json();

    // ตรวจสอบความปลอดภัยของรหัสผ่าน
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/; // ต้องมีความยาวอย่างน้อย 5 ตัว, มีตัวอักษรและตัวเลข
    if (!passwordRegex.test(password)) {
      return NextResponse.json({ message: 'รหัสผ่านต้องมีอย่างน้อย 5 ตัวอักษรและต้องมีตัวเลขและตัวอักษร' }, { status: 400 });
    }

    // ตรวจสอบว่า email หรือ username มีอยู่ในระบบแล้วหรือไม่
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ message: 'อีเมล์นี้ลงทะเบียนไว้แล้ว' }, { status: 400 });
      }
      if (existingUser.username === username) {
        return NextResponse.json({ message: 'Username นี้ มีคนใช้ไปแล้ว' }, { status: 400 });
      }
    }
    // สร้างผู้ใช้ใหม่
    const newUser = new User({
      email,
      password,
      username,
      firstName,
      lastName
    });

    // บันทึกผู้ใช้ลงในฐานข้อมูล
    await newUser.save();

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });

  } catch (error: any) {
    console.error('Error during registration:', error);
    return NextResponse.json({ message: 'Registration failed', error: error.message || 'Unknown error' }, { status: 500 });
  }
}