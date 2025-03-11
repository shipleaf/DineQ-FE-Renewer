import React from 'react'

export default function FooterButton() {
  return (
    <div className='fixed bottom-4 w-full flex justify-between items-center px-6'>
      <button className='bg-[#F0F0F0] w-[33%] py-4 text-lg text-[#2a2a2a] rounded-[10px] font-[700]'>주문내역</button>
      <button className='bg-[#35CAF4] w-[64%] py-4 px-12 text-white font-[700] text-lg rounded-[10px]'>장바구니</button>
    </div>
  )
}
