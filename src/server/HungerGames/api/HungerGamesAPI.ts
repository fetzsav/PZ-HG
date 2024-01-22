
/**
 * @noSelfInFile
 *
 * NOTE: Use this at the top of your TypeScript files. This prevents functions & methods
 *       from prepending a 'self' reference, which is usually not necessary and complicates
 *       rendered Lua code.
 */

import { InventoryContainer, IsoPlayer, ItemContainer, getConnectedPlayers, isClient, isServer, sendServerCommand, triggerEvent } from "@asledgehammer/pipewrench";
import { onClientCommand } from "@asledgehammer/pipewrench-events";


interface HungerGame {
    players: HungerGamePlayer[];
    remainingPlayers: number;
    maxPlayers: number;
    started: boolean;
    matchmaking: boolean;
    inventories: Map<IsoPlayer, ItemContainer>;
}


interface HungerGamePlayer {
    isoPlayer: IsoPlayer;
    kills: number;
    deaths: number;
    isAlive: boolean;
    isInGame: boolean;
}


export function enableHungerGames() {
    const game: HungerGame = {
        players: [],
        remainingPlayers: 0,
        maxPlayers: 8,
        started: false,
        matchmaking: false,
        inventories: new Map<IsoPlayer, ItemContainer>(),
    };
    
    if (!game.started) {
        return;
    }

}

export function startMatchMaking(game: HungerGame) {
    game.matchmaking = true;
    print("Hunger Games matchmaking started. Please use the /hg join command to join the game.");
    addHandleJoinListener(game);
}

export function addHandleJoinListener(game: HungerGame) {
    onClientCommand.addListener((module, command, player, args) => {
        if (isClient()) return; // dont execute on clients
        // if (module != "zombiehk") return
        if (command == "hg join") {
            if (isServer()) {
                print("Server received hg join from " + player.getName());
                const hgplayer: HungerGamePlayer = {
                    isoPlayer: player,
                    kills: 0,
                    deaths: 0,
                    isAlive: true,
                    isInGame: false,
                };
                game.players.push(hgplayer);
                game.remainingPlayers++;
            }
            else {
            // print("Server received hg join from " + player.getName());
            // // send hack for single-player
            }
        }
      })
}


export function startGame(game: HungerGame) {
    for (let index = 0; index < game.players.length; index++) {
        const hgplayer: HungerGamePlayer = game.players[index];
        if (!hgplayer.isInGame) {
            // save inventory
            game.inventories.set(hgplayer.isoPlayer, hgplayer.isoPlayer.getInventory());
            //clear inventory
            hgplayer.isoPlayer.getInventory().clear();
            
        }
    }
}