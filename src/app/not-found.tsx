import Link from 'next/link'
import React from 'react'
export default function NotFound() {
  return (
    <div>
      <h2>Ошибка 404</h2>
      <p>Запрашиваемой страницы не существует</p>
      <Link href="/">Вернуться на главную</Link>
    </div>
  )
}