"use client";

import Image from "next/image";
import React, { useRef } from "react";

export default function MenuList() {
  const Menu = [
    {
      categoryId: 1,
      name: "김치찌개",
      price: 8000,
      description: "돼지고기와 김치가 들어간 얼큰한 찌개",
      menuId: 1,
      imageUrl: null,
      available: true,
      image:
        "https://i.namu.wiki/i/8drgvI-cQLUfJDC00zbl2ZolK4W3o4ZkVSpR-zM5FZk_QzT58vYnx_7ohk0qwGYYiSLPiZgwccyIEFUtYKDjUQ.webp",
    },
    {
      categoryId: 1,
      name: "된장찌개",
      price: 7500,
      description: "구수한 된장과 두부가 들어간 찌개",
      menuId: 2,
      imageUrl: null,
      available: true,
      image:
        "https://img-cf.kurly.com/hdims/resize/%3E720x/quality/90/src/shop/data/goodsview/20230817/gv40000717636_1.jpg",
    },
    {
      categoryId: 1,
      name: "순두부찌개",
      price: 8500,
      description: "매콤한 순두부와 해물이 들어간 찌개",
      menuId: 3,
      imageUrl: null,
      available: true,
      image:
        "https://recipe1.ezmember.co.kr/cache/recipe/2019/03/01/cbdcad39283af740afd0e08f97849c7c1.jpg",
    },
    {
      categoryId: 2,
      name: "김치전",
      price: 7000,
      description: "매콤한 김치가 들어간 바삭한 전",
      menuId: 4,
      imageUrl: null,
      available: true,
      image:
        "https://homecuisine.co.kr/files/attach/images/140/334/028/1f943625e2d016afb9b5d287efccbff2.JPG",
    },
    {
      categoryId: 2,
      name: "해물파전",
      price: 12000,
      description: "해물과 파가 들어간 바삭한 전",
      menuId: 5,
      imageUrl: null,
      available: true,
      image:
        "https://lh6.googleusercontent.com/proxy/PBafhb0BW94k9npNU0BUAk4J_D0uQ2r-oSiB-RX7RW46iA9EcgB5ahv5QZ_1POxEUbpuWoiI-E_HJ8Z7AUWui0JYH3Dv99I1KausIYoOVr_ATskoSsADIf1p_a6lIb-8ZknjWi97Ghx8B70ZPw",
    },
    {
      categoryId: 2,
      name: "오징어튀김",
      price: 8000,
      description: "바삭한 오징어 튀김",
      menuId: 6,
      imageUrl: null,
      available: true,
      image: "https://i.ytimg.com/vi/kL_CwcHcFPw/maxresdefault.jpg",
    },
    {
      categoryId: 3,
      name: "제육볶음",
      price: 9000,
      description: "매콤한 돼지고기 볶음",
      menuId: 7,
      imageUrl: null,
      available: true,
      image:
        "https://i.ytimg.com/vi/aenoy50ea-s/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDBo72mS5KwzGx9vyzNjhYjspLpVQ",
    },
    {
      categoryId: 3,
      name: "오징어볶음",
      price: 9500,
      description: "매콤한 오징어 볶음",
      menuId: 8,
      imageUrl: null,
      available: true,
      image:
        "https://recipe1.ezmember.co.kr/cache/recipe/2019/01/04/518d5bf35102aa51bf58078f7a25dc751.jpg",
    },
    {
      categoryId: 3,
      name: "닭갈비",
      price: 10000,
      description: "매콤한 양념 닭볶음",
      menuId: 9,
      imageUrl: null,
      available: true,
      image:
        "https://recipe1.ezmember.co.kr/cache/recipe/2019/10/30/33398b219faa7448ed4130b8b70e18c01.jpg",
    },
    {
      categoryId: 4,
      name: "팥빙수",
      price: 7000,
      description: "달콤한 팥과 얼음이 어우러진 디저트",
      menuId: 10,
      imageUrl: null,
      available: true,
      image:
        "https://img.etoday.co.kr/pto_db/2022/08/600/20220802165156_1782994_1000_667.jpg",
    },
    {
      categoryId: 4,
      name: "호떡",
      price: 4000,
      description: "달콤한 시럽이 들어간 전통 간식",
      menuId: 11,
      imageUrl: null,
      available: true,
      image:
        "https://sahubconn001.blob.core.windows.net/ct-sahubconn001/img/newshop/goods/024537/024537_1.jpg",
    },
    {
      categoryId: 4,
      name: "붕어빵",
      price: 3000,
      description: "달콤한 팥이 들어간 길거리 간식",
      menuId: 12,
      imageUrl: null,
      available: true,
      image:
        "https://health.chosun.com/site/data/img_dir/2023/10/19/2023101901964_0.jpg",
    },
    {
      categoryId: 5,
      name: "아메리카노",
      price: 4000,
      description: "진한 에스프레소와 물이 어우러진 커피",
      menuId: 13,
      imageUrl: null,
      available: true,
      image:
        "https://i.namu.wiki/i/0b0dJEYZ4bGxZhArX5wWzYXc-SYmBOEdzZ5xIUejSXuPwF33J9VHyRd9KID4NzPdATz8SqvgDlUM-PUfIdRypA.webp",
    },
    {
      categoryId: 5,
      name: "카페라떼",
      price: 4500,
      description: "부드러운 우유가 들어간 커피",
      menuId: 14,
      imageUrl: null,
      available: true,
      image:
        "https://i.namu.wiki/i/OqOB5_xV7llI5RJUJu0i-x9-h56hujavzujAfYF-ROqG9Y5da7MlMK7ObBVwo-Ql4wlh8EuzIF40WUx2Zt2Xtw.webp",
    },
    {
      categoryId: 5,
      name: "녹차라떼",
      price: 5000,
      description: "진한 녹차와 우유의 조화",
      menuId: 15,
      imageUrl: null,
      available: true,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStPFpupCy_r9GKJIQF2yjs0NbodUx3pxvbQA&s",
    },
    {
      categoryId: 6,
      name: "소주",
      price: 5000,
      description: "한국에서 가장 인기 있는 증류주",
      menuId: 16,
      imageUrl: null,
      available: true,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2qYU93-vIfiMrgAwipogTf3dK-9CO2uM4jg&s",
    },
    {
      categoryId: 6,
      name: "맥주",
      price: 6000,
      description: "시원하고 청량한 보리 맥주",
      menuId: 17,
      imageUrl: null,
      available: true,
      image:
        "https://i.namu.wiki/i/Pmwui0NAM_3MuT3aRD56pC3zaETg2kxsKT4pUcrDGpf89LPOe5u7pv7OQ0mzjCJZvIqyeg42T3whIksRDSRxUw.webp",
    },
    {
      categoryId: 6,
      name: "막걸리",
      price: 7000,
      description: "부드럽고 달콤한 전통 막걸리",
      menuId: 18,
      imageUrl: null,
      available: true,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyfmXNljjhcxF5BA-E-quNb3Xip46kii1-dw&s",
    },
  ];

  const Category = {
    찌개: 1,
    전: 2,
    볶음: 3,
    디저트: 4,
    음료: 5,
    주류: 6,
  };

  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // 카테고리 버튼 클릭 시 해당하는 메뉴로 스크롤 이동
  const scrollToCategory = (categoryId: number) => {
    const targetElement = menuRefs.current[categoryId];
    const stickyHeader = document.querySelector(".sticky-header"); // 스티키 요소 선택

    if (targetElement) {
      const headerHeight = stickyHeader ? stickyHeader.clientHeight : 80; // 스티키 요소 높이 계산
      const targetOffset =
        targetElement.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({ top: targetOffset, behavior: "smooth" });
    }
  };

  return (
    <div className="pt-4">
      <div className="category p-4 sticky top-0 z-50 bg-white h-[80px]">
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide snap-x snap-mandatory">
          {Object.entries(Category).map(([categoryName, categoryId]) => (
            <button
              key={categoryId}
              className="px-4 py-2 bg-blue-500 text-white text-sm font-[700] rounded-lg hover:bg-blue-600 min-w-[70px] snap-start"
              onClick={() => scrollToCategory(Number(categoryId))}
            >
              {categoryName}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {Menu.map((menu) => {
          // 각 카테고리의 첫 번째 메뉴 요소만 ref에 저장
          if (!menuRefs.current[menu.categoryId]) {
            menuRefs.current[menu.categoryId] = null;
          }

          return (
            <div
              key={menu.menuId}
              ref={(el) => {
                if (!menuRefs.current[menu.categoryId]) {
                  menuRefs.current[menu.categoryId] = el;
                }
              }}
            >
              <div
                className={`p-6 bg-white flex justify-between items-start
                ${menu.menuId === Menu.length ? "pb-24" : ""}
                `}
              >
                <div className="flex flex-col h-full">
                  <h3 className="text-lg font-bold">{menu.name}</h3>
                  <p className="font-semibold text-sm">
                    {menu.price.toLocaleString()}원
                  </p>
                </div>
                <div className="w-[140px] h-[100px] rounded-[10px] overflow-hidden flex items-center justify-center">
                  <Image
                    src={menu.image}
                    alt=""
                    width={140}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="bg-[#F0F0F0] h-[2px]"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
