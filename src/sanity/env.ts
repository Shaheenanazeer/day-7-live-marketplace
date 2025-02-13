export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-24'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}


export const token = assertValue(
 "ske4lyZZCg41W1aw6qS8rXHjMPwIhBYObuYf0YGAW7jFGFoLmjuGMfy9n0dEDHc0ltDqaKmncY4IcIPO1HNG2rI9uuFLlgYRVvQ0ue9PUdCjcdYcRuiYXxTLg9z9fuw6Xdw1grAhe5lH1PCdCdQRt4WNEKGTdBGcsp0xRuNBqI5X3ZBpR3tu",
  'Missing environment variable: SANITY_API_TOKEN'
)



