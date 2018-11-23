# fomo3d

## 部署順序

p3d.sol
- deploy contract: Hourglass

devies.sol
- 改 hourglass address
- deploy contract: Divies

bank.sol
- deploy contract: Bank
- setWithdrawer()

community.sol
- deploy contract: JLincForwarder
- setup(bank_contract_address)

teamLJIT.sol
- deploy contract: TeamJust
- setup(community_contract_address)

playerbook.sol
- 改 JLincForwarder, TeamJust address
- deploy contract: PlayerBook

fomo3d.sol
- 改 Divies, JLincForwarder, PlayerBook address
- deploy contract: PlayerBook

playerbook
- addGame(fomo3d_contract_address)

fomo3d
- activate()
