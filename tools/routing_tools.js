 const successfulBody = (result) => {
    return { ok: true, result:result }
}


 const failureBody = (result) => {
    return { ok: false, result:result }
}

module.exports = {
    failureBody:failureBody,
    successfulBody:successfulBody
}