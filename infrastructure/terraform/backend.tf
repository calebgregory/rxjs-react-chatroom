terraform {
  backend "remote" {
    organization = "rxjs-react-chatroom"

    workspaces {
      name = "rxjs-react-chatroon"
    }
  }
}