const Proposal = require('../models/proposals');

exports.getAddProduct = (req, res, next) => {
  res.render('add-proposal', {
    pageTitle: 'Add Proposal',
    path: '/member/add-proposal',
    formsCSS: true,
    productCSS: true,
  });
};

exports.postAddProduct = (req, res, next) => {
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
