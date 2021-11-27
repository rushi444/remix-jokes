import { FC } from 'react'
import { useField } from 'remix-validated-form'

type TextAreaFieldProps = {
  name: string
  label: string
}

export const TextAreaField: FC<TextAreaFieldProps> = ({
  name,
  label,
  ...rest
}) => {
  const { validate, clearError, defaultValue, error } = useField(name)
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <textarea
        id={name}
        name={name}
        onBlur={validate}
        onChange={clearError}
        defaultValue={defaultValue}
        {...rest}
      />
      {error && <span className="form-validation-error">{error}</span>}
    </div>
  )
}
