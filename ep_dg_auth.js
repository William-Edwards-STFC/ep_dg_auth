const axios = require("axios-https-proxy-fix");
var settings = require("ep_etherpad-lite/node/utils/Settings");

const { server } = settings.users.dgserver;

exports.authenticate = function (hook_name, context, cb) {

  console.log("Authentication", {
    hook_name,
    sessionID: context.req.query.sessionID,
    padName: context.req.query.padName,
    server,
    cb,
  });

  const { sessionID, padName, username } = context.req.query;
  console.log(context);

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
        context.req.session.user = {
          username: "user",
          sessionID: context.req.query.sessionID,
          padName: context.req.query.padName
        }

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

exports.authorize = function (hook_name, context, cb) {
  const { sessionID, padName, username, investigationUser } = context.req.session.user;
  console.log("Authorize", {
    hook_name,
    sessionID,
    padName,
    username,
    investigationUser,
  });

  async function createPad(padName) {
    try {
      const response = await axios.post(`/createPad`, {
        padID: padName
      });
      return response.data.code === 0; 
    } catch (error) {
      console.error('Error creating pad:', error);
      return false;
    }
  }
  
  const padId = `${padName}`;
  createPad(padId)
    .then(created => {
      if (created) {
        console.log(`Pad '${padName}' created successfully.`);
      } else {
        console.log(`Failed to create pad '${padName}'.`);
      }
    });

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
        const responseData = response.data;
        if(responseData.investigationUser.user.includes(context.req.session.user.username)){
          if(responseData.investigationUser.role.includes("CI" || "PI")){
            returncb([true]);
          }
          return cb([readOnly]);
        }
        if(responseData.role.includes("InstrumentScientist"))
        console.log("Authorized ");

        context.req.session.user = {
          sessionID: context.req.query.sessionID,
          padName: context.req.query.padName,
          username: context.req.query.username,
          investigationUser: context.req.query.investigationUser
        }
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
    instance
    .get(`/usergroups/20`, {
      headers: {
        'Authorization': `Bearer ${sessionID}`
      }
    })
    .then((response) => {
      if (response.status == 200) {
        console.log("Authorized ");
        createPad(padId)

        context.req.session.user = {
          sessionID: context.req.query.sessionID,
          padName: context.req.query.padName,
          username: context.req.query.username,
          investigationUser: context.req.query.investigationUser
        }
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
