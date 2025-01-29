import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

const client= new ApolloClient({uri:"http://localhost:3000/learn",cache:new InMemoryCache()})

createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
  <BrowserRouter>
  <StrictMode>
    <App />
  </StrictMode>
  </BrowserRouter></ApolloProvider>
)
