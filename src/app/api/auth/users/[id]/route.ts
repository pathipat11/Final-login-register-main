import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb'; // ฟังก์ชันเชื่อมต่อ MongoDB
import User from '@/models/User'; // Model ของผู้ใช้

// GET - ดึงข้อมูลผู้ใช้ทั้งหมด
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await connectMongo();
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
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
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;  // Get ID from params
    const body = await request.json(); // Get request body
    await connectMongo(); 

    // Update user
    const updatedUser = await User.findByIdAndUpdate(id, {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      updatedAt: new Date(),
    }, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update user', error }, { status: 500 });
  }
}




// DELETE - ลบข้อมูลผู้ใช้
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await connectMongo();

    // ลบผู้ใช้ที่มี id ตามที่ส่งมา
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete user', error }, { status: 500 });
  }
}