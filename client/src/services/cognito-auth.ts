/**
  @see https://www.npmjs.com/package/amazon-cognito-identity-js
 */
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from 'amazon-cognito-identity-js'
import * as AWS from 'aws-sdk/global'
import { config } from 'src/config'
import { logger } from 'src/logger'

const log = logger('services/cognito-auth')

interface Credentials {
  username: string,
  password: string,
}

interface SignUpCredentials extends Credentials {
  email: string
}

AWS.config.region = config.cognito.region

const poolData = {
  UserPoolId: config.cognito.userPoolId,
  ClientId: config.cognito.userPoolClientId,
}
const userPool = new CognitoUserPool(poolData)

function getCognitoUser(username: string): CognitoUser {
  const userData = {
    Username: username,
    Pool: userPool,
  }
  const cognitoUser = new CognitoUser(userData)
  return cognitoUser
}

export function signUp({ username, password, email }: SignUpCredentials) {
  const attributeList = [
    new CognitoUserAttribute({
      Name: 'email',
      Value: email,
    })
  ]

  return new Promise((resolve, reject) => {
    userPool.signUp(username, password, attributeList, [], (error, result) => {
      if (error) {
        log.warn('signUp - user sign up failed', { error })
        return reject(error)
      }

      log.info('signUp - successfully signed up', { result, username: result?.user.getUsername() })
      resolve(result)
    })
  })
}

export function confirmRegistration(username: string, confirmationCode: string) {
  const cognitoUser = getCognitoUser(username)

  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(confirmationCode, true, function(error, result) {
      if (error) {
        log.warn('confirmRegistration - error confirming registration', { error })
        return reject(error)
      }
      log.info('confirmRegistration - successfully confirmed registration', { result })
      resolve(true)
    })
  })
}

export function resendConfirmationCode(username: string) {
  const cognitoUser = getCognitoUser(username)

  return new Promise((resolve, reject) => {
    cognitoUser.resendConfirmationCode((error, result) => {
      if (error) {
        log.warn('resendConfirmationCode - error resending confirmation code', { error })
        return reject(error)
      }
      log.info('resendConfirmationCode - successfully resent confirmation code', { result });
      resolve(true)
    })
  })
}

export function authenticateUser({ username, password }: Credentials) {
  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  })
  const cognitoUser = getCognitoUser(username)

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        // const accessToken = result.getAccessToken().getJwtToken()
        const credentials: AWS.CognitoIdentityCredentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: config.cognito.identityPoolId,
          Logins: {
            [`cognito-idp.${config.cognito.region}.amazonaws.com/${config.cognito.userPoolId}`]: result.getIdToken().getJwtToken(),
          },
        })

        // refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
        credentials.refresh((error) => {
          if (error) {
            log.warn('authenticateUser - AWS.config.credentials.refresh - error', { error })
            reject(error)
          } else {
            // Instantiate aws sdk service objects now that the credentials have been updated.
            //   e.g., const s3 = new AWS.S3()
            log.info('authenticateUser - successfully logged in');
            resolve(true)
          }
        })

        AWS.config.credentials = credentials
      },
      onFailure: (error) => {
        log.warn('authenticateUser - failed to authenticate user', { error })
        reject(error)
      },
    })
  })
}