require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./src/config/db');

const questionsData = [
  {
    "id": 1,
    "question": "Which Cisco IOS mode displays a prompt of Router#?",
    "options": [
      "user EXEC mode",
      "setup mode",
      "privileged EXEC mode",
      "global configuration mode"
    ],
    "correctAnswer": 2,
    "explanation": "The Router# prompt indicates privileged EXEC mode, also known as enable mode, where users can execute privileged commands."
  },
  {
    "id": 2,
    "question": "Which switch command would a network administrator use to determine if there are encapsulation or media errors on an interface?",
    "options": [
      "show ip interface",
      "show arp",
      "show interfaces",
      "show line"
    ],
    "correctAnswer": 2,
    "explanation": "The 'show interfaces' command displays detailed information about interface status, including encapsulation errors, media errors, and other statistics."
  },
  {
    "id": 3,
    "question": "Refer to the exhibit. An administrator is trying to configure the switch but receives the error message that is displayed in the exhibit. What is the problem?",
    "options": [
      "The administrator must first enter privileged EXEC mode before issuing the command.",
      "The entire command, configure terminal, must be used.",
      "The administrator must connect via the console port to access global configuration mode.",
      "The administrator is already in global configuration mode."
    ],
    "correctAnswer": 0,
    "explanation": "To enter global configuration mode, the administrator must first be in privileged EXEC mode (enable mode) and then use the 'configure terminal' command."
  },
  {
    "id": 4,
    "question": "Refer to the exhibit. Which element of IOS syntax is the expression MainOffice?",
    "options": [
      "an argument",
      "a subcommand",
      "a command",
      "a keyword"
    ],
    "correctAnswer": 3,
    "explanation": "In IOS command syntax, MainOffice is a keyword that represents a specific value or parameter required by the command."
  },
  {
    "id": 5,
    "question": "Which interface is the default SVI on a Cisco switch?",
    "options": [
      "VLAN 1",
      "VLAN 99",
      "FastEthernet 0/1",
      "GigabitEthernet 0/1"
    ],
    "correctAnswer": 0,
    "explanation": "VLAN 1 is the default SVI (Switch Virtual Interface) on Cisco switches, used for management purposes by default."
  },
  {
    "id": 6,
    "question": "A network administrator enters the service password-encryption command into the configuration mode of a router. What does this command accomplish?",
    "options": [
      "This command provides an exclusive encrypted password for external service personnel who are required to do router maintenance.",
      "This command automatically encrypts passwords in configuration files that are currently stored in NVRAM.",
      "This command encrypts passwords as they are transmitted across serial WAN links.",
      "This command prevents someone from viewing the running configuration passwords."
    ],
    "correctAnswer": 3,
    "explanation": "The service password-encryption command encrypts passwords in the running configuration to prevent unauthorized viewing of plain-text passwords."
  },
  {
    "id": 7,
    "question": "Refer to the exhibit. A network technician is statically assigning an IP address to a PC. The default gateway is correct. What would be a valid IP address to assign to the host?",
    "options": [
      "128.107.255.1",
      "128.108.100.10",
      "128.106.10.100",
      "128.107.255.254"
    ],
    "correctAnswer": 3,
    "explanation": "The valid IP address would be 128.107.255.254, as it falls within the same subnet as the default gateway and is a valid host address."
  },
  {
    "id": 8,
    "question": "When configuring SSH on a router to implement secure network management, a network engineer has issued the login local and transport input ssh line vty commands. What three additional configuration actions have to be performed to complete the SSH configuration? (Choose three.)",
    "options": [
      "Create a valid local username and password database.",
      "Configure the correct IP domain name.",
      "Configure role-based CLI access.",
      "Generate the asymmetric RSA keys.",
      "Set the user privilege levels."
    ],
    "correctAnswer": [0, 1, 3],
    "explanation": "To complete SSH configuration, you need to: create a local username/password database, configure the IP domain name, and generate RSA keys for encryption."
  },
  {
    "id": 9,
    "question": "Passwords can be used to restrict access to all or parts of the Cisco IOS. Select the modes and interfaces that can be protected with passwords. (Choose three.)",
    "options": [
      "privileged EXEC mode",
      "router configuration mode",
      "VTY interface",
      "Ethernet interface",
      "console interface",
      "boot IOS mode"
    ],
    "correctAnswer": [0, 2, 4],
    "explanation": "Passwords can protect privileged EXEC mode (enable password), VTY interface (remote access), and console interface (physical access)."
  },
  {
    "id": 10,
    "question": "Which one of the following network devices has only two ports?",
    "options": [
      "Router",
      "Bridge",
      "Both a and b",
      "None of the above"
    ],
    "correctAnswer": 1,
    "explanation": "A bridge typically has two ports, connecting two network segments. A router can have multiple ports (often 2 or more)."
  },
  {
    "id": 11,
    "question": "Which one of the following network devices transmits the data in the form of packets?",
    "options": [
      "Router",
      "Bridge",
      "Both a and b",
      "None of the above"
    ],
    "correctAnswer": 0,
    "explanation": "Routers operate at Layer 3 and transmit data as packets. Bridges operate at Layer 2 and forward frames."
  },
  {
    "id": 12,
    "question": "Which one of the following network devices is used to connect different networks?",
    "options": [
      "Hub",
      "Switch",
      "Router",
      "All"
    ],
    "correctAnswer": 2,
    "explanation": "Routers are used to connect different networks. Hubs and switches operate within the same network segment."
  },
  {
    "id": 13,
    "question": "Which one of the following network devices doesn't support both dynamic and static routing?",
    "options": [
      "Gateway",
      "Router",
      "Server",
      "PC"
    ],
    "correctAnswer": 3,
    "explanation": "PCs do not typically support dynamic routing protocols. Routers and gateways support both static and dynamic routing."
  },
  {
    "id": 14,
    "question": "Which one of the following network devices doesn't have any security measures to protect the network?",
    "options": [
      "Modem",
      "Router",
      "Switch",
      "Server"
    ],
    "correctAnswer": 0,
    "explanation": "A modem typically has minimal security features compared to routers (firewall), switches (port security), and servers (firewall/IPS)."
  },
  {
    "id": 15,
    "question": "What type of address is physically assigned to the NIC of a workstation?",
    "options": [
      "MAC address",
      "host address",
      "IP address",
      "network address"
    ],
    "correctAnswer": 0,
    "explanation": "MAC address is physically burned into the NIC by the manufacturer and is a permanent hardware address."
  },
  {
    "id": 16,
    "question": "An administrator is adding voice and video service capabilities to an existing network. What design requirement is being satisfied by this situation?",
    "options": [
      "availability",
      "security",
      "manageability",
      "scalability"
    ],
    "correctAnswer": 3,
    "explanation": "Adding new services (voice and video) indicates the network design is scalable, allowing for growth and addition of new capabilities."
  },
  {
    "id": 17,
    "question": "A company is considering implementing virtualization solutions in a data center. What are three advantages of virtualization the company can expect to benefit from?",
    "options": [
      "improved disaster recovery",
      "less employee training",
      "reduced security requirements",
      "shorter work week"
    ],
    "correctAnswer": 0,
    "explanation": "Virtualization improves disaster recovery through easier backups and restoration. It does not reduce security requirements or training needs."
  },
  {
    "id": 18,
    "question": "A user calls to report that a PC cannot access the internet. The network technician asks the user to issue the command ping 127.0.0.1 in a command prompt window. The user reports that the result is four positive replies. What conclusion can be drawn based on this connectivity test?",
    "options": [
      "The IP address obtained from the DHCP server is correct.",
      "The TCP/IP implementation is functional.",
      "The PC can access the Internet. However, the web browser may not work.",
      "The PC can access the network. The problem exists beyond the local network."
    ],
    "correctAnswer": 1,
    "explanation": "Ping 127.0.0.1 (localhost) tests the TCP/IP stack. Positive replies indicate the TCP/IP implementation is functional, but doesn't confirm network connectivity."
  },
  {
    "id": 19,
    "question": "A user issues a ping 198.51.100.5 command and receives a response that includes a code of 0. What does this code represent?",
    "options": [
      "network unreachable",
      "host unreachable",
      "port unreachable",
      "protocol unreachable"
    ],
    "correctAnswer": 1,
    "explanation": "ICMP code 0 for destination unreachable indicates 'network unreachable'. Different codes indicate different types of unreachable destinations."
  },
  {
    "id": 20,
    "question": "A network administrator establishes a connection to a switch via SSH. What characteristic uniquely describes the SSH connection?",
    "options": [
      "direct access to the switch through the use of a terminal emulation program",
      "remote access to the switch through the use of a telephone dialup connection",
      "on-site access to a switch through the use of a directly connected PC and a console cable",
      "out-of-band access to a switch through the use of a virtual terminal with password authentication",
      "remote access to a switch where data is encrypted during the session"
    ],
    "correctAnswer": 4,
    "explanation": "SSH provides encrypted remote access to network devices, ensuring all data transmitted during the session is secure."
  },
  {
    "id": 21,
    "question": "____ is changing their routing decision to reflect changing the topology",
    "options": [
      "Nonadaptive algorithm",
      "Adaptive algorithm",
      "Static algorithm",
      "Recursive algorithm"
    ],
    "correctAnswer": 1,
    "explanation": "Adaptive algorithms change routing decisions based on network topology changes, dynamically adjusting to network conditions."
  },
  {
    "id": 22,
    "question": "A data center has recently updated a physical server to host multiple operating systems on a single CPU. The data center can now provide each customer with a separate web server without having to allocate an actual discrete server for each customer. What is the networking trend that is being implemented by the data center in this situation?",
    "options": [
      "maintaining communication integrity",
      "online collaboration",
      "virtualization",
      "BYOD"
    ],
    "correctAnswer": 2,
    "explanation": "Virtualization allows multiple operating systems to run on a single physical server, enabling efficient resource utilization and server consolidation."
  },
  {
    "id": 23,
    "question": "Which IPv4 header fields have no equivalent in an IPv6 header?",
    "options": [
      "protocol",
      "TTL",
      "version",
      "flag"
    ],
    "correctAnswer": 3,
    "explanation": "The IPv4 header has a Flags field for fragmentation control that has no equivalent in IPv6. IPv6 handles fragmentation differently."
  },
  {
    "id": 24,
    "question": "Refer to the exhibit. A ping to PC2 is issued from PC0, PC1, and PC3 in this exact order. Which MAC addresses will be contained in the S1 MAC address table that is associated with the Fa0/1 port?",
    "options": [
      "Only the MAC address of PC2",
      "MAC addresses of PC0, PC1, PC2, and PC3",
      "Only the MAC address of PC0",
      "MAC addresses of PC0 and PC1"
    ],
    "correctAnswer": 0,
    "explanation": "The switch learns MAC addresses from frames received on its ports. For Fa0/1, it will learn the MAC address of PC2 (the device connected to that port)."
  },
  {
    "id": 25,
    "question": "Which two items are used by a host device when performing an ANDing operation to determine if a destination address is on the same local network?",
    "options": [
      "network number and network number",
      "destination IP address and subnet mask",
      "source MAC address and subnet mask",
      "destination MAC address and network number"
    ],
    "correctAnswer": 1,
    "explanation": "The host performs ANDing between the destination IP address and subnet mask to determine the network address, then compares it with its own network address."
  },
  {
    "id": 26,
    "question": "A home network has both wired and wireless connectivity. From a laptop computer, the user issues a ping to the wireless printer located in another room. The first two echo requests fail, but the last two succeed. Additional pings are all successful. Why do the first two echo requests fail?",
    "options": [
      "The computer and the printer must join the wireless network first and that process takes time.",
      "The distance between the computer and the printer causes delay on the first two pings.",
      "The wireless printer must be activated and that takes time.",
      "The computer must use ARP to obtain the MAC address of the printer and this process takes time."
    ],
    "correctAnswer": 3,
    "explanation": "ARP resolution takes time as the host sends ARP requests to get the MAC address of the printer. Once learned, subsequent pings succeed immediately."
  },
  {
    "id": 27,
    "question": "A web designer calls to report that the web server web-s1.cisco.com is not reachable through a web browser. The technician uses command line utilities to verify the problem and to begin the troubleshooting process. Which two things can be determined about the problem",
    "options": [
      "DNS resolution failure",
      "Network connectivity issues",
      "Server service failure",
      "All of the above"
    ],
    "correctAnswer": 3,
    "explanation": "The problem could involve DNS resolution (cannot resolve hostname), network connectivity (cannot reach the network), or server services (web server down)."
  },
  {
    "id": 28,
    "question": "Which three commands are used to set up secure access to a router through a connection to the console interface?",
    "options": [
      "line vty 0 4",
      "password cisco",
      "interface fastethernet 0/0",
      "enable secret cisco"
    ],
    "correctAnswer": 1,
    "explanation": "For console access, you need to configure the console line with a password. 'line console 0' would be correct, not line vty."
  },
  {
    "id": 29,
    "question": "The global configuration command ip default-gateway 172.16.100.1 is applied to a switch. What is the effect of this command?",
    "options": [
      "The switch can communicate with other hosts on the 172.16.100.0 network.",
      "The switch can be remotely managed from a host on another network.",
      "The switch will have a management interface with the address 172.16.100.1.",
      "The switch is limited to sending and receiving frames to and from the gateway 172.16.100.1."
    ],
    "correctAnswer": 1,
    "explanation": "Setting a default gateway allows the switch to send traffic to other networks, enabling remote management from hosts on different networks."
  },
  {
    "id": 30,
    "question": "Which forwarding action does a switch take when the destination MAC address of an Ethernet frame is an unknown unicast?",
    "options": [
      "The switch forwards the frame to the default gateway.",
      "The switch forwards the frame the same way it does for broadcast and multicast MAC addresses.",
      "The switch drops the frame.",
      "The switch forwards the frame out a specified port for this type of address."
    ],
    "correctAnswer": 1,
    "explanation": "When a switch receives a frame with an unknown unicast MAC address, it floods the frame out all ports (except the receiving port), similar to broadcast handling."
  },
  {
    "id": 31,
    "question": "An administrator is troubleshooting connectivity on the office network. PC1 is able to send print jobs to Printer1, but is unable to access File Server1. Which action would correct the problem?",
    "options": [
      "Change the R1 Fa0/1 interface IP address to 10.231.64.1.",
      "Change the R1 Fa0/0 interface subnet mask to 255.255.0.0.",
      "Change the File Server1 IP address to 10.231.96.253.",
      "Change the PC1 IP address to 10.231.64.115."
    ],
    "correctAnswer": 3,
    "explanation": "PC1 needs to be on the correct subnet to reach File Server1. Changing PC1's IP address to the correct subnet would resolve the connectivity issue."
  },
  {
    "id": 32,
    "question": "Your colleges just finished configuring a small test network as part of his training. The network is configured as shown in the diagram below. When testing the configuration, you find that Host A in the diagram cannot ping Host B. Which of the following pairs of connections are required to be in the same subnet for Host A to be able to ping Host B? (Choose all that apply.)",
    "options": [
      "The IP address of Host A and the IP address of the Fa0/0 interface of Router A",
      "The IP address of the Fa0/0 interface of Router A and the IP address of the Fa0/0 interface of Router B",
      "The IP address of Host A and the IP address of the Fa0/0 interface of Router D",
      "The IP address of Host A and the IP address of Switch A",
      "The IP address of the S0/0 interface of Router A and the IP address of the S0/0 interface of Router B",
      "The IP address of Host A and the IP address of Host B",
      "The IP address of Host B and the IP address of the Fa0/0 interface of Router B"
    ],
    "correctAnswer": [0, 4, 6],
    "explanation": "For Host A to reach Host B: Host A must be in the same subnet as Router A's Fa0/0, Router A's S0/0 must be in same subnet as Router B's S0/0, and Host B must be in same subnet as Router B's Fa0/0."
  },
  {
    "id": 33,
    "question": "When a packet is forwarded through a network from one host to another host, which of the following fields in the Ethernet frame will change at every hop?",
    "options": [
      "Source IP address",
      "Destination MAC address",
      "Source port number",
      "Destination IP address"
    ],
    "correctAnswer": 1,
    "explanation": "The destination MAC address changes at every hop as the frame is forwarded from one router to the next. Source and destination IP addresses remain the same."
  },
  {
    "id": 34,
    "question": "You are the network administrator for your company. You have installed a new router in your network. You want to establish a remote connection from your computer to the new router so it can be configured. You are not concerned about security during the remote connection. Which Cisco IOS command should you use to accomplish the task?",
    "options": [
      "ssh",
      "telnet",
      "terminal",
      "virtual"
    ],
    "correctAnswer": 1,
    "explanation": "Telnet is used for remote access to Cisco devices. Since security is not a concern, Telnet is appropriate. SSH is used for secure connections."
  },
  {
    "id": 35,
    "question": "You are configuring a WAN connection between two offices. You cannot ping between the routers in a test. The Serial0 interface on RouterA is connected to the Serial1 interface on RouterB. The commands you have executed are shown below. What is the problem with the configuration?",
    "options": [
      "The usernames don't match the hostnames.",
      "The password doesn't match on both routers.",
      "The interface names are not consistent.",
      "The PPP encapsulation is missing."
    ],
    "correctAnswer": 0,
    "explanation": "The username must match the remote router's hostname. RouterA's username should be RouterB (which it is), and RouterB's username should be RouterA."
  },
  {
    "id": 36,
    "question": "What command would be used to verify trusted DHCP ports?",
    "options": [
      "show mls qos",
      "show ip dhcp snooping",
      "show ip trust",
      "show ip arp trust"
    ],
    "correctAnswer": 1,
    "explanation": "'show ip dhcp snooping' displays DHCP snooping configuration including trusted ports and bindings information."
  },
  {
    "id": 37,
    "question": "RouterA and RouterB, which connect two locations, are unable to communicate. You run the show running-configuration command on both router interfaces, RouterA and RouterB. The following is a partial output. Based on the information given in the output, what are two likely causes of the problem?",
    "options": [
      "The IP address defined is incorrect.",
      "Both routers cannot have an identical clock rate.",
      "The Layer 2 framing is misconfigured.",
      "At least one of the routers must have the ip mroute-cache command enabled."
    ],
    "correctAnswer": [0, 2],
    "explanation": "The IP addresses are on different subnets (192.10.191.x and 192.10.192.x), and both routers are set as DCE (clockrate configured), which is incorrect for serial links."
  },
  {
    "id": 38,
    "question": "You are discovering that there are differences between the configuration of EIGRP for IPv6 and EIGRP for IPv4. Which statement is true with regard to the difference?",
    "options": [
      "A router ID is required for both versions",
      "A router ID must be configured under the routing process for EIGRP for IPv4",
      "AS numbers are not required in EIGRP for IPv6",
      "AS numbers are not required in EIGRP for IPv4"
    ],
    "correctAnswer": 0,
    "explanation": "A router ID is required for both EIGRP for IPv4 and IPv6, serving as a unique identifier for the router in the EIGRP domain."
  },
  {
    "id": 39,
    "question": "Which of the following techniques is NOT used by distance vector protocols to stop routing loops in a network?",
    "options": [
      "Split horizon",
      "Spanning Tree Protocol (STP)",
      "Holddowns",
      "Route poisoning"
    ],
    "correctAnswer": 1,
    "explanation": "STP is used to prevent loops at Layer 2 (switching), not for routing loops at Layer 3. Split horizon, holddowns, and route poisoning are distance vector loop prevention techniques."
  },
  {
    "id": 40,
    "question": "You are a network administrator for your organization. Your organization has two Virtual LANs, named Marketing and Production. All Cisco 2950 switches in the network have both VLANs configured on them. Switches A, C, F, and G have user machines connected for both VLANs, whereas switches B, D, and E have user machines connected for the Production VLAN only. You receive a request to configure Fast Ethernet port 0/2 on Switch B for a user computer in the Marketing VLAN. VLAN numbers for the Marketing and Production VLANs are 15 and 20, respectively. Which Cisco 2950 switch command should you use to configure the port?",
    "options": [
      "SwitchB(config-if)#switchport trunk vlan 15",
      "SwitchB(config)#switchport access vlan 15",
      "SwitchB(config-if)#switchport access vlan 15",
      "SwitchB(config-if)#switchport trunk vlan 15, 20"
    ],
    "correctAnswer": 2,
    "explanation": "To assign a port to a specific VLAN, use 'switchport access vlan 15' in interface configuration mode. The port is an access port, not a trunk port."
  },
  {
    "id": 41,
    "question": "Which Cisco IOS command is used on a Cisco Catalyst 6500 series switch to view the spanning-tree protocol (STP) information for a virtual LAN (VLAN)?",
    "options": [
      "show spanning tree",
      "show spanning-tree vlan",
      "show spantree",
      "show spantree vlan"
    ],
    "correctAnswer": 1,
    "explanation": "'show spanning-tree vlan' displays STP information for a specific VLAN on a Cisco switch."
  },
  {
    "id": 42,
    "question": "Which of the following is NOT a true statement regarding Virtual Private Networks (VPNs)?",
    "options": [
      "A VPN is a method of securing private data over public networks",
      "IPsec is a method for providing security over VPN",
      "Frame Relay is a Layer 3 VPN technology",
      "IPsec provides packet-level encryption",
      "A Cisco VPN solution provides increased security, reduced cost, and scalability"
    ],
    "correctAnswer": 2,
    "explanation": "Frame Relay is a Layer 2 WAN technology, not a Layer 3 VPN technology. The other statements about VPNs are true."
  },
  {
    "id": 43,
    "question": "Which of the following is NOT a VLAN Trunking Protocol (VTP) mode of operation?",
    "options": [
      "client",
      "server",
      "virtual",
      "transparent"
    ],
    "correctAnswer": 2,
    "explanation": "VTP operates in three modes: Server, Client, and Transparent. 'Virtual' is not a valid VTP mode."
  },
  {
    "id": 44,
    "question": "A router is running a classful routing protocol. Which command will enable this router to select a default route when routing to an unknown subnet of a network for which it knows the major network?",
    "options": [
      "ip classless",
      "no ip classless",
      "auto-summary",
      "no auto-summary"
    ],
    "correctAnswer": 0,
    "explanation": "'ip classless' allows a router to forward packets to unknown subnets using the default route, bypassing classful routing behavior."
  },
  {
    "id": 45,
    "question": "Which Cisco IOS command is used to configure encapsulation for a PPP serial link on a Cisco router?",
    "options": [
      "encapsulation ppp",
      "encapsulation ip ppp",
      "ip encapsulation ppp",
      "encapsulation ppp-synch"
    ],
    "correctAnswer": 0,
    "explanation": "'encapsulation ppp' is the correct command to configure PPP encapsulation on a serial interface in interface configuration mode."
  },
  {
    "id": 46,
    "question": "When the copy running-config startup-config command is issued on a router, where is the configuration saved?",
    "options": [
      "Random access memory (RAM)",
      "Flash",
      "Non-volatile random access memory (NVRAM)",
      "Read-only memory (ROM)"
    ],
    "correctAnswer": 2,
    "explanation": "The startup configuration is saved in NVRAM, which retains its contents when the router is powered off."
  },
  {
    "id": 47,
    "question": "What would be the effect of configuring a loopback interface on RouterA with an address of 192.168.1.50/24?",
    "options": [
      "Router B would become the designated router",
      "Router A would become the designated router",
      "Router C would become the designated router",
      "Router A would become the backup designated router"
    ],
    "correctAnswer": 1,
    "explanation": "A loopback interface with a higher IP address can influence OSPF DR election. Router A would likely become the designated router."
  },
  {
    "id": 48,
    "question": "Which type of network connection requires a straight-through cable?",
    "options": [
      "host to host",
      "switch to router",
      "switch to switch",
      "host to router's Ethernet port"
    ],
    "correctAnswer": 1,
    "explanation": "Switch to router connections use straight-through cables because they are different device types (DCE to DTE)."
  },
  {
    "id": 49,
    "question": "What command would you run to determine which switch is the root bridge for a particular VLAN?",
    "options": [
      "show spantree vlan",
      "show spanning tree",
      "show spanning-tree vlan",
      "show vlan spantree"
    ],
    "correctAnswer": 2,
    "explanation": "'show spanning-tree vlan' displays STP information including the root bridge ID for the specified VLAN."
  },
  {
    "id": 50,
    "question": "Which three statements are TRUE regarding Network Address Translation (NAT)? (Choose three.)",
    "options": [
      "It connects different Internet Service Providers (ISPs).",
      "It can act as an address translator between the Internet and a local network.",
      "It conserves IP addresses.",
      "It creates additional IP addresses for the local network.",
      "It helps the local network connect to the Internet using unregistered IP addresses."
    ],
    "correctAnswer": [1, 2, 4],
    "explanation": "NAT translates between public and private IP addresses, conserves public IP addresses, and allows private networks to use unregistered addresses."
  },
  {
    "id": 51,
    "question": "You are the switch administrator for InterConn. The network is physically wired as shown in the diagram. You are planning the configuration of STP. The majority of network traffic runs between the hosts and servers within each VLAN. You would like to designate the root bridges for VLANs 10 and 20. Which switches should you designate as the root bridges?",
    "options": [
      "Switch A for VLAN 10 and Switch B for VLAN 20",
      "Switch A for VLAN 10 and Switch C for VLAN 20",
      "Switch D for VLAN 10 and Switch B for VLAN 20",
      "Switch E for VLAN 10 and Switch A for VLAN 20"
    ],
    "correctAnswer": 0,
    "explanation": "For optimal traffic flow, root bridges should be placed where the majority of traffic originates. Switch A for VLAN 10 and Switch B for VLAN 20 would be appropriate."
  },
  {
    "id": 52,
    "question": "What is the purpose of frame tagging in Virtual LAN (VLAN) configurations?",
    "options": [
      "inter-VLAN routing",
      "encryption of network packets",
      "frame identification over trunk links",
      "frame identification over access links"
    ],
    "correctAnswer": 2,
    "explanation": "Frame tagging (e.g., IEEE 802.1Q) identifies which VLAN a frame belongs to when transmitted over a trunk link connecting switches."
  },
  {
    "id": 53,
    "question": "What is the primary benefit of the Virtual Local Area Network (VLAN) Trunking Protocol (VTP)?",
    "options": [
      "broadcast control",
      "frame tagging",
      "inter-VLAN routing",
      "consistent VLAN configuration across switches in a domain"
    ],
    "correctAnswer": 3,
    "explanation": "VTP maintains consistent VLAN configuration across all switches in a VTP domain, reducing administration overhead."
  },
  {
    "id": 54,
    "question": "Which of the following is NOT a feature offered by Enhanced Interior Gateway Routing Protocol (EIGRP)?",
    "options": [
      "variable length subnet masks (VLSM)",
      "partial updates",
      "neighbor discovery mechanism",
      "multiple vendor compatibility"
    ],
    "correctAnswer": 3,
    "explanation": "EIGRP is a Cisco-proprietary protocol, so it does not support multiple vendor compatibility. It supports VLSM, partial updates, and neighbor discovery."
  },
  {
    "id": 55,
    "question": "Consider the following diagram. Which of the following routing protocols could NOT be used with this design?",
    "options": [
      "RIPv1",
      "RIPv2",
      "EIGRP",
      "OSPF"
    ],
    "correctAnswer": 0,
    "explanation": "RIPv1 is a classful routing protocol that doesn't support VLSM, so it cannot be used with networks that have different subnet masks."
  },
  {
    "id": 56,
    "question": "You run the following command: switch# show ip interface brief. What information is displayed?",
    "options": [
      "A summary of the IP addresses and subnet mask on the interface",
      "A summary of the IP addresses on the interface and the interface's status",
      "The IP packet statistics for the interfaces",
      "The IP addresses for the interface and the routing protocol advertising the network"
    ],
    "correctAnswer": 1,
    "explanation": "'show ip interface brief' displays a summary of interfaces with their IP addresses and status (up/down)."
  },
  {
    "id": 57,
    "question": "Which Cisco Internetwork Operating System (IOS) command would be used to set the privileged mode password to 'cisco'?",
    "options": [
      "router(config)# enable password cisco",
      "router# enable secret cisco",
      "router(config)# line password cisco",
      "router(config-router)# enable password cisco"
    ],
    "correctAnswer": 0,
    "explanation": "'enable password cisco' in global configuration mode sets the privileged EXEC mode password. Enable secret is encrypted and takes precedence."
  },
  {
    "id": 58,
    "question": "Which of the following characteristics are NOT shared by RIPv1 and RIPv2?",
    "options": [
      "They share an administrative distance value",
      "They use the same metric",
      "They both send the subnet mask in routing updates",
      "They have the same maximum hop count"
    ],
    "correctAnswer": 2,
    "explanation": "RIPv1 does not send subnet masks in routing updates (classful), while RIPv2 does (classless). They share AD value (120), metric (hop count), and max hop count (15)."
  },
  {
    "id": 59,
    "question": "Enhanced Interior Gateway Routing Protocol (EIGRP) uses which algorithm to select the best path to the destination?",
    "options": [
      "Diffusing Update Algorithm (DUAL)",
      "Dijkstra algorithm",
      "Bellman-Ford algorithm",
      "Shortest Path First (SPF) algorithm"
    ],
    "correctAnswer": 0,
    "explanation": "EIGRP uses the Diffusing Update Algorithm (DUAL) to calculate the best path to a destination, ensuring loop-free paths."
  },
  {
    "id": 60,
    "question": "Which Enhanced Interior Gateway Routing Protocol (EIGRP) packet type is used for neighbor discovery?",
    "options": [
      "Hello",
      "Update",
      "Queries",
      "Replies"
    ],
    "correctAnswer": 0,
    "explanation": "EIGRP Hello packets are used for neighbor discovery and to maintain neighbor relationships on directly connected networks."
  },
  {
    "id": 61,
    "question": "Which type of address never changes on a device and is similar to a home address?",
    "options": [
      "MAC address",
      "IP address",
      "network address",
      "logical address"
    ],
    "correctAnswer": 0,
    "explanation": "MAC addresses are permanently assigned to network interfaces and never change, similar to a permanent home address."
  },
  {
    "id": 62,
    "question": "On which of the following networks will OSPF elect a designated router (DR)?",
    "options": [
      "Broadcast",
      "Reflection",
      "Point-to-point",
      "Point-to-multipoint"
    ],
    "correctAnswer": 0,
    "explanation": "OSPF elects a DR on broadcast networks (like Ethernet) to reduce the number of adjacencies and flooding. Point-to-point networks don't require a DR."
  },
  {
    "id": 63,
    "question": "Which Cisco IOS command can be issued on a router to test the connectivity of one interface from another interface on the same router?",
    "options": [
      "ping (with no address specified)",
      "ping (with an address specified)",
      "tracer",
      "traceroute"
    ],
    "correctAnswer": 0,
    "explanation": "Ping with no address specified (ping) sends ICMP echo requests to all available interfaces, testing internal connectivity."
  },
  {
    "id": 64,
    "question": "What port types are available for Rapid Spanning Tree Protocol (RSTP) but NOT available in Spanning Tree Protocol (STP)? (Choose two.)",
    "options": [
      "Root port",
      "Backup port",
      "Alternate port",
      "Designated port",
      "Learning port"
    ],
    "correctAnswer": [1, 2],
    "explanation": "RSTP introduces Backup port (discarding) and Alternate port (discarding) roles that are not present in the original STP."
  },
  {
    "id": 65,
    "question": "Which of the following is a classful routing protocol?",
    "options": [
      "RIPv1",
      "EIGRP",
      "BGPv4",
      "RIPv2"
    ],
    "correctAnswer": 0,
    "explanation": "RIPv1 is a classful routing protocol that does not send subnet mask information in routing updates."
  },
  {
    "id": 66,
    "question": "You have the following configuration on your router: ip dhcp pool POOLNAME network 10.1.0.0 255.255.255.0 default-router 10.1.0.254 dnsserver 10.1.0.200. What command would you run to prevent the last available IP address in the scope from being allocated to a host via DHCP?",
    "options": [
      "ip dhcp restrict 10.1.0.254",
      "ip dhcp excluded-address 10.1.0.253",
      "ip dhcp excluded-address 10.1.0.254",
      "ip dhcp 10.1.0.253 excluded-address"
    ],
    "correctAnswer": 2,
    "explanation": "The last available IP address is 10.1.0.254 (the network is 10.1.0.0/24, so .254 is the last usable). The 'ip dhcp excluded-address 10.1.0.254' prevents allocation of this address."
  },
  {
    "id": 67,
    "question": "Assume that all ports on Layer 2 devices are in the same Virtual LAN (VLAN). View the given network topology. Which network device should be placed at the highlighted box to produce a total of two broadcast domains and seven collision domains in the network?",
    "options": [
      "Hub",
      "Bridge",
      "Switch",
      "Router"
    ],
    "correctAnswer": 3,
    "explanation": "A router creates broadcast domain boundaries. With two routers, you would have two broadcast domains. Switches create separate collision domains per port."
  },
  {
    "id": 68,
    "question": "Which Cisco Internetwork Operating System (IOS) command is used to assign a router a name for identification?",
    "options": [
      "description",
      "banner motd",
      "hostname",
      "banner exec"
    ],
    "correctAnswer": 2,
    "explanation": "'hostname' in global configuration mode assigns a name to the router for identification purposes."
  },
  {
    "id": 69,
    "question": "You instructed your assistant to add a new router to the network. The routers in your network run OSPF. The existing router, OldRouter, is configured as follows: network 192.168.5.0 0.0.0.255 area 0 network 192.168.10.0 0.0.0.255 area 0. The OldRouter interface that connects to NewRouter is 192.168.5.3/24. Your assistant shows you the configuration that will be implemented: newrouter(config)# router ospf 1 newrouter(config-router)# network 192.168.5.0 255.255.255.0 area 0. What is wrong with this configuration?",
    "options": [
      "The area ID is incorrectly configured.",
      "The wildcard mask is incorrectly configured.",
      "The network statement is incorrectly configured.",
      "The process ID number is incorrectly configured."
    ],
    "correctAnswer": 1,
    "explanation": "The network statement should use a wildcard mask (0.0.0.255) instead of a subnet mask (255.255.255.0) for OSPF configuration."
  },
  {
    "id": 70,
    "question": "With respect to the network shown below, which of the following statements are true when R2 sends a packet to the 192.168.6.0/24 network? (Choose all that apply.)",
    "options": [
      "If RIPv1 is in use, the path taken will be R2 - R4 - R3",
      "If both RIPv2 and EIGRP are in use, the EIGRP route will be placed in the routing table",
      "If EIGRP is in use, the only path taken will be R2 - R4 - R3",
      "If RIPv2 is in use, the path taken will be R2 - R3"
    ],
    "correctAnswer": [1, 3],
    "explanation": "EIGRP has a lower administrative distance than RIPv2, so EIGRP route will be preferred. RIPv2 will send updates with subnet masks and find the most direct path."
  },
  {
    "id": 71,
    "question": "You have three EIGRP routers that are connected as shown in the diagram below. Router A and Router C do not seem to be exchanging information. You execute commands on all three routers, and receive as output the information shown. What needs to be done to make Routers A and C start exchanging information?",
    "options": [
      "Execute the auto-summary command on Router A",
      "Execute the network 192.168.9.0 command under EIGRP 56 on Router C",
      "Correct the IP address on the S1 interface of Router C",
      "Recreate the EIGRP configuration on Router C as EIGRP 55"
    ],
    "correctAnswer": 2,
    "explanation": "The IP address on Router C's S1 interface appears to be incorrect based on the output. Correcting the IP address would enable EIGRP adjacency with Router A."
  },
  {
    "id": 72,
    "question": "What are reasons a network administrator might want to create subnets?",
    "options": [
      "simplifies network design",
      "easier to implement security policies",
      "reduction in number of routers needed",
      "reduction in number of switches needed"
    ],
    "correctAnswer": 1,
    "explanation": "Subnetting makes it easier to implement security policies and control traffic flow. It doesn't necessarily simplify design or reduce hardware requirements."
  },
  {
    "id": 73,
    "question": "If a routing table contains multiple routes for the same destination, which were inserted by the following methods, which route will the router use to reach the destination network?",
    "options": [
      "The route inserted by RIP",
      "The route inserted by OSPF",
      "The route inserted by BGP",
      "The route configured as a static route"
    ],
    "correctAnswer": 3,
    "explanation": "Static routes have the lowest administrative distance (1) and are preferred over dynamic routing protocols (RIP AD 120, OSPF AD 110, BGP AD 20)."
  },
  {
    "id": 74,
    "question": "Which of the following is NOT a characteristic of Open Shortest Path First (OSPF)?",
    "options": [
      "Is a Cisco-proprietary routing protocol",
      "Has a default administrative distance of 110",
      "Supports authentication",
      "Uses cost as the default metric"
    ],
    "correctAnswer": 0,
    "explanation": "OSPF is an open standard protocol, not Cisco-proprietary. It has AD 110, supports authentication, and uses cost as metric."
  },
  {
    "id": 75,
    "question": "Refer to the following configuration on a Cisco router to allow Telnet access to remote users: Router(config)#line vty 0 2 Router(config-line)#login Router(config-line)#password guest. How many users can Telnet into this router at the same time?",
    "options": [
      "0",
      "1",
      "2",
      "3",
      "5"
    ],
    "correctAnswer": 3,
    "explanation": "The 'line vty 0 2' configuration allows 3 concurrent Telnet sessions (VTY 0, 1, and 2)."
  },
  {
    "id": 76,
    "question": "Your company's network must make the most efficient use of the IP address space. In the following diagram, the circles define separate network segments. The requirements of each network segment are given in the diagram. Users complain of connectivity issues. You need to discover the problems with the network configuration. What are the three problems with the network diagram?",
    "options": [
      "The 172.16.1.0/30 segment requires more user address space.",
      "The 172.16.2.0/26 segment requires more user address space.",
      "The 172.16.3.0/25 segment requires more user address space.",
      "The 172.16.2.64/26 segment requires more user address space."
    ],
    "correctAnswer": [0, 2, 3],
    "explanation": "The 172.16.1.0/30 provides only 2 usable addresses (not enough for the network segment size). /25 and /26 segments may have insufficient address space for their host requirements."
  },
  {
    "id": 77,
    "question": "Which type of Dynamic Host Configuration Protocol (DHCP) transmission is used by a host to forward a DHCPDISCOVER packet to locate a DHCP server on the network?",
    "options": [
      "unicast",
      "broadcast",
      "multicast",
      "anycast"
    ],
    "correctAnswer": 1,
    "explanation": "DHCPDISCOVER packets are sent as broadcasts (255.255.255.255) to find DHCP servers on the network."
  },
  {
    "id": 78,
    "question": "Which Cisco command will display the version and configuration data for Secure Shell (SSH)?",
    "options": [
      "show ssh",
      "show ip ssh",
      "debug ssh",
      "debug ip ssh"
    ],
    "correctAnswer": 1,
    "explanation": "'show ip ssh' displays SSH version and configuration details on a Cisco device."
  },
  {
    "id": 79,
    "question": "Your assistant has been assigned the task of configuring one end of a WAN link between two offices. The link is a serial connection and the router on the other end is a non-Cisco router. The router in the other office has an IP address of 192.168.8.6/24. The connection will not come up, so you ask your assistant to show you the commands he configured on the Cisco router. The commands he executed are shown below. What command(s) should he run to correct the configuration?",
    "options": [
      "Ciscorouter(config-if)# no ip address 192.168.8.5 Ciscorouter(config-if)# ip address 192.168.8.10",
      "Ciscorouter(config-if)# encapsulation ppp",
      "Ciscorouter(config-if)# encapsulation ansI",
      "Ciscorouter(config-if)# authentication chap"
    ],
    "correctAnswer": 1,
    "explanation": "The serial interface needs to specify the encapsulation protocol. Since the other router is non-Cisco, PPP (or HDLC) encapsulation should be configured."
  },
  {
    "id": 80,
    "question": "Which connection provides a secure CLI session with encryption to a Cisco switch?",
    "options": [
      "a console connection",
      "an AUX connection",
      "a Telnet connection",
      "an SSH connection"
    ],
    "correctAnswer": 3,
    "explanation": "SSH provides encrypted secure CLI sessions. Telnet is unencrypted, console/AUX are physical connections."
  },
  {
    "id": 81,
    "question": "A network technician is attempting to configure an interface by entering the following command: SanJose(config)# ip address 192.168.2.1 255.255.255.0. The command is rejected by the device. What is the reason for this?",
    "options": [
      "The command is missing the interface specification",
      "The IP address is incorrect",
      "The subnet mask is incorrect",
      "The router is in the wrong mode"
    ],
    "correctAnswer": 0,
    "explanation": "The 'ip address' command must be entered in interface configuration mode, not global configuration mode. The prompt shows SanJose(config)#, indicating global mode."
  },
  {
    "id": 82,
    "question": "On which switch interface would an administrator configure an IP address so that the switch can be managed remotely?",
    "options": [
      "FastEthernet0/1",
      "VLAN 1",
      "vty 0",
      "console 0"
    ],
    "correctAnswer": 1,
    "explanation": "An IP address is configured on an SVI (Switch Virtual Interface), typically VLAN 1 by default, for remote management access."
  },
  {
    "id": 83,
    "question": "Host A is configured for DHCP, but it is not receiving an IP address when it powers up. What is the most likely cause?",
    "options": [
      "The DHCP server is on the wrong subnet.",
      "Routers do not forward broadcast traffic.",
      "The DHCP server is misconfigured.",
      "Port security is enabled on the switch."
    ],
    "correctAnswer": 1,
    "explanation": "DHCP requests (broadcasts) are not forwarded by routers by default. A DHCP relay agent may be needed when DHCP server is on a different subnet."
  },
  {
    "id": 84,
    "question": "What protocol is responsible for controlling the size of segments and the rate at which segments are exchanged between a web client and a web server?",
    "options": [
      "TCP",
      "IP",
      "HTTP",
      "Ethernet"
    ],
    "correctAnswer": 0,
    "explanation": "TCP controls segment size (MSS) and flow control through windowing, managing the rate of data exchange between hosts."
  },
  {
    "id": 85,
    "question": "A technician can ping the IP address of the web server of a remote company but cannot successfully ping the URL address of the same web server. Which software utility can the technician use to diagnose the problem?",
    "options": [
      "tracert",
      "ipconfig",
      "netstat",
      "nslookup"
    ],
    "correctAnswer": 3,
    "explanation": "nslookup is used to query DNS servers to resolve hostnames to IP addresses, helping diagnose DNS resolution issues."
  },
  {
    "id": 86,
    "question": "Which command is used on a Catalyst 2950 series switch to enable basic port security on the interface?",
    "options": [
      "set port-security",
      "switchport port-security",
      "set port-security enable",
      "switchport port-security enable"
    ],
    "correctAnswer": 1,
    "explanation": "'switchport port-security' enables port security on a switch interface. The correct syntax does not include 'enable'."
  },
  {
    "id": 87,
    "question": "Which Cisco Internetwork Operating System (IOS) command is used to encrypt passwords on Cisco routers?",
    "options": [
      "password secure",
      "service encryption-password",
      "service password-encryption",
      "enable password"
    ],
    "correctAnswer": 2,
    "explanation": "'service password-encryption' in global configuration mode encrypts passwords in the running configuration using weak encryption."
  },
  {
    "id": 88,
    "question": "A network technician suspects that a particular network connection between two Cisco switches is having a duplex mismatch. Which command would the technician use to see the Layer 1 and Layer 2 details of a switch port?",
    "options": [
      "show mac-address-table",
      "show interfaces",
      "show port-security",
      "show vlan"
    ],
    "correctAnswer": 1,
    "explanation": "'show interfaces' displays detailed Layer 1 and Layer 2 information including duplex, speed, and error statistics."
  },
  {
    "id": 89,
    "question": "Where are Cisco IOS debug output messages sent by default?",
    "options": [
      "Syslog server",
      "console line",
      "memory buffers",
      "vty lines"
    ],
    "correctAnswer": 1,
    "explanation": "Debug output messages are sent to the console line by default unless specifically redirected to syslog or memory buffers."
  },
  {
    "id": 90,
    "question": "You are configuring a Cisco router. Which command would you use to convey a message regarding the remote access security policy of your organization to a user logging into the router?",
    "options": [
      "hostname",
      "banner motd",
      "description",
      "boot system",
      "terminal monitor"
    ],
    "correctAnswer": 1,
    "explanation": "'banner motd' (Message of the Day) displays a message before login, used for security policy notifications or warnings."
  },
  {
    "id": 91,
    "question": "As part of a new initiative to tighten the security of your Cisco devices, you have configured the firewall to restrict access to the devices from the outside. What would be other recommended ways of protecting the integrity of the device configuration files on the devices while ensuring your continued ability to manage the devices remotely? (Choose all that apply.)",
    "options": [
      "encrypt the configuration files",
      "use SSH to connect to the devices for management",
      "prevent the loss of administrator passwords by disabling their encryption",
      "disable the VTY ports on the devices"
    ],
    "correctAnswer": [0, 1],
    "explanation": "Encrypt configuration files (using service password-encryption or secret passwords) and use SSH for encrypted remote management are recommended security practices."
  },
  {
    "id": 92,
    "question": "A user is unable to reach the web site when typing http://www.cisco.com in a web browser, but can reach the same site by typing http://72.163.4.161. What is the issue?",
    "options": [
      "default gateway",
      "DHCP",
      "DNS resolution failure",
      "Proxy server misconfiguration"
    ],
    "correctAnswer": 2,
    "explanation": "The user can reach the site by IP address but not hostname, indicating a DNS resolution failure."
  },
  {
    "id": 93,
    "question": "You are troubleshooting a problem with two routers configured in a HSRP group. You intended to configure the routers so that Router A and Router B would each track their respective Fa0/1 interfaces and decrement their priorities for several VLAN groups if the tracked interface went down. However, you find that Router A is not taking over as the active device for the HSRP group on VLAN 101 when the Fa0/1 interface on Router B fails. Which command would NOT be useful for discovering the problem?",
    "options": [
      "show running-configuration",
      "show vlans",
      "show standby brief",
      "show standby"
    ],
    "correctAnswer": 1,
    "explanation": "'show vlans' displays VLAN information, not HSRP status. The other commands show HSRP configuration and status."
  },
  {
    "id": 94,
    "question": "A new switch is added to the network, and several production VLANs are shut down. Which of the following is a probable cause for this scenario? (Choose two.)",
    "options": [
      "The new switch has a lower configuration revision number than existing switches.",
      "The new switch has a higher configuration revision number than existing switches.",
      "The new switch is operating in transparent mode.",
      "The new switch is operating in server mode."
    ],
    "correctAnswer": [1, 3],
    "explanation": "A new switch with higher configuration revision number in server mode will propagate its VLAN configuration (likely default/no VLANs) causing loss of production VLANs."
  },
  {
    "id": 95,
    "question": "Which two statements are TRUE of Internet Protocol (IP) addressing? (Choose two.)",
    "options": [
      "Public addresses are registered with the Internet Assigned Numbers Authority (IANA).",
      "These addresses are publicly registered with the Internet Service Provider (ISP).",
      "Private addresses are allocated by the Internet Assigned Numbers Authority (IANA).",
      "The ranges of public IP addressing are 10.0.0.0 to 10.255.255.255, 172.16.0.0 to 172.31.255.255, and 192.168.0.0 to 192.168.255.255."
    ],
    "correctAnswer": [0, 2],
    "explanation": "Public IP addresses are registered and managed by IANA. The ranges listed are private IP address ranges, not public."
  },
  {
    "id": 96,
    "question": "You just finished configuring VLAN Trunking Protocol (VTP) in a network containing five switches. One of the switches is not receiving VLAN information from the switch that is acting as the server. Which of the following could NOT be a reason why the switch is not receiving the information?",
    "options": [
      "The VTP domain name on the switch may be misspelled",
      "The VTP password may be misspelled on the switch",
      "The configuration revision number may be out of sync",
      "The VTP version used on the switch may be different"
    ],
    "correctAnswer": 2,
    "explanation": "Configuration revision number being out of sync doesn't prevent reception of VLAN information - it would actually cause the switch to update its own revision. Domain name, password, and version mismatches cause issues."
  },
  {
    "id": 97,
    "question": "Which of the following commands will let you see the current operating mode for a switch port?",
    "options": [
      "show interface fastethernet0/1 detail",
      "show controllers fastethernet0/1",
      "show interface fastethernet0/1 status",
      "show interfaces fastethernet0/1 switchport"
    ],
    "correctAnswer": 3,
    "explanation": "'show interfaces fastethernet0/1 switchport' displays the administrative and operational mode (access or trunk) for a switch port."
  },
  {
    "id": 98,
    "question": "Your network is configured as shown in the following exhibit. When you trace traffic sourced from R3 destined for a LAN network off of R2 (not shown in the diagram), you see the traffic is being forwarded from R1 to ISP1 rather than to R2. Which of the following issues could NOT be causing this behavior?",
    "options": [
      "The network command has not been executed on the interface leading to the LAN off R2",
      "The passive interface command has been issued on the Gi0/4 interface of R1",
      "A default route exists on R1 that leads to ISP1",
      "RIPv2 has not been enabled on R2"
    ],
    "correctAnswer": 3,
    "explanation": "RIPv2 not being enabled on R2 would affect the routing protocol, but traffic routing decisions are made locally on R1 based on its own routing table, not R2's configuration."
  },
  {
    "id": 99,
    "question": "What IOS command produced the following output?",
    "options": [
      "show interface mac",
      "show mac",
      "show mac-address-table",
      "show ip interface"
    ],
    "correctAnswer": 2,
    "explanation": "'show mac-address-table' displays the MAC address table entries on a switch, showing VLAN, MAC address, type (static/dynamic), and port information."
  },
  {
    "id": 100,
    "question": "File Transfer Protocol (FTP) and Simple Mail Transfer Protocol (SMTP) work at which layer in the Open Systems Interconnection (OSI) model?",
    "options": [
      "the Session layer",
      "the Presentation layer",
      "the Application layer",
      "the Network layer"
    ],
    "correctAnswer": 2,
    "explanation": "FTP and SMTP are Application layer protocols that provide specific services to users and applications."
  }
];

async function seedDCCNQuizzes() {
  const client = await pool.connect();
  try {
    console.log('--- Seeding Data Communications and Computer Networks Quizzes ---');
    await client.query('BEGIN');

    // Find course
    let courseRes = await client.query("SELECT id, title, code FROM courses WHERE code = 'DCCN312' OR title ILIKE '%Data Communications%'");
    let courseId;
    let courseTitle;

    if (courseRes.rows.length === 0) {
      const ins = await client.query(`
        INSERT INTO courses (title, code, description)
        VALUES ('Data Communications and Computer Networks', 'DCCN312', 'Principles of network architectures, OSI and TCP/IP models, routing protocols, and device configurations.')
        RETURNING id, title, code
      `);
      courseId = ins.rows[0].id;
      courseTitle = ins.rows[0].title;
      console.log(`Created course: ${courseTitle} (ID: ${courseId})`);
    } else {
      courseId = courseRes.rows[0].id;
      courseTitle = courseRes.rows[0].title;
      console.log(`Found existing course: ${courseTitle} (ID: ${courseId})`);
    }

    // Delete existing practice quizzes for this course
    await client.query(`
      DELETE FROM quizzes
      WHERE course_id = $1
      AND COALESCE(quiz_type, 'quiz') = 'quiz'
      AND is_official = TRUE
      AND title LIKE $2
    `, [courseId, `${courseTitle} - Quiz %`]);

    const CHUNK_SIZE = 25; // 25 questions per quiz as requested
    const totalQuizzes = Math.ceil(questionsData.length / CHUNK_SIZE);
    let totalQuestionsInserted = 0;
    let totalOptionsInserted = 0;

    for (let i = 0; i < totalQuizzes; i++) {
      const startIdx = i * CHUNK_SIZE;
      const endIdx = Math.min((i + 1) * CHUNK_SIZE, questionsData.length);
      const chunkQuestions = questionsData.slice(startIdx, endIdx);
      const quizNumber = i + 1;
      const quizTitle = `${courseTitle} - Quiz ${quizNumber}`;
      const quizDesc = `Practice Quiz ${quizNumber} (${chunkQuestions.length} Questions)`;

      const quizRes = await client.query(`
        INSERT INTO quizzes (course_id, title, description, is_official, quiz_type, difficulty, created_at)
        VALUES ($1, $2, $3, TRUE, 'quiz', 'Medium', CURRENT_TIMESTAMP)
        RETURNING id
      `, [courseId, quizTitle, quizDesc]);
      const quizId = quizRes.rows[0].id;

      for (let qIdx = 0; qIdx < chunkQuestions.length; qIdx++) {
        const qData = chunkQuestions[qIdx];
        const isMulti = Array.isArray(qData.correctAnswer) && qData.correctAnswer.length > 1;
        const qType = isMulti ? 'multi_choice' : 'single_choice';

        const questRes = await client.query(`
          INSERT INTO questions (quiz_id, question_text, explanation, question_type)
          VALUES ($1, $2, $3, $4)
          RETURNING id
        `, [quizId, qData.question, qData.explanation || null, qType]);
        const questionId = questRes.rows[0].id;
        totalQuestionsInserted++;

        for (let optIdx = 0; optIdx < qData.options.length; optIdx++) {
          const optText = qData.options[optIdx];
          const isCorrect = Array.isArray(qData.correctAnswer) 
            ? qData.correctAnswer.includes(optIdx)
            : optIdx === qData.correctAnswer;

          await client.query(`
            INSERT INTO options (question_id, option_text, is_correct)
            VALUES ($1, $2, $3)
          `, [questionId, optText, isCorrect]);
          totalOptionsInserted++;
        }
      }

      console.log(`  Created ${quizTitle} with ${chunkQuestions.length} questions.`);
    }

    await client.query('COMMIT');
    console.log(`\n🎉 Successfully inserted ${totalQuizzes} quizzes, ${totalQuestionsInserted} questions, and ${totalOptionsInserted} options for ${courseTitle}!`);

    // Update course-material/quiz.json
    const quizJsonPath = path.join(__dirname, '..', 'course-material', 'quiz.json');
    if (fs.existsSync(quizJsonPath)) {
      const raw = fs.readFileSync(quizJsonPath, 'utf-8');
      const parsed = JSON.parse(raw);
      const list = parsed['quiz-exam'] || [];

      const existingIdx = list.findIndex(c => c.course && (c.course.toLowerCase().includes('data communication') || c.course.toLowerCase().includes('network device and configuration (additional)')));
      const formattedEntry = {
        course: "Data Communications and Computer Networks",
        questions: questionsData
      };

      if (existingIdx >= 0) {
        list[existingIdx] = formattedEntry;
      } else {
        list.push(formattedEntry);
      }
      parsed['quiz-exam'] = list;
      fs.writeFileSync(quizJsonPath, JSON.stringify(parsed, null, 4), 'utf-8');
      console.log(`✅ Updated course-material/quiz.json with Data Communications and Computer Networks!`);
    }

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding DCCN quizzes:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seedDCCNQuizzes();
