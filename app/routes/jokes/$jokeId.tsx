import type { Joke } from '@prisma/client'
import { Link, LoaderFunction } from 'remix'

import { useLoaderData } from 'remix'

import { db } from '~/utils/db.server'

type LoaderData = { joke: Joke }

export const loader: LoaderFunction = async ({ params }) => {
  const joke = await db.joke.findUnique({ where: { id: params.jokeId } })

  if (!joke) throw new Error('Joke not found')

  const data: LoaderData = { joke }

  return data
}

const JokeRoute = () => {
  const { joke } = useLoaderData<LoaderData>()
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      <Link to=".">{joke.name} Permalink</Link>
    </div>
  )
}

export default JokeRoute
