# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

# Configures the endpoint
config :chat_server, ChatServerWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "Ypc/Vep2OBNKkhKBMAd0XbzZxTZkZk6RGKCvoEwPa1orEQ//RwS1xTN6mfXDgEgc",
  render_errors: [view: ChatServerWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: ChatServer.PubSub,
  live_view: [signing_salt: "RlrMgyPl"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
