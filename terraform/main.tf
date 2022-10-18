data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_vpc" "vpc" {
  cidr_block = "172.16.0.0/16"
}

resource "aws_subnet" "private_subnet" {
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = "172.16.10.0/24"
  availability_zone = var.availability_zone
}

resource "aws_subnet" "public_subnet" {
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = "172.16.12.0/24"
  availability_zone = var.availability_zone
}

resource "aws_network_interface" "private_subnet_network_interface" {
  subnet_id   = aws_subnet.private_subnet.id
  private_ips = ["172.16.10.100"]
}

resource "aws_network_interface" "public_subnet_network_interface" {
  subnet_id   = aws_subnet.public_subnet.id
  private_ips = ["172.16.12.100"]
}

resource "aws_instance" "api" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t2.micro"
  security_groups = ["webport-allow"]

  network_interface {
    network_interface_id = aws_network_interface.private_subnet_network_interface.id
    device_index = 0
  }

  network_interface {
    network_interface_id = aws_network_interface.private_subnet_network_interface.id
    device_index = 1
  }
}
