# Beldex Binance Bridge

### Features:
- [x] Swap BDX to B-BDX.
- [x] Swap B-BDX to BDX.
- [x] See balance of BDX and B-BDX accounts.
- [x] Process all BDX and B-BDX swaps.
- [x] Print invalid transactions

| Folder | Description |
| --- | --- |
| api | The api server for the bridge. This is also where the swap processing happens |
| bridge-core | Shared code between the `api` and `processing` |
| beldex-bridge | The front end for the bridge |
| processing | The processing logic for the bridge |

#### Build instructions

Each of the modules are designed so they can be run on different servers. As such all relevant building instructions are placed inside the folders.

##### Credits

The beldex binance bridge uses parts of the Fantom Foundation bridge which can be found here https://github.com/Fantom-foundation/bnbridge.exchange
