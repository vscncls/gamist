# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "bento/ubuntu-20.10"
  config.vm.network "forwarded_port", guest: 8080, host: 8080, host_ip: "127.0.0.1"
  config.vm.network "forwarded_port", guest: 5432, host: 5432, host_ip: "127.0.0.1"
  config.vm.network "forwarded_port", guest: 3000, host: 3000, host_ip: "127.0.0.1"
  config.vm.synced_folder "./", "/vagrant", type: "rsync", rsync__args: ["--verbose", "--archive", "--delete", "-z"]

  config.vm.provision "docker" do |docker|
    docker.run "postgres:13.3",
      args: "-p 127.0.0.1:5432:5432/tcp -e POSTGRES_USER=username -e POSTGRES_PASSWORD=password -e POSTGRES_DB=db"
  end

  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get upgrade -y
    su vagrant <<'EOF'
      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
      export NVM_DIR="$HOME/.nvm"
      . $NVM_DIR/nvm.sh
      nvm install --lts=fermium
      nvm use --lts=fermium
      npm install -g pnpm

      # backend
      cd /vagrant/backend
      pnpm i
      node migrate up
      pnpm run save-games
      pnpm run server:dev &

      # frontend
      cd /vagrant/frontend
      pnpm i
      pnpm run start &
EOF
  SHELL
end
