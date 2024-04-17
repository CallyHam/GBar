// ==UserScript==
// @name         GBar
// @namespace    https://www.github.com/CallyHam
// @version      1.1.0
// @description  Bring back the gbar.
// @author       CallyHam
// @match        *://*.google.com/*
// @run-at       document-body
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

var accountInfo
var accountName = "Sign in"
var accountEmail = "Sign in"

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

        var accountArrow = document.createElement('div')
        accountArrow.classList.add('gbar-link-arrow')
        accountButton.href = "https://accounts.google.com/SignOutOptions"
        accountButton.appendChild(accountArrow)
    }
}
async function applySettings() {
    var styleSelect = await GM.getValue("styleSelect", "2011");
    var accountSelect = await GM.getValue("accountSelect", "name");
    var linkSelect = await GM.getValue("linkSelect", "web");

    var accountButton = document.getElementById('gbar-link-account')
    var searchButton = document.getElementById('gbar-link-web')

    switch (await GM.getValue("accountSelect", "name")) {
        case "name":
            accountButton.childNodes[1].textContent = accountName
            break
        case "email":
            accountButton.childNodes[1].textContent = accountEmail
            break
    }

    switch (await GM.getValue("linkSelect", "web")) {
        case "web":
            searchButton.childNodes[1].textContent = "Web"
            break
        case "search":
            searchButton.childNodes[1].textContent = "Search"
            break
    }
}
var gBar = document.createElement('div');
var settingsPage = document.createElement('div');
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
const settingsHTML = 'https://raw.githubusercontent.com/CallyHam/GBar/main/pages/settings.html'
const settingsResponse = await fetch(settingsHTML);
const settingsData = await settingsResponse.text();
settingsPage.innerHTML = settingsData
settingsPage.classList.add('gbar-settings')

const gbar2011 = 'https://raw.githubusercontent.com/CallyHam/GBar/main/pages/2011.html'
const gbar2011Response = await fetch(gbar2011);
const gbar2011Data = await gbar2011Response.text();
gBar.classList.add('gbar');
gBar.innerHTML = gbar2011Data;

document.body.insertBefore(gBar, document.body.firstChild);
document.body.insertBefore(settingsPage, document.body.firstChild);
document.getElementById('gbar-settings-confirm').onclick = closeSettings;
getUrl()
detectAccountStatus()
applySettings()
GM_registerMenuCommand("Open Settings", openSettings);
