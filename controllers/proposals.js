const Proposal = require('../models/proposals');
const Joi = require('joi')

exports.getAddProduct = (req, res, next) => {
  res.render('add-proposal', {
    pageTitle: 'Add Proposal',
    path: '/member/add-proposal',
    formsCSS: true,
    productCSS: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  const schema = {
    title: Joi.string().min(5).required(),
    image: Joi.string().required(),
    description: Joi.string().min(50).max(500).required(),
    date: Joi.date().required(),
    tags: Joi.string().required(),
    votes: Joi.array().required(),
    members: Joi.number().required()
  }

  const { error } = Joi.validate(req.body, schema)
  if (error){
    res.status(400).send(error.details[0].message)
    return
  }

  const proposal = new Proposal(req.body);
  proposal.save();
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  Proposal.fetchAll(proposals => {
    res.render('../views/proposals', {
      props: proposals,
      pageTitle: 'Shop',
      path: '/',
      hasProposals: proposals.length > 0,
      activeProposal: true,
      productCSS: true
    });
  });
};
