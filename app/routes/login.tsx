import {
  ActionFunction,
  LinksFunction,
  MetaFunction,
  LoaderFunction,
  useLoaderData
} from 'remix'

import { useActionData, Link, useSearchParams } from 'remix'
import { ValidatedForm, withYup } from 'remix-validated-form'
import * as yup from 'yup'

import { InputField, SubmitButton } from '~/components/forms'
import { db } from '~/utils/db.server'
import { createUserSession, login, register } from '~/utils/session.server'
import stylesUrl from '../styles/login.css'

const validator = withYup(
  yup.object({
    username: yup
      .string()
      .required('Username is required...')
      .min(3, 'Username must be at least 3 characters long'),
    password: yup
      .string()
      .required('Password is required...')
      .min(6, 'Password must be at least 6 characters long'),
    loginType: yup.string().required(),
    redirectTo: yup.string()
  })
)

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }]
}

export const meta: MetaFunction = () => {
  return {
    title: 'Remix Jokes | Login',
    description: 'Login to submit your own jokes to Remix Jokes!'
  }
}

export const loader: LoaderFunction = () => ({
  defaultValues: {
    username: '',
    password: '',
    loginType: 'login',
    redirectTo: ''
  }
})

type ActionData = {
  formError?: string
  fieldErrors?: {
    username: string | undefined
    password: string | undefined
  }
  fields?: {
    loginType: string
    username: string
    password: string
  }
}

export const action: ActionFunction = async ({
  request
}): Promise<Response | ActionData> => {
  const form = await request.formData()
  const { data, error } = validator.validate(Object.fromEntries(form))

  if (error) {
    return {
      fieldErrors: { username: error?.username, password: error?.password }
    }
  }

  const { username, password, loginType, redirectTo = '/jokes' } = data
  // return
  switch (loginType) {
    case 'login': {
      const user = await login({ username, password })
      if (!user) {
        return {
          fields: data,
          formError: `Username/Password combination is incorrect`
        }
      }
      return createUserSession(user.id, redirectTo)
    }
    case 'register': {
      const userExists = await db.user.findFirst({
        where: { username }
      })
      if (userExists) {
        return {
          fields: data,
          formError: `User with username ${username} already exists`
        }
      }
      const user = await register({ username, password })
      if (!user) {
        return {
          fields: data,
          formError: `Something went wrong trying to create a new user.`
        }
      }
      return createUserSession(user.id, redirectTo)
    }
    default: {
      return { fields: data, formError: `Login type invalid` }
    }
  }
}

const Login = () => {
  const { defaultValues } = useLoaderData()

  const actionData = useActionData<ActionData | undefined>()
  const [searchParams] = useSearchParams()
  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>Login</h1>
        <ValidatedForm
          validator={validator}
          method="post"
          defaultValues={actionData?.fields || defaultValues}
        >
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get('redirectTo') ?? undefined}
          />
          <fieldset>
            <legend className="sr-only">Login or Register?</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === 'login'
                }
              />{' '}
              Login
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={actionData?.fields?.loginType === 'register'}
              />{' '}
              Register
            </label>
          </fieldset>
          <InputField name="username" label="Username" />
          <InputField name="password" label="Password" type="password" />
          <div id="form-error-message">
            {actionData?.formError ? (
              <p className="form-validation-error" role="alert">
                {actionData?.formError}
              </p>
            ) : null}
          </div>
          <SubmitButton />
        </ValidatedForm>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/jokes">Jokes</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Login
