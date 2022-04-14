console.log("Hello World!")

// connect to Moralis server
const serverUrl = "https://requdfa5ov5t.usemoralis.com:2053/server";
const appId = "trmV7FEen6yLodqryJKieWzaDIbIezTxBdy7FhHs";
Moralis.start({ serverUrl, appId });

let homepage = "http://127.0.0.1:5500/index.html"

if (Moralis.User.current() == null && window.location.href != homepage) {
    document.querySelector('body').style.display = 'none';
    window.location.href = 'index.html';
}  

login = async() => {
    await Moralis.authenticate().then(async function (user) {
        console.log("Logged in")
        user.set("name", document.getElementById('user-username').value);
        user.set("email", document.getElementById('user-email').value);
        await user.save();
        
        window.location.href = "dashboard.html"
    })
}

logout = async () => {
    await Moralis.User.logOut();
    window.location.href = "index.html"
}

getTransactions = async() => {
    const options = {
        chain: "rinkeby",
        address: "0x401C13C5E43e90b3A2DB0B33123286211e546105",
      };
      const transactions = await Moralis.Web3API.account.getTransactions(options);
      console.log(transactions)

      if(transactions.total > 0){
          let table = `
          <table class="table">
          <thead>
              <tr>
                  <th scope="col">Transaction</th>
                  <th scope="col">Block Number</th>
                  <th scope="col">Age</th>
                  <th scope="col">Type</th>
                  <th scope="col">Fee</th>
                  <th scope="col">Value</th>
              </tr>
          </thead>
            <tbody id="theTransactions"></tbody>
          </table>
          `
          document.querySelector('#tableOfTransactions').innerHTML = table

          transactions.result.forEach(t => {
              let content = `
              <tr>
                  <td><a href='https://rinkeby.etherscan.io/tx/${t.hash}' target="_blank" rel="noopener noreferrer">${t.hash}</a></td>
                  <td><a href='https://rinkeby.etherscan.io/block/${t.block_number}' target="_blank" rel="noopener noreferrer">${t.block_number}</a></td>
                  <td>${t.block_timestamp}</td>
                  <td>${t.from_address}</td>
                  <td>${((t.gas * t.gas_price) / 1e18).toFixed(5)} ETH</td>
                  <td>${t.value / 1e18} ETH</td>
              </tr>
              `
            theTransactions.innerHTML += content;
          });
      }
}

millisecondsToTime = (ms) => {
    let minutes = (ms / (1000 * 60));
    let hours = (ms / (1000 * 60 * 60))
    let days = (ms / (1000 * 60 * 60 * 24))

    if(days < 1){
        if(hours < 1){
            if(minutes < 1){
                return `less than a minute ago`
            } else return `${minutes} minute(s) ago`
        } else return `${hours} hour(s) ago`
    } else return `${days} day(s) ago`
}

if (document.querySelector('#btn-login') != null){
    document.querySelector('#btn-login').onclick = login;
}

if(document.querySelector('#btn-logout') != null){
    document.querySelector('#btn-logout').onclick = logout;
}

if(document.querySelector('#get-transactions-link') != null){
    document.querySelector('#get-transactions-link').onclick = getTransactions;
}

//get-transactions-link
//get-balances-link
//get-nfts-link