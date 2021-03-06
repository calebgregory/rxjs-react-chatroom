export const config = {
  wsUrl: 'ws://localhost:8000/ws/chat',
  cognito: {
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID || '', // e.g. us-east-2_uXboG5pAb
    userPoolClientId: process.env.REACT_APP_COGNITO_USER_POOL_CLIENT_ID || '', // e.g. 25ddkmj4v6hfsfvruhpfi7n4hv
    identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID || '', // e.g. <region>:<guid>; must create Federated Identity
    region: process.env.REACT_APP_COGNITO_REGION || '', // e.g. us-east-2
    domainPrefix: process.env.REACT_APP_COGNITO_DOMAIN_PREFIX || '',
  },
  api: {
    invokeUrl: '' // e.g. https://rc7nyt4tql.execute-api.us-west-2.amazonaws.com/prod',
  }
}
