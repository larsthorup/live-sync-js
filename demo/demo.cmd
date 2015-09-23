start "monitor" node src/monitor/cli --port 1777
start "europe" node src/cli --port 1781 --name europe --monitor ws://localhost:1777
start "susan" node src/cli --client --port 1791 --name susan --monitor ws://localhost:1777 --upstream ws://localhost:1781
start "david" node src/cli --client --port 1792 --name david --monitor ws://localhost:1777 --upstream ws://localhost:1781