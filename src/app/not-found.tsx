import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Ошибка 404</h2>
      <p>Запрашиваемой страницы не существует</p>
      <Link href="/">Вернуться на главную</Link>
    </div>
  )
}