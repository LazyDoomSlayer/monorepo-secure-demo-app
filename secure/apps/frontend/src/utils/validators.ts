export const notEmptyUsername = (value: unknown): true | string =>
  (value !== null && value !== undefined && value !== '') || 'Username should not be empty.'

export const notEmptyPassword = (value: unknown): true | string =>
  (value !== null && value !== undefined && value !== '') || 'Password should not be empty.'
