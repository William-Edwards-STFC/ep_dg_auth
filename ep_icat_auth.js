// Copyright 2021 Alejandro de Maria <demariaa@esrf.fr>
//
// @License MIT

const axios = require("axios-https-proxy-fix");
var settings = require("ep_etherpad-lite/node/utils/Settings");

const { server } = settings.users.icat;

exports.authenticate = function (hook_name, context, cb) {
  const { server } = settings.users.icat;

  console.log("Authentication", {
    hook_name,
    sessionID: context.req.query.sessionID,
    padName: context.req.query.padName,
    server,
    cb,
  });

  const { sessionID, padName, fullName } = context.req.query;

  console.log(context.req.query);
  if (!sessionID) {
    console.log("No sessionID");
    return cb([false]);
  }

  if (!padName) {
    console.log("No padName");
    return cb([false]);
  }

  const instance = axios.create({
    baseURL: server,
  });

  instance
    .get(`/investigations/${padName}`, {
      headers: {
        'Authorization': `Bearer ${sessionID}`
      }
    })
    .then((response) => {
      if (response.status == 200) {
        console.log("Authorized ");

        return cb([true]);
      }
      console.log("Unauthorized");
      return cb([false]);
    })
    .catch((e) => {
      console.log("Error produced on authenticate", { e });
      console.log(e);
      return cb([false]);
    });
};
 /**
exports.authorize = function (hook_name, context, cb) {
  const { sessionID, padName, username  } = context.req.session.user;
  console.log("Authorize", {
    hook_name,
    sessionID,
    padName,
    username,
  });

  const instance = axios.create({
    baseURL: server,
  });

  instance
    .get(`/sessions`, {
      headers: {
        'Authorization': `Bearer ${sessionID}`
      }
    })
    .then((response) => {
      if (response.status == 200) {
        console.log("Authorized ");
        context.req.session.user["username"] = username;

        return cb([true]);
      }
      console.log("Unauthorized");
      return cb([false]);
    })
    .catch((e) => {
      console.log("Error produced on authenticate", { e });
      console.log(e);
      return cb([false]);
    }); 
}; */
