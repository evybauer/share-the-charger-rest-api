const express = require("express");
const router = express.Router(); // Express subpackage that gives capabilities to handle  // different routes reaching different endpoints
const mongoose = require("mongoose");

const ConnectionType = require("../models/connectionType");
const Charger = require("../models/charger");

/**
 * @swagger
 * /connectionType:
 *    get:
 *      tags:
 *        - connectionType
 *      summary: Returns a list of all connection types (connectType table)
 *      description: This should return all chargers
 * tags:
 *  - name: connectionType
 *    description: Everything about connection types (connectType table)
 */

router.get("/", (req, res, next) => {
  ConnectionType.find()
    // .select('charger date hours total_price _id')
    .populate("charger") // JOIN TABLES
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        connection: docs.map(doc => {
          return {
            _id: doc._id,
            formalName: doc.formalName,
            title: doc.title,
            request: {
              type: "GET",
              url: "http://localhost:3000/connectionType/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
  const connectionType = new ConnectionType({
    // _id: mongoose.Types.ObjectId(),
    _id: req.body._id,
    formalName: req.body.formalName,
    title: req.body.title
  });
  connectionType
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Connection type created",
        createdConnectionType: {
          _id: result._id,
          formalName: result.formalName,
          title: result.title
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/connectionType/" + result._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:connectionTypeId", (req, res, next) => {
  ConnectionType.findById(req.params.connectionTypeId)
    .populate("charger") // JOIN TABLES
    .exec()
    .then(connectionType => {
      if (!connectionType) {
        return res.status(404).json({
          message: "Connection type not found"
        });
      }
      res.status(200).json({
        connectionType: connectionType,
        request: {
          type: "GET",
          url: "http://localhost:3000/connectionType"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.patch("/:connectionTypeId", (req, res, next) => {
  console.log(req.params.connectionTypeId);
  const id = req.params.connectionTypeId;
  const updateOps = {}; //update all Operations(Ops)
  console.log(req.body);
  for (const ops of req.body) {
    updateOps[ops.propTitle] = ops.value;
  }
  ConnectionType.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Connection type updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/chargers/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:connectionTypeId", (req, res, next) => {
  ConnectionType.remove({ _id: req.params.connectionTypeId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Connection type deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/connectionType",
          body: { formalName: "String", title: "String" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;