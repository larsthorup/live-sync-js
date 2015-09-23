: Note: use /k to see error message from a crashing process
set CK=/c
: set CK=/k
start "monitor" cmd %CK% node src/monitor/cli --port 1777
start "europe" cmd %CK% node src/cli --port 1781 --name europe --monitor ws://localhost:1777
start "susan" cmd %CK% node src/cli --client --port 1791 --name susan --monitor ws://localhost:1777 --upstream ws://localhost:1781
start "david" cmd %CK% node src/cli --client --port 1792 --name david --monitor ws://localhost:1777 --upstream ws://localhost:1781