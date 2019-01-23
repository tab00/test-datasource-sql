import { Meteor } from "meteor/meteor"

export const isLocal = () => Meteor.absoluteUrl().includes("localhost")

//export const isNumeric = n => !Number.isNaN(parseFloat(n)) && Number.isFinite(parseFloat(n))
export const isNumeric = n => !Number.isNaN(n - parseFloat(n)) //https://github.com/angular/angular/blob/4.3.x/packages/common/src/pipes/number_pipe.ts#L172


export const log = Meteor.bindEnvironment((logText, level = "info") => {
  import { _ } from "meteor/underscore"
  let userId
  if (_.has(this, "userId")) userId = this.userId
  else {
    try {
      userId = Meteor.userId()
    } catch (error) {
      if (!error.message.includes("method calls")) console.error(error)
    }
  }

  // if (isLocal()) log(`${userId}, ${logText}`)
  // else {
  //   import winston from "winston"

  //   winston.log(level, `${userId ? `userId: ${userId}, ` : ""}${logText}`)
  // }
  console.log(userId ? `${userId}, ${logText}` : `${logText}`)
})
