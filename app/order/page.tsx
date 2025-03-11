import React from 'react'
import Header from '../common/Header'
import MenuList from './components/MenuList'
import FooterButton from './components/FooterButton'

export default function page() {
  return (
    <div>
      <Header />
      <MenuList />
      <FooterButton />
    </div>
  )
}
