"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// ১. রেজিস্ট্রেশন ফাংশন
export async function registerUser(formData: any) {
  try {
    const { name, phoneNumber, password, image, division, district, upazila, union, pourashava, ward } = formData;

    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (existingUser) {
      return { error: "এই নম্বর দিয়ে ইতিমধ্যে একাউন্ট খোলা হয়েছে!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phoneNumber,
        password: hashedPassword,
        image,
        division,
        district,
        upazila,
        union,
        pourashava, // এখানে অ্যাড করুন
        ward,       // এখানে অ্যাড করুন
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Registration Error:", error);
    return { error: "রেজিস্ট্রেশন করতে সমস্যা হয়েছে।" };
  }
}


export async function updateUserProfile(data: any) {
  try {
    const { userId, name, image, password, newPassword } = data;

    if (!userId) return { success: false, error: "ইউজার আইডি নেই" };

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, error: "ইউজার পাওয়া যায়নি" };

    // আপডেট করার ডাটা অবজেক্ট
    const updateData: any = { 
      name: name,
      image: image // এখানে ক্লাউডিনারি বা আপনার আপলোড করা ইমেজ ইউআরএল আসবে
    };

    // পাসওয়ার্ড পরিবর্তনের লজিক
    if (password && newPassword) {
       const isMatch = await bcrypt.compare(password, user.password);
       if (!isMatch) return { success: false, error: "বর্তমান পাসওয়ার্ড ভুল" };
       updateData.password = await bcrypt.hash(newPassword, 10);
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (err) {
    return { success: false, error: "সার্ভারে সমস্যা হয়েছে" };
  }
}