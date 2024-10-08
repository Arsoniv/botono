let list1 = "inventory";
let list2 = "shop";

let lastServerInventory = [];

const rarityColors = {
    common: '#ffffff', // White
    uncommon: '#00ff00', // Green
    rare: '#0000ff', // Blue
    epic: '#a020f0', // Purple
    legendary: '#ffcc00', // Gold
};
  
function getColorByRarity(rarity) {
    return rarityColors[rarity] || '#cccccc';
}

const getAllPlayersEndpoint = 'https://botono.vercel.app/api/getAllPlayers';
const queryAccountEndpoint = 'https://botono.vercel.app/api/signIn';
const getInventoryEndpoint = 'https://botono.vercel.app/api/getInventory';
const buyEndpoint = 'https://botono.vercel.app/api/buy';
const getShopEndpoint = 'https://botono.vercel.app/api/getShop';
const verifyEarningsEndpoint = 'https://botono.vercel.app/api/verifyProfit';

const userName = localStorage.getItem("username");





const passWord = localStorage.getItem("password");

//elements
let clickBox;
let gemDisplay;

//currencys
let total = 0;
let clicks = 0;
let totalGems = 0;  

let earnedCoins = 0;
let earnedGems = 0;

//item arrays
let inventory = [];
let dailyDrops = [];
let shop = [];



//counter manipulation

function update() {
    clickBox.innerText = total + clicks + earnedCoins;
    gemDisplay.innerText = totalGems + earnedGems;
    
    //clickBox.classList.remove('click');
    //void clickBox.offsetWidth; 
    //clickBox.classList.add('click');
}

function incrementClicks() {
    clicks++;
    update();
    
    clickBox.classList.remove('click');
    void clickBox.offsetWidth; 
    clickBox.classList.add('click');
}

function clientSideEarn() {
    inventory.forEach(item => {
        earnedCoins = earnedCoins + (item.coinspersecond * item.amount);
        earnedGems = earnedGems + (item.gemspersecond * item.amount);
    });
    update();
}

//redirect to login page if not logged in
if (userName == null) {
    window.location.href = "https://botono.vercel.app/";    
}

function logOut() {

    localStorage.clear();

    window.location.href = "https://botono.vercel.app/";
}

async function getInventory() {
    const data = {  
        userName: userName,
    };

    const response = await fetch(getInventoryEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    result = await response.json();

    inventory = result.userInventory;

    if (list1 === "inventory") {
        document.getElementById("list1").innerHTML = '';

        inventory.forEach(item => {
            addOwnedItem(item.itemname, item.coinspersecond, item.value, item.gemspersecond, item.rarity, item.amount, 0, 1);
        });
    }
    if (list2 === "inventory") {
        document.getElementById("list2").innerHTML = '';

        inventory.forEach(item => {
            addOwnedItem(item.itemname, item.coinspersecond, item.value, item.gemspersecond, item.rarity, item.amount, 0, 2);
        });
    }
}

async function earn() {

    const data = {  
        userName: userName,
        passWord: passWord,
        coinsEarned: earnedCoins,
        gemsEarned: earnedGems,
        clicks: clicks
    };

    const verifyResponse = await fetch(verifyEarningsEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = (await verifyResponse.json());

    if (result.v === 1) {
        
        earnedCoins = earnedCoins - result.addedcoins;
        earnedGems = earnedGems - result.addedgems;

        clicks = clicks - result.clicks;
    }else {
        earnedCoins = 0;
        earnedGems = 0;
        clicks = 0;
    }

    if (earnedGems < 0) {
        earnedGems = 0;
    }

    if (earnedCoins < 0) {
        earnedCoins = 0;
    }

    total = total + result.addedcoins + result.clicks;
    totalGems = totalGems + result.addedgems;

    update();

}

function sortPlayersByCoins(players) {
    return players.slice().sort((a, b) => b.coins - a.coins);
}

async function updateLeaderBoard() {
    const response = await fetch(getAllPlayersEndpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    playerList = sortPlayersByCoins((await response.json()).players);

    if (list1 === "leaderboard") {
        document.getElementById('list1').innerHTML = '';
        playerList.forEach(player => {
            addUserToLB(player.username, player.coins, 1);
        });
    }
    if (list2 === "leaderboard") {
        document.getElementById('list2').innerHTML = '';
        playerList.forEach(player => {
            addUserToLB(player.username, player.coins, 2);
        });
    }

}

async function buyItem(location, itemid, cost, name, ps, gemspersecond, rarity) {

    console.log("buy item");
    if (total < cost) {
        alert("Your Broke")
    }else {

        console.log("not broke");
        const data = {
            userName: userName,
            passWord: passWord,
            itemid: itemid,
            location: location
        }

        if (list1 === "inventory") {
            addOwnedItem(name, ps, cost, gemspersecond, rarity, 1, 1, 1);   
        }
        if (list2 === "inventory") {
            addOwnedItem(name, ps, cost, gemspersecond, rarity, 1, 1, 2);   
        }

        total = total - cost;

        const response = await fetch(buyEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        getInventory();

    }
}

async function getShop() {
    const response = await fetch(getShopEndpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const result = (await response.json());
    
    dailyDrops = result.dailydrops;
    shop = result.shop;



    if (list1 === "shop") {
        document.getElementById("list1").innerHTML = '';

        shop.forEach(item => {
            addShopItem(item.itemname, item.coinspersecond, item.price, item.itemid, true, item.gemspersecond, 0, item.rarity, 1)
        });
        dailyDrops.forEach(item => {
            addShopItem(item.itemname, item.coinspersecond, item.price, item.itemid, true, item.gemspersecond, 1, item.rarity, 1)
        });
    }
    if (list2 === "shop") {
        document.getElementById("list2").innerHTML = '';

        shop.forEach(item => {
            addShopItem(item.itemname, item.coinspersecond, item.price, item.itemid, true, item.gemspersecond, 0, item.rarity, 2)
        });
        dailyDrops.forEach(item => {
            addShopItem(item.itemname, item.coinspersecond, item.price, item.itemid, true, item.gemspersecond, 1, item.rarity, 2)
        });
    }
}

async function getUserData() {
    const data = {  
        userName: userName,
        passWord: passWord
    };

    const response = await fetch(queryAccountEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const result = (await response.json()).user;
    console.log(result);
    total = parseInt(result.coins);
    totalGems = parseInt(result.gems);

    getInventory();
    getShop();

    setInterval(getInventory, 500);
    setInterval(getShop, 10000);
    setInterval(updateLeaderBoard, 10000);
    setInterval(earn, 10000);
    setInterval(clientSideEarn, 1000);
    setInterval(update, 200);
    update();
}

function updateLists() {
    getInventory();
    getShop();
    updateLeaderBoard();
}

document.addEventListener("DOMContentLoaded", function() {
    clickBox = document.getElementById("clickbox");
    gemDisplay = document.getElementById("gemDisplay");


    document.getElementById('list2s').addEventListener("change", function(){
        list2 = document.getElementById('list2s').value;
        updateLists();
    })
    
    document.getElementById('list1s').addEventListener("change", function(){
        list1 = document.getElementById('list1s').value;
        updateLists();
    })

    clickBox.addEventListener('animationend', () => {
        clickBox.classList.remove('click');
        clickBox.style.backgroundColor = "#151726";
    });

    getUserData();

    clickBox.addEventListener("click", incrementClicks);
});