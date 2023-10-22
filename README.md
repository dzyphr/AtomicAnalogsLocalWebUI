# Atomic Analogs Local WebUI


#### Hugo Based Web User Interface for interacting with Atomic Swaps



## NOTE: Project is in Alpha / Testnet Phase 
## Actively Seeking Contributions and Feedback


![Demo](https://raw.githubusercontent.com/dzyphr/AtomicAnalogsLocalWebUI/main/assets/images/DemoScreenShot1.png "Demo ScreenShot")

## Key Features

* Locally hosted for security
  - Hosted along with Atomic API and Client REST API
  - Performs operations completely offline
  - Calls private Client REST API to handle Atomic Cryptography Operations Completely Offline
  - Calls public Server REST API endpoints to perform signing rounds
* Goal to be Customizable
  - Hugo enables lots of pathways for updating the theme on the fly without affecting functionality
* Simplifies the Client's Atomic Swap Experience
  - Minimal interactivity,  
  - Enables familiar UX to other DEXs or P2P exchanges
  - Future price feed integration can be used for further opt in interactivity reduction


## How To Run

#### Ubuntu:

To clone and build this application, you'll need:
[Git](https://git-scm.com)
and
[Hugo](https://gohugo.io/)

 Keep in mind if this id Alpha software that will have lots bugs in it still.
 It also requires [AtomicAPI](https://github.com/dzyphr/atomicAPI)  and [Atomic_Analogs_client_RESTAPI](https://github.com/dzyphr/Atomic_Analogs_client_RESTAPI) to work.
 A comprehensive build script will be provided for assembling the entire software.
 Attempting to do it manually at this stage is not recommended


```bash
# Clone this repository
$ git clone 

# Go into the repository
$ cd AtomicAnalogsLocalWebUI

# Run hugo server
$ hugo server --buildDrafts --disableFastRender

# WebUI should now be running on localhost (usually port 1313 if nothing else is running on hugo server or that port)

```

## License

GPL3

## Contact

Discord:
[AtomicAnalogs](https://discord.gg/VDJGszpW58)  | [Ergo](https://discord.gg/ergo-platform-668903786361651200)





