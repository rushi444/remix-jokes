import { useIsSubmitting } from 'remix-validated-form'

export const SubmitButton = () => {
  const isSubmitting = useIsSubmitting()
  return (
    <button type="submit" className="button" disabled={isSubmitting}>
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  )
}
