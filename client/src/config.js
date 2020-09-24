export const config = {
  wsUrl: 'ws://localhost:8000/ws/chat',
}

window._config = {
  cognito: {
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID, // e.g. us-east-2_uXboG5pAb
    userPoolClientId: process.env.REACT_APP_COGNITO_USER_POOL_CLIENT_ID, // e.g. 25ddkmj4v6hfsfvruhpfi7n4hv
    region: process.env.REACT_APP_COGNITO_REGION // e.g. us-east-2
  },
  api: {
    invokeUrl: '' // e.g. https://rc7nyt4tql.execute-api.us-west-2.amazonaws.com/prod',
  }
}