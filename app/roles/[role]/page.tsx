"use client"
import React from "react";
import { useParams } from "next/navigation";
import RoleList from "@/components/role-list/RoleList";

export default function RolePage() {
  const params = useParams();
  const role = params?.role as "nd" | "ss" | "db" | "retailer";

  if (!role) {
    return <div className="p-8">Role not specified</div>;
  }

  return (
    <div className="p-8">
      <RoleList role={role} />
    </div>
  );
}
