let apiRootFake = 'https://fakestoreapi.com'
export const API_ROOT_FAKE_DATA = apiRootFake

let apiRoot = ''
// console.log('import.meta.env: ', import.meta.env)
// console.log('process.env: ', process.env)


// dev environment
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'https://localhost:44329'
}

// deploy environment
if (process.env.BUILD_MODE === 'production') {
  apiRoot = ''
}
export const API_ROOT = apiRoot