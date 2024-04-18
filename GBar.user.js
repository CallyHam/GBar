// ==UserScript==
// @name         GBar
// @namespace    https://www.github.com/CallyHam
// @version      1.3.2
// @description  Bring back the gbar.
// @author       CallyHam
// @match        *://*.google.com/*
// @run-at       document-body
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL  https://github.com/CallyHam/GBar/raw/main/GBar.user.js
// @updateURL    https://github.com/CallyHam/GBar/raw/main/GBar.user.js
// ==/UserScript==

var accountInfo
var accountName
var accountEmail

var gBar = document.createElement('div');
var settingsPage = document.createElement('div');

function getUrl() {
    var currentFocused = document.getElementsByClassName('gbar-link-active')[0];
    if (window.location.href.indexOf("tbm=isch") > -1 || window.location.href.indexOf("imghp") > -1 || window.location.href.indexOf("images.google.com") > -1) {
        currentFocused.classList.remove('gbar-link-active')
        document.getElementById('gbar-link-images').classList.add('gbar-link-active')
    } else if (window.location.href.indexOf("tbm=vid") > -1 || window.location.href.indexOf("videohp") > -1) {
        currentFocused.classList.remove('gbar-link-active')
        document.getElementById('gbar-link-videos').classList.add('gbar-link-active')
    } else if (window.location.href.indexOf("maps.google.com") > -1 || window.location.href.indexOf("google.com/maps") > -1) {
        currentFocused.classList.remove('gbar-link-active')
        document.getElementById('gbar-link-maps').classList.add('gbar-link-active')
    } else if (window.location.href.indexOf("news.google.com") > -1 || window.location.href.indexOf("tbm=nws") > -1) {
        currentFocused.classList.remove('gbar-link-active')
        document.getElementById('gbar-link-news').classList.add('gbar-link-active')
    } else if (window.location.href.indexOf("shopping.google.com") > -1 || window.location.href.indexOf("tbm=shop") > -1) {
        currentFocused.classList.remove('gbar-link-active')
        document.getElementById('gbar-link-shopping').classList.add('gbar-link-active')
    } else if (window.location.href.indexOf("mail.google.com") > -1) {
        currentFocused.classList.remove('gbar-link-active')
        document.getElementById('gbar-link-gmail').classList.add('gbar-link-active')
    }
}

async function detectAccountStatus() {
    var accountButton = document.getElementById('gbar-link-account')
    accountInfo = document.querySelectorAll('a[aria-label*="Google Account"]')[0]
    if (accountInfo) {
        var accountInfoSplit = accountInfo.getAttribute('aria-label').replace("(", "").replace(")", "").replace("Google Account: ", "").replace("\n", "").split('  ')
        accountName = accountInfoSplit[0]
        accountEmail = accountInfoSplit[1]
        return true;
    } else {
        return false;
    }
}
async function applySettings() {
    var styleSelect = await GM.getValue("styleSelect", "2011");
    var accountSelect = await GM.getValue("accountSelect", "name");
    var linkSelect = await GM.getValue("linkSelect", "web");

    switch (styleSelect) {
        case "2009":
            var gbar2009 = 'https://raw.githubusercontent.com/CallyHam/GBar/main/pages/2009.html'
            var gbar2009Response = await fetch(gbar2009);
            var gbar2009Data = await gbar2009Response.text();
            gBar.classList.add('gbar');
            gBar.innerHTML = gbar2009Data
            document.body.insertBefore(gBar, document.body.firstChild);
            break
        case "2010":
            var gbar2010 = 'https://raw.githubusercontent.com/CallyHam/GBar/main/pages/2010.html'
            var gbar2010Response = await fetch(gbar2010);
            var gbar2010Data = await gbar2010Response.text();
            gBar.classList.add('gbar');
            gBar.innerHTML = gbar2010Data;
            document.body.insertBefore(gBar, document.body.firstChild);
            break
        case "2011":
            var gbar2011 = 'https://raw.githubusercontent.com/CallyHam/GBar/main/pages/2011.html'
            var gbar2011Response = await fetch(gbar2011);
            var gbar2011Data = await gbar2011Response.text();
            gBar.classList.add('gbar');
            gBar.innerHTML = gbar2011Data;
            document.body.insertBefore(gBar, document.body.firstChild);
            break
        case "2013":
            var gbar2013 = 'https://raw.githubusercontent.com/CallyHam/GBar/main/pages/2013.html'
            var gbar2013Response = await fetch(gbar2013);
            var gbar2013Data = await gbar2013Response.text();
            gBar.classList.add('gbar');
            gBar.innerHTML = gbar2013Data
            document.body.insertBefore(gBar, document.body.firstChild);
            document.body.insertBefore(gBar, document.body.firstChild);
            break
    }
    getUrl()
    if (styleSelect == "2009") {
        document.getElementsByClassName('gbar-link-active')[0].removeAttribute('href')
    }

    var accountStatus = detectAccountStatus()

    var accountButton = document.getElementById('gbar-link-account')
    var searchButton = document.getElementById('gbar-link-web')
    if (accountStatus) {
        switch (accountSelect) {
            case "name":
                accountButton.childNodes[1].textContent = accountName
                break
            case "email":
                accountButton.childNodes[1].textContent = accountEmail
                break
        }
        if (styleSelect != "2013" && styleSelect != "2009") {
            var accountArrow = document.createElement('div')
            accountArrow.classList.add('gbar-link-arrow')
            accountButton.href = "https://accounts.google.com/SignOutOptions"
            accountButton.appendChild(accountArrow)
        } else if (styleSelect == "2009") {
            accountButton.classList.add('signed-in')
            accountButton.removeAttribute('href')
        }
    }

    document.getElementById('gbar-settings-confirm').onclick = closeSettings;
    GM_registerMenuCommand("Open Settings", openSettings);
    switch (linkSelect) {
        case "web":
            searchButton.childNodes[1].textContent = "Web"
            break
        case "search":
            searchButton.childNodes[1].textContent = "Search"
            break
    }
}
async function openSettings() {
    var styleSelect = document.getElementById('year-style')
    var accountSelect = document.getElementById('account-text')
    var linkSelect = document.getElementById('search-text')
    styleSelect.value = await GM.getValue("styleSelect", "2011");
    accountSelect.value = await GM.getValue("accountSelect", "name");
    linkSelect.value = await GM.getValue("linkSelect", "web");
    settingsPage.classList.add('gbar-settings-active')
}
async function closeSettings() {
    var styleSelect = document.getElementById('year-style')
    var accountSelect = document.getElementById('account-text')
    var linkSelect = document.getElementById('search-text')
    await GM.setValue("styleSelect", styleSelect.value);
    await GM.setValue("accountSelect", accountSelect.value);
    await GM.setValue("linkSelect", linkSelect.value);
    settingsPage.classList.remove('gbar-settings-active')
    applySettings()
}
applySettings()

settingsPage.innerHTML = `
<style>
@import url('https://fonts.googleapis.com/css?family=Arial&display=swap');
.gbar-settings {
    display: none;
}
.gbar-settings.gbar-settings-active {
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: fixed;
    background-color: rgba(255, 255, 255, 50%);
    z-index: 999;
    height: 100%;
    width: 100%;
    top: 0;
}
.gbar-settings-center {
    display: flex;
    flex-direction: column;
    width: 40%;
    height: 80%;
    background-color: #fff;
    border: 1px solid #bebebe;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.gbar-settings-section {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    padding: 0 20px;
}
.gbar-settings-header {
    font-size: 15pt;
    width: calc(100% - 20px);
    height: 50px;
    padding-left: 20px;
    text-align: left;
    line-height: 50px;
    color: #de4b39;
    background-color: #f1f1f1;
    border-bottom: 1px solid #e5e5e5;
    text-justify: center;
}
.gbar-setting-title {
    font-size: 12pt;
    color: #444;
    text-align: left;
    margin: 20px 0;
}
.gbar-settings-footer {
    display: flex;
    flex-direction: column;
    border-top: 1px solid #e5e5e5;
    background-color: #f1f1f1;
    height: 45px;
    padding: 0 10px;
    justify-content: center;
    align-items: flex-end;
}
#gbar-settings-confirm {
    color: #fff;
    user-select: none;
    font-size: 8pt;
    font-weight: bold;
    border-radius: 2px;
    background-color: #1b7fcc;
    border: 1px solid #1b7fcc;
    padding: 7px 10px;
}
#gbar-settings-confirm:hover {
    background-color: #126db3;
}
#gbar-settings-confirm:active {
    background-color: #095b99;
}
.gbar-select-setting {
    width: 75%;
    height: 35px;
    appearance: none;
    font-size: 8pt;
    font-weight: bold;
    padding: 0 10px;
    background-color: #f4f4f4;
    color: #444;
    border: 1px solid #dcdcdc;
    border-radius: 2px;
}
.gbar-select-setting option {
    appearance: none;
    font-size: 10pt;
    font-weight: normal;
    color: #333 !important;
    padding: 100px;
    border: 1px solid #ccc;
}
.gbar-select-setting option:hover {
    appearance: none;
    background: #eee !important;
}
.gbar-select-setting:hover {
    border-color: #c6c6c6;
    background: linear-gradient(to bottom,#f8f8f8,#f1f1f1);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    cursor: pointer
}
.gbar-select-setting:focus {
    border-color: #ccc;
    background: linear-gradient(to bottom,#eee,#e0e0e0);
    box-shadow: inset 0 1px 2px rgba(0,0,0,.1);
    cursor: pointer
}
.gbar-settings-separator {
    width: 100%;
    height: 1px;
    background-color: #ebebeb;
    margin-top: 20px;
}
</style>
<form class="gbar-settings-center" onsubmit="return false;">
    <span class="gbar-settings-header">GBar Settings</span>
    <div class="gbar-settings-section">
        <span class="gbar-setting-title">Style Selection</span>
        <select class="gbar-select-setting" name="year-style" id="year-style">
            <option value="2009">2009</option>
            <option value="2010">2010</option>
            <option value="2011">2011</option>
            <option value="2013">2013</option>
        </select>
        <div class="gbar-settings-separator"></div>
        <span class="gbar-setting-title">Account Button Text</span>
        <select class="gbar-select-setting" name="account-text" id="account-text">
                <option value="name">Account Name</option>
                <option value="email">Account Email</option>
        </select>
        <div class="gbar-settings-separator"></div>
        <span class="gbar-setting-title">Google Search Link Text</span>
        <select class="gbar-select-setting" name="search-text" id="search-text">
                <option value="web">Web</option>
                <option value="search">Search</option>
        </select>
    </div>
    <div class="gbar-settings-footer">
        <button id="gbar-settings-confirm">OK</button>
    </div>
</form>

`
settingsPage.classList.add('gbar-settings')
document.body.insertBefore(settingsPage, document.body.firstChild);
