import type { ActionFunction, LoaderFunction } from 'remix'

import {
  useActionData,
  redirect,
  useCatch,
  Link,
  useLoaderData,
  useTransition
} from 'remix'
import * as yup from 'yup'
import { ValidatedForm, withYup } from 'remix-validated-form'

import { InputField, SubmitButton, TextAreaField } from '~/components/forms'
import { requireUserId, getUserId } from '~/utils/session.server'
import { JokeDisplay } from '~/components/joke'
import { db } from '~/utils/db.server'

const validator = withYup(
  yup.object({
    name: yup
      .string()
      .required('Name is required')
      .min(2, `That joke's name is too short`),
    content: yup
      .string()
      .required('Content is required')
      .min(10, `That joke is too short`)
  })
)

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request)
  if (!userId) {
    throw new Response('Unauthorized', { status: 401 })
  }
  return {
    defaultValues: {
      name: '',
      content: ''
    }
  }
}

type ActionData = {
  formError?: string
  fieldErrors?: {
    name: string | undefined
    content: string | undefined
  }
  fields?: {
    name: string
    content: string
  }
}

export const action: ActionFunction = async ({
  request
}): Promise<Response | ActionData> => {
  const userId = await requireUserId(request)
  const form = await request.formData()

  const { data, error } = validator.validate(Object.fromEntries(form))
  if (error) {
    return {
      fieldErrors: {
        name: error?.name,
        content: error?.content
      }
    }
  }

  const { name, content } = data

  const joke = await db.joke.create({
    data: { name, content, jokesterId: userId }
  })
  return redirect(`/jokes/${joke.id}`)
}

const NewJokeRoute = () => {
  const { defaultValues } = useLoaderData()
  const actionData = useActionData<ActionData | undefined>()
  const transition = useTransition()

  if (transition.submission) {
    const name = transition.submission.formData.get('name') as string
    const content = transition.submission.formData.get('content') as string

    const { error } = validator.validate({ name, content })
    if (!error) {
      return (
        <JokeDisplay
          joke={{ name, content }}
          isOwner={true}
          canDelete={false}
        />
      )
    }
  }

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <ValidatedForm
        validator={validator}
        method="post"
        defaultValues={actionData?.fields || defaultValues}
      >
        <InputField name="name" label="Name: " />
        <TextAreaField name="content" label="Content: " />
        <SubmitButton />
      </ValidatedForm>
    </div>
  )
}

export const CatchBoundary = () => {
  const caught = useCatch()

  if (caught.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to create a joke.</p>
        <Link to="/login">Login</Link>
      </div>
    )
  }
}

export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.error(error)

  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  )
}

export default NewJokeRoute
