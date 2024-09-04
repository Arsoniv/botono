function addShopItem(name, ps, cost, itemid, isDaily, gemspersecond, location, rarity, list) {
    const newE = document.createElement('div');
    const title = document.createElement('p');
    const price = document.createElement('p');
    const buyButton = document.createElement('button');
    
    newE.style.border = "solid white 1px";
    newE.style.height = "40px";
    newE.style.padding = "5px";
    newE.style.display = "grid";
    newE.style.margin = "5px";
    newE.style.borderRadius = "5%";
    newE.style.gridTemplateColumns = "1fr 40px";
    newE.style.gridTemplateRows = "auto auto";

    title.innerText = name;
    title.style.margin = "0";
    title.style.fontSize = "20px";
    title.style.gridColumn = "1"; 

    price.innerText = `$${cost} | $${ps}/sec | ${gemspersecond}/sec`;
    price.style.margin = "0";
    price.style.fontSize = "12px";
    price.style.gridColumn = "1/3"; 

    buyButton.innerText = "Buy";
    buyButton.style.backgroundColor = "#70f04d";
    buyButton.style.border = "solid white 1px"
    buyButton.style.borderRadius = "5%";
    buyButton.style.gridColumn = "2"; 
    buyButton.style.gridRow = "1"; 
    buyButton.setAttribute("onclick", "buyItem(" + location + ", " + itemid + ", " + cost + ", '" + name + "', " + ps + ", " + gemspersecond + ", '" + rarity + "')");

    
    newE.appendChild(title);
    newE.appendChild(price);
    newE.appendChild(buyButton);

    // Append container to the document
    document.getElementById("list"+list).appendChild(newE);
}

function addUserToLB(name, coins, list) {
    const newE = document.createElement('div');
    const title = document.createElement('p');
    const coinsd = document.createElement('p');
    
    newE.style.border = "solid white 1px";
    newE.style.height = "40px";
    newE.style.padding = "5px";
    newE.style.display = "grid";
    newE.style.margin = "5px";
    newE.style.borderRadius = "5%";
    newE.style.gridTemplateColumns = "1fr 40px";
    newE.style.gridTemplateRows = "auto auto";

    title.innerText = name;
    title.style.margin = "0";
    title.style.fontSize = "20px";
    title.style.gridColumn = "1"; 

    coinsd.innerText = `$${coins}`;
    coinsd.style.margin = "0";
    coinsd.style.fontSize = "12px";
    coinsd.style.gridColumn = "1/3"; 
    
    newE.appendChild(title);
    newE.appendChild(coinsd);

    // Append container to the document
    document.getElementById("list"+list).appendChild(newE);
}



function addOwnedItem(name, ps, cost, gemspersecond, rarity, amount, isp, list) {
    const itemList = document.getElementById("list"+list);

    // Create a new item div if it doesn't exist
    itemDiv = document.createElement('div');
    const title = document.createElement('p');
    const price = document.createElement('p');

    // Style the container
    if (isp === 0) {
        itemDiv.style.border = "solid white 1px";
    }else {
        itemDiv.style.border = "dashed white 1px";
    }
    itemDiv.style.height = "40px"; // Adjust height as needed
    itemDiv.style.padding = "5px";
    itemDiv.style.display = "grid";
    itemDiv.style.margin = "5px";
    itemDiv.style.borderRadius = "5%";
    itemDiv.style.gridTemplateColumns = "1fr 80px"; // Two columns
    itemDiv.style.gridTemplateRows = "auto auto"; // Two rows with automatic height

    // Style the title
    title.innerText = name;
    title.style.margin = "0";
    title.style.fontSize = "20px";
    title.style.gridColumn = "1 / span 2"; // Span both columns

    // Style the price
    price.style.margin = "0";
    price.style.fontSize = "12px";
    price.style.gridColumn = "1 / span 2"; // Span both columns
    price.innerText = `$${cost} | $${ps}/sec | ${gemspersecond}/sec |  ${amount}x`;

    itemDiv.appendChild(title);
    itemDiv.appendChild(price);

    itemList.appendChild(itemDiv);
}
