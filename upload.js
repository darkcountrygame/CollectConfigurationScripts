const heroes_names = [
    "americanmavka",
    "cemeterygolem",
    "crowman",
    "furywerebear",
    "ghostwithflute",
    "ghoul",
    "goldman",
    "grannibal",
    "harpy",
    "mageinskull"]

const rarity = [
    "common",
    "rare",
    "epic",
    "legendary",
    "mythical"
]

const rare_stats = [
    [100, 10, 20],
    [100, 10, 25],
    [100, 15, 20],
    [100, 15, 25],
    [125, 10, 20],
    [125, 10, 25],
    [125, 15, 20],
    [125, 15, 25]
]

const epic_stats = [
    [125, 15, 25],
    [125, 15, 30],
    [125, 20, 25],
    [125, 20, 30],
    [150, 15, 25],
    [150, 15, 30],
    [150, 20, 25],
    [150, 20, 30]
]

const legendary_stats = [
    [150, 20, 30],
    [150, 20, 35],
    [150, 25, 30],
    [150, 25, 35],
    [175, 20, 30],
    [175, 20, 35],
    [175, 25, 30],
    [175, 25, 35]
]

const mythical_stats = [
    [200, 30, 40],
    [200, 30, 45],
    [200, 35, 40],
    [200, 35, 45],
    [225, 30, 40],
    [225, 30, 45],
    [225, 35, 40],
    [225, 35, 45]
]

const stats_map = {
    "common": [],
    "rare": rare_stats,
    "epic": epic_stats,
    "legendary": legendary_stats,
    "mythical": mythical_stats
}

import * as fs from 'fs'
const data = fs.readFileSync('cards.json', 'utf8')
const jsonData = JSON.parse(data)

let common_cards = []
let rare_cards = []
let epic_cards = []
let legenedary_cards = []
let mythical_cards = []

for (let card of jsonData) {
    if (card["rarity"] == "Common") {
        common_cards.push(card)
    }
    else if (card["rarity"] == "Rare") {
        rare_cards.push(card)
    }
    else if (card["rarity"] == "Epic") {
        epic_cards.push(card)
    }
    else if (card["rarity"] == "Legendary") {
        legenedary_cards.push(card)
    }
    else if (card["rarity"] == "Mythical") {
        mythical_cards.push(card)
    }
}

const cards = {
    "common": common_cards,
    "rare": rare_cards,
    "epic": epic_cards,
    "legendary": legenedary_cards,
    "mythical": mythical_cards
}

const common_land = {
    "name": "Common Land",
    "img": "QmdGwHSnS23NXgCCoL23xdzFahnNEHyXJsKCKtDFLEDBh7",
    "rarity": "common",
    "limit": "3140"
}

const rare_land = {
    "name": "Rare Land",
    "img": "QmaHGXwywbE9H3SkRQ1Dj6QccRmz1nSv2t5HDHJo6PPDm7",
    "rarity": "rare",
    "limit": "600"
}

const epic_land = {
    "name": "Epic Land",
    "img": "QmbBdXNvPTccDxohZRoQaLm6LPuzEZeWrCRvgeahM1QSHc",
    "rarity": "epic",
    "limit": "200"
}

const legendary_land = {
    "name": "Legendary Land",
    "img": "QmWiVq9aFKpZs3Ubbx4MmdpYxQUreMa35afePWXN5DXHhP",
    "rarity": "legendary",
    "limit": "50"
}

const mythical_land = {
    "name": "Mythical Land",
    "img": "QmRYt4TzBCgm64uAqCsaQAZmgucDPeE149bJ657Pd5ZgeV",
    "rarity": "mythical",
    "limit": "10"
}

const lands = [
    common_land,
    rare_land,
    epic_land,
    legendary_land,
    mythical_land
]

const cards_pack = {
    "name": "Common Pack",
    "rarity": "common",
    "img": "https://cdn.darkcountry.io/cardsPacks/common.png",

    "common": "619",
    "rare": "310",
    "epic": "60",
    "legendary": "10",
    "mythical": "1",

    "quantity": "5",
    "packtype": "card"
}

const heroes_pack = {
    "name": "Hero Pack",
    "rarity": "rare",
    "img": "https://cdn.darkcountry.io/ChangelingsHeroes/HeroPackChangelings.png",

    "common": "0",
    "rare": "600",
    "epic": "321",
    "legendary": "78",
    "mythical": "1",

    "quantity": "5",
    "packtype": "hero"
}

const packs = [
    cards_pack,
    heroes_pack
]

import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

const contract_private_key = new Ed25519PrivateKey(PRIVATE_KEY);
const contract_account = Account.fromPrivateKey({ privateKey: contract_private_key });
const module_address = "0x1ac6713de2cf42540ec69783ed0efe12e363fc0161653b9059008950d6bd0303";

async function add_hero_template(index, hero) {
    const param_names = ["Name", "Energy", "Health", "Bagspace", "Rarity", "Type"]
    const param_values = [hero['Name'], hero['Energy'], hero['Health'], hero['Bagspace'], hero['Rarity'], "Hero"];
    const args = [
        index,
        hero['Name'],
        "",
        hero['Image'],
        param_names,
        param_values
    ];

    const transaction = await aptos.transaction.build.simple(
        {
            sender: contract_account.accountAddress,
            data: {
                function: `${module_address}::templates::add_template`,
                functionArguments: args
            }
        }
    );

    const senderAuth = await aptos.signAndSubmitTransaction({ signer: contract_account, transaction });
    const response = await aptos.waitForTransaction({
        transactionHash: senderAuth.hash,
    });
}

function add_card_template(index, card) {

}

function add_land_template(index, land) {

}

function add_pack_template(index, pack) {

}

let index = 0

for (let token_rarity of rarity) {
    for (let hero_name of heroes_names) {
        for (let hero_stats of stats_map[token_rarity]) {

            let energy = hero_stats[0].toString()
            let bagspace = hero_stats[1].toString()
            let health = hero_stats[2].toString()

            let img = "https://cdn.darkcountry.io/ChangelingsHeroes/" + hero_name + "_" + token_rarity + "_" + energy + "_" + bagspace + "_" + health + ".png";

            let hero = {
                "Name": hero_name,
                "Image": img,
                "Rarity": token_rarity,
                "Energy": energy,
                "Health": health,
                "Bagspace": bagspace
            }

            const param_names = ["Name", "Energy", "Health", "Bagspace", "Rarity", "Type"]
            const param_values = [hero['Name'], hero['Energy'], hero['Health'], hero['Bagspace'], hero['Rarity'], "Hero"];
            const args = [
                index,
                hero['Name'],
                "",
                hero['Image'],
                param_names,
                param_values
            ];

            console.log(args)

            const transaction = await aptos.transaction.build.simple(
                {
                    sender: contract_account.accountAddress,
                    data: {
                        function: `${module_address}::templates::add_template`,
                        functionArguments: args
                    }
                }
            );

            const senderAuth = await aptos.signAndSubmitTransaction({ signer: contract_account, transaction });
            const response = await aptos.waitForTransaction({
                transactionHash: senderAuth.hash,
            });

            index++
        }
    }

    for (let card of cards[token_rarity]) {
        const param_names = ["Name", "Rarity", "Type"]
        const param_values = [card['name'], token_rarity, "Card"];
        const args = [
            index,
            card['name'],
            "",
            card['imageLink'],
            param_names,
            param_values
        ];

        console.log(args);

        const transaction = await aptos.transaction.build.simple(
            {
                sender: contract_account.accountAddress,
                data: {
                    function: `${module_address}::templates::add_template`,
                    functionArguments: args
                }
            }
        );

        const senderAuth = await aptos.signAndSubmitTransaction({ signer: contract_account, transaction });
        const response = await aptos.waitForTransaction({
            transactionHash: senderAuth.hash,
        });

        index++;
    }
}

for (let land of lands) {
    const param_names = ["Name", "Rarity", "Limit", "Type"]
    const param_values = [land['name'], land['rarity'], land['limit'], "Land"];
    const img = `https://ipfs.io/ipfs/${land['img']}?filename=${land['img']}`;

    const args = [
        index,
        land['name'],
        "",
        img,
        param_names,
        param_values
    ];

    console.log(args);

    const transaction = await aptos.transaction.build.simple(
        {
            sender: contract_account.accountAddress,
            data: {
                function: `${module_address}::templates::add_template`,
                functionArguments: args
            }
        }
    );

    const senderAuth = await aptos.signAndSubmitTransaction({ signer: contract_account, transaction });
    const response = await aptos.waitForTransaction({
        transactionHash: senderAuth.hash,
    });

    index++
}

for (let pack of packs) {
    const param_names = ["Name", "Rarity", "Type", "common", "rare", "epic", "legendary", "mythical", "quantity", "packtype"]
    const param_values = [pack['name'], pack['rarity'], "Pack", pack['common'], pack['rare'], pack['epic'], pack['legendary'], pack['mythical'], pack['quantity'], pack['packtype']]

    const args = [
        index,
        pack['name'],
        "",
        pack['img'],
        param_names,
        param_values
    ];

    console.log(args);

    const transaction = await aptos.transaction.build.simple(
        {
            sender: contract_account.accountAddress,
            data: {
                function: `${module_address}::templates::add_template`,
                functionArguments: args
            }
        }
    );

    const senderAuth = await aptos.signAndSubmitTransaction({ signer: contract_account, transaction });
    const response = await aptos.waitForTransaction({
        transactionHash: senderAuth.hash,
    });

    index++
}
