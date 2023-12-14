import {Wsmt} from "website-monitor-tool"

new Wsmt({port: 1234, password: process.env.SERVER_PASSWORD, callback: (name) => {
    console.log(`${name} went down!`)
}})