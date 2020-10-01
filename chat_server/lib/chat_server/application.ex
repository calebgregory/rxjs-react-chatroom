defmodule ChatServer.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      ChatServerWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: ChatServer.PubSub},
      # Start the Endpoint (http/https)
      ChatServerWeb.Endpoint
      # Start a worker by calling: ChatServer.Worker.start_link(arg)
      # {ChatServer.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: ChatServer.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    ChatServerWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
