import { Meteor } from "meteor/meteor"
import React from "react"

Meteor.startup(() => {
  import { render } from "react-dom"
  import App from "/imports/ui/App.jsx"

  render(<App />, document.getElementById("render-target"))
})
