import type { LinksFunction } from 'remix'

import { Outlet } from 'remix'

import stylesUrl from '../styles/jokes.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesUrl }
]

const JokesRoute = () => {
  return (
    <div>
      <h1>JOKES</h1>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default JokesRoute
