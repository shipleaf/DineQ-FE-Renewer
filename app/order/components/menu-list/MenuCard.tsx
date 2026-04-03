import Image from "next/image";
import React from "react";
import type { Menu } from "@/app/type/menu/menu";

type MenuCardProps = {
  menu: Menu;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
};

export default function MenuCard({ menu, onClick }: MenuCardProps) {
  return (
    <div data-menu-id={menu.menuId} onClick={onClick}>
      <div className="p-6 bg-white flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold break-words">{menu.menuName}</h3>
          <p className="text-sm font-semibold mt-2">
            {menu.menuPrice?.toLocaleString()} 원
          </p>
        </div>
        <div className="w-[140px] h-[100px] rounded-[10px] overflow-hidden flex-shrink-0 flex items-center justify-center">
          <Image
            src={menu.menuImage || "/DineQLogo.png"}
            alt=""
            width={140}
            height={100}
            className="w-full h-full object-cover"
            sizes="(max-width: 768px) 140px, 140px"
          />
        </div>
      </div>
      <div className="bg-[#F0F0F0] h-0.5" />
    </div>
  );
}
