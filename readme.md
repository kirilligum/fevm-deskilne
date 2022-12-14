


<img src="https://github.com/kirilligum/fevm-deskilne/blob/main/images/DALL%C2%B7E%202022-11-20%2011.53.18%20-%20stainglass%20DEcentralized%20social%20network%20of%20computer%20programmers%20for%20HACKathons%20.png" width="240">
# Switch

Decentralized network for creators and builders with JSON resume on IPFS and smart contract for referral tokenomics

## Team

<img src="https://github.com/kirilligum/fevm-deskilne/blob/main/images/Screenshot%202022-11-20%20130338%20team%20cover.png" width="480">

- Artem -- Solidity, front-end
- Stanislaw -- Front-end
- Kirill -- Product, solidity

## Description

- **traditional** professional networks are not user-friendly for engineers. we want to control the data, see real connections, and avoid useless spam.
- on Sw/.tch, users create and host their profiles in the form of a standardized **JSON on IPFS**. benefit: data control, anyone can scrape and search using their own tools without the limitation of traditional UI
- when 2 users worked together or know each other well, they can **stake** FIL (or other payment tokens) into their connection. think of it as a twitter blue mark but for connections instead of profiles
- if one user wants an **introduction** to a friend of a friend in the network, they pay a fee.
- stakes in connections have voting rights in a **DAO**  that decide on fees, investment strategy, and rewards
- FEVM **marketplace** controls the hosting of the profile data on IPFS

## UI Flow

### a user logs in with a wallet
<img src="https://github.com/kirilligum/fevm-deskilne/blob/main/images/switch%20welcome.png" width="240">

### the user creates a profile by uploading or creating their resume
<img src="https://github.com/kirilligum/fevm-deskilne/blob/main/images/profile.png" width="240">

### you can manage friend requests and referrals 
the ui is in progress but smartcontracts are there

<img src="https://github.com/kirilligum/fevm-deskilne/blob/main/images/connection.png" width="240">

## How it works

### creates profile by uploading resume to IPFS, and managing the CID of the resume in the marketplace of storage providers
<img src="https://github.com/kirilligum/fevm-deskilne/blob/main/images/Screenshot%202022-11-20%20115942%20create%20profile.png" width="240">

### send payment with a friend request and accept friend requests by sending the same amount. the connection will be visible and the payments are staked and controlled by DAO
<img src="https://github.com/kirilligum/fevm-deskilne/blob/main/images/Screenshot%202022-11-20%20120055%20friend%20request.png" width="240">

### to get an introduction, your friend, creates an introduction request that the person that asks for introduction has to pay into and the person that receives the introduction gets paid for.
<img src="https://github.com/kirilligum/fevm-deskilne/blob/main/images/Screenshot%202022-11-20%20120219%20introduce.png" width="240">

### details

we used FEVM client deal market manager, erc20vote, IPFS

# Developers
start by cloning the repository
