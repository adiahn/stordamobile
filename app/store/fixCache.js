// This is a temporary file to fix Metro cache issues
// Metro is encountering an error at Cache.js (14:31)
// The error happens when a store.name is undefined

// Export a dummy store to ensure the store name exists
export const dummyStore = {
  name: 'dummyStore',
  constructor: { name: 'DummyStore' }
}; 