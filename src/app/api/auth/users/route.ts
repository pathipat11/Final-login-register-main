import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb'; // ฟังก์ชันเชื่อมต่อ MongoDB
import User from '@/models/User'; // Model ของผู้ใช้

// GET - ดึงข้อมูลผู้ใช้ทั้งหมด
export async function GET() {
  try {
    await connectMongo(); // เชื่อมต่อกับ MongoDB

    // ดึงข้อมูลผู้ใช้ทั้งหมดจาก MongoDB
    const users = await User.find({});

    // ส่งข้อมูลกลับไปในรูปแบบ JSON
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch users', error }, { status: 500 });
  }
}

// POST - เพิ่มผู้ใช้ใหม่
export async function POST(request: Request) {
  try {
    const body = await request.json(); // ดึงข้อมูลจาก request body
    await connectMongo(); // เชื่อมต่อกับ MongoDB

    // สร้างผู้ใช้ใหม่
    const newUser = new User(body);
    await newUser.save(); // บันทึกผู้ใช้ใหม่ในฐานข้อมูล

    return NextResponse.json({ user: newUser }, { status: 201 }); // ตอบกลับพร้อมข้อมูลผู้ใช้ที่ถูกสร้าง
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create user', error }, { status: 500 });
  }
}

// PUT - อัปเดตข้อมูลผู้ใช้
export async function PUT(request: Request) {
  try {
    const body = await request.json();  // ดึงข้อมูลจาก request body
    console.log('Request Body:', body);  // เช็คข้อมูลที่ถูกส่งมา

    await connectMongo();  // เชื่อมต่อ MongoDB

    const updatedUser = await User.findByIdAndUpdate(
      body.id,  // ใช้ id จาก body
      {
        email: body.email,        // อัปเดต email
        username: body.username,  // อัปเดต username
        firstName: body.firstName,  // อัปเดต firstName
        lastName: body.lastName,    // อัปเดต lastName
        updatedAt: new Date(),    // อัปเดตเวลา
      },
      { new: true }  // ให้คืนค่าผลลัพธ์ที่อัปเดตใหม่
    );

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    console.log('Updated User:', updatedUser);  // เช็คข้อมูลที่ถูกอัปเดตแล้ว

    return NextResponse.json({ user: updatedUser }, { status: 200 });

  } catch (error) {
    console.error('Failed to update user:', error.message);
    return NextResponse.json({ message: 'Failed to update user', error }, { status: 500 });
  }
}



// DELETE - ลบข้อมูลผู้ใช้
export async function DELETE(request: Request) {
  try {
    const body = await request.json(); // ดึงข้อมูลจาก request body
    await connectMongo(); // เชื่อมต่อกับ MongoDB

    // ลบผู้ใช้ที่มีอยู่โดยค้นหาตาม _id
    await User.findByIdAndDelete(body.id);

    return NextResponse.json({ message: 'User deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete user', error }, { status: 500 });
  }
}