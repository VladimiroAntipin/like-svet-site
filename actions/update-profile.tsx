"use client";

import { getToken } from "@/lib/token";

const CMS_URL = process.env.NEXT_PUBLIC_API_URL; 

interface UpdateCustomerPayload {
  firstName?: string;
  lastName?: string;
  password?: string;
  birthDate?: string;
  profileImage?: string;
  balance?: number;
}

export async function updateCustomer(data: UpdateCustomerPayload) {
  const token = getToken();
  if (!token) throw new Error("User not authenticated");

  const res = await fetch(`${CMS_URL}/auth/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return res.json();
}