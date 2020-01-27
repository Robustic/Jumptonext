import React from 'react'
import ReactDOM from 'react-dom'

import ApolloClient, { gql } from 'apollo-boost'

const client = new ApolloClient({
  uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
})

const query = gql`
{
    stops {
      gtfsId
      name
      lat
      lon
      zoneId
    }
  }
`

client.query({ query })
  .then((response) => {
    console.log(response.data)
  })

const App = () => {
  return <div>
    test
  </div>
}

// const App = () => (
//   <div class="container">
//     <p>Hello world</p>
//   </div>
// )

ReactDOM.render(<App />, document.getElementById('root'))