#!/bin/bash
set -e

check_docker_installed() {
  if ! command -v docker &> /dev/null
  then
    echo "Docker is not installed. Please install Docker to proceed."
    exit 1
  fi
}

start_docker_services() {
  echo "Starting Docker services..."
  docker compose up -d
  echo "Docker services started successfully."
}

start_node_application() {
  echo "Starting Node.js application..."
  cd /home/vedant/Desktop/raftlab-assignments || exit 1
  npm install
  npm run dev
  echo "Node.js application started successfully."
}

check_docker_installed

start_docker_services

start_node_application
