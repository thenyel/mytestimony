/**
 * Route object passed to app  
 */
var request = require('request')
  , appHelper = require('./../js/utils/helpers.js');

// url mappings
var urls = {
    tags: "/api/v1/tags/"
  , testimonies: "/api/v1/testimonies/"
};


/**
 * Returns all tags formatted alphabetically
 *
 *
 * @param {webRoot} url format for host
 * @param {cb} Callback function to return data to
 * @return {Array} List of tags 
 */
var getTags = function(webRoot, cb) {
  var url   = webRoot + urls['tags']
  , options = {url: url, json: true};

  request.get(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var tags = body.sort(appHelper.compare);
      if (cb) cb(tags);
    } else {
      throw new Error(error); 
    }
  });
};


module.exports = {

  /**
   * About route
   * 
   * @name about
   * @param {Object} req - Reqeust object
   * @param {Object} res - Response object
   * @returns void - Render template
   * @method 
   * @author Ryan Regalado 
   */
  about: function(req,res) {
	res.render('about', {
		title: 'MyTestimony.com'
		, page: 'about'
	});
  }


  /**
   * Home page that gets testimony data from database
   * 
   * @name index
   * @param {Object} req - Reqeust object
   * @param {Object} res - Response object
   * @returns void - Render template
   * @method 
   * @author Ryan Regalado 
   */
  , index: function(req,res) {
    var host   = req.headers.host
    , tag      = req.params.tag
    , webRoot  = 'http://' + host
    , url      = (typeof tag !== 'undefined') ? webRoot + urls['tags'] + tag : webRoot + urls['testimonies']
    , options  = {url: url, json: true};

    // get tags
    getTags(webRoot, function(tags) {
      // makes it available for template to use
      res.locals.tags = tags;
      res.locals.pageTag = tag;

      // ajax request to get testimonies
      request.get(options, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          res.render('index', {
            title: 'MyTestimony.com'
            , page: 'home'
            , testimonies: body
          });
        }
      });
    });
  }

  /**
   * Share route
   * 
   * @name share
   * @param {Object} req - Reqeust object
   * @param {Object} res - Response object
   * @returns void - Render template
   * @method 
   * @author Ryan Regalado 
   */
  , share: function(req,res) {
	res.render('share', {
		title: 'MyTestimony.com'
		, page: 'share'
	});
  }




    /**
     * Gets all testimonies and renders to page
     *
     * @name testimonies
     * @param {Object} req - Reqeust object
     * @param {Object} res - Response object
     * @returns void - Render template
     * @method 
     * @author Ryan Regalado 
     */
  , testimonies: function(req, res) {
      var id    = req.params.id
      ,   host  = req.headers.host
      , webRoot = 'http://' + host
      , url     = webRoot + urls['testimonies'] + id
      , options = {url: url, json: true}
      ;

      // get tags
      getTags(webRoot, function(tags) {
        res.locals.tags = tags;

        // on success, get testimony
        // @todo Have each partial requests it's own data? Would have to do client side
        request.get(options, function(error, response, body) {
          if (!error && response.statusCode === 200) {
            var testimonyTags = body.tags;
            testimonyTags = testimonyTags.sort(appHelper.compare);

            if (testimonyTags.length === 1 && testimonyTags[0] === '') {
                testimonyTags = undefined;
            }

            res.render('testimonies', {
              title: 'MyTestimony.com - Testimony'
              , page: 'testimony'
              , testimony: body
              , testimonyTags: testimonyTags
            });
          }
        });
      });

  }

    /**
     * Adds tesimony to database via API
     * 
     * @name testimoniesAdd
     * @param {Object} req - Reqeust object
     * @param {Object} res - Response object
     * @returns void - Render template
     * @returns void - 
     * @method 
     * @author Ryan Regalado 
     */
  , testimoniesAdd: function(req, res) {
    var host     = req.headers.host
      , webRoot  = 'http://' + host
      , url      = webRoot + urls['testimonies']
      , formKeys = {} // object to pass post data 
      ;

    console.log('req body on add', req.body);

    formKeys = {
      form:{
          email: req.body.email
        , name: req.body.name
        , tags: req.body.tags
        , testimony: req.body.testimonyHidden
        , title: req.body.title
      }
    };

    request.post(url, formKeys, function(error, response, body) {
      if (!error && response.statusCode === 200) {
          res.redirect('/');
      }      
    });
  }
}; 
