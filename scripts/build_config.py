import os
import subprocess
import json
import pprint

this_dir = os.path.dirname(os.path.realpath(__file__))
terraform_dir = os.path.realpath(os.path.join(this_dir, "../infrastructure/terraform"))
# https://create-react-app.dev/docs/adding-custom-environment-variables/#what-other-env-files-can-be-used
client_config_path = os.path.realpath(os.path.join(this_dir, "../client/.env.local"))

pp = pprint.PrettyPrinter(indent=2)

def find(element, json):
    keys = element.split('.')
    rv = json
    for key in keys:
        rv = rv[key]
    return rv

# maps a resource.address -> Tuple(path-to-desired-value, env-var-name)
xfs = {
  'aws_cognito_user_pool.app': ('values.id', 'REACT_APP_COGNITO_USER_POOL_ID'),
  'aws_cognito_user_pool_client.app': ('values.id', 'REACT_APP_COGNITO_USER_POOL_CLIENT_ID'),
  'aws_cognito_identity_pool.app': ('values.id', 'REACT_APP_COGNITO_IDENTITY_POOL_ID'),
  'aws_cognito_user_pool_domain.app': ('values.domain', 'REACT_APP_COGNITO_DOMAIN_PREFIX'),
}
# extract region from cognito_identity_pool's id , formatted REGION:GUID -
# see https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_identity_pool#id
def get_region(config):
  identity_pool_id = config['REACT_APP_COGNITO_IDENTITY_POOL_ID']
  return identity_pool_id.split(':')[0]

def main():
  result = subprocess.run(["terraform", "show", "-json"], capture_output=True, text=True, cwd=terraform_dir)
  if result.returncode > 0:
    print(result.stderr)
    exit(1)

  terraform_description = json.loads(result.stdout)
  resources = find('values.root_module.resources', terraform_description)

  config = dict()
  for resource in resources:
    if resource['address'] in xfs:
      print(f"☝ got relevant resource: {resource['address']}")
      path_to_val, env_var_name = xfs[resource['address']]
      config[env_var_name] = find(path_to_val, resource)
  region = get_region(config)
  config['REACT_APP_COGNITO_REGION'] = region
  pp.pprint(config)

  output = ""
  for key, val in config.items():
    output += f"{key}={val}\n"

  with open(client_config_path, "w") as config:
    config.write(output)
    print(f"wrote config to file {client_config_path}")

  print("✨ done")

if __name__ == '__main__':
  main()