import { FC } from 'react'
import { useField } from 'remix-validated-form'

type InputFieldProps = {
  name: string
  label: string
  type?: string
}

export const InputField: FC<InputFieldProps> = ({
  name,
  label,
  type = 'text',
  ...rest
}) => {
  const { validate, clearError, defaultValue, error } = useField(name)
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        onBlur={validate}
        onChange={clearError}
        defaultValue={defaultValue}
        type={type}
        {...rest}
      />
      {error && <span className="form-validation-error">{error}</span>}
    </div>
  )
}
