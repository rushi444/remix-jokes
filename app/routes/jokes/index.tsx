import type { Joke } from '@prisma/client'
import type { LoaderFunction } from 'remix'

import { useLoaderData, Link } from 'remix'

import { db } from '~/utils/db.server'

type LoaderData = { joke: Pick<Joke, 'id' | 'name' | 'content'> }

export const loader: LoaderFunction = async () => {
  const count = await db.joke.count()
  const randomRowNum = Math.floor(Math.random() * count)

  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNum,
    select: { id: true, name: true, content: true }
  })

  const data: LoaderData = {
    joke: randomJoke
  }
  return data
}

const JokesIndexRoute = () => {
  const { joke } = useLoaderData<LoaderData>()

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{joke.content}</p>
      <Link to={joke.id}>"{joke.name}" Permalink</Link>
    </div>
  )
}

export default JokesIndexRoute
