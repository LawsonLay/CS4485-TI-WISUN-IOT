# CS4485-TI-WISUN-IOT
This is the repo for the CS4485 TI-WISUN-IOT devices project. 

# Documentation
We want to run Kea and Stork on the BeaglePlay.
The BeaglePlay runs Debian.

We want to run Kea and Stork in Docker containers on the BeaglePlay.
First, we will try running Debian docker containers on our own machines, and try to get Kea and Stork working with the functionality we need.

We want to assign IPv6 addresses from Kea based on MAC addresses. This is currently not implemented normally through Kea. So, we will need to use what we call Hooks. There is a MAC2IPv6 hook made for Kea 1.1 by someone, but that requires compiling and some manual configuration.

More research is required for this. Will update soon. 2/13

