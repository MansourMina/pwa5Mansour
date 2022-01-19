const express = require('express');
const webpush = require('web-push');
const asyncHandler = require('express-async-handler');
require('dotenv').config();
const { getEmployees, deleteEmployee } = require('../model/employees');

const router = express.Router();

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
webpush.setVapidDetails(
  'mailto:mansour.m02@htlwienwest.at',
  publicVapidKey,
  privateVapidKey,
);
const subscription = [];

router.post(
  '/subscribe',
  asyncHandler(async (req, res) => {
    subscription.push(req.body);

    res.status(201).end();
  }),
);
router.post('/notify', (req, res) => {
  const payload = JSON.stringify({ title: 'Push Test', body: req.body });
  for (const sub of subscription) {
    try {
      webpush.sendNotification(sub, payload);
    } catch (error) {
      console.error(error);
    }
  }
  res.end();
});

router.get(
  '/employees',
  asyncHandler(async (req, res) => {
    res.json(getEmployees());
  }),
);
router.delete(
  '/employees/:id',
  asyncHandler(async (req, res) => {
    res.json(deleteEmployee(req.params.id));
  }),
);
module.exports = router;
